import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export interface ImageDownloadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
  fileSize?: number;
  mimeType?: string;
}

export class ImageDownloaderService {
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
    // Note: SVG removed for security (XSS risk)
  ];
  
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly DOWNLOAD_FOLDER = path.resolve(process.cwd(), 'attached_assets', 'downloads');
  
  // Private IP ranges for SSRF protection
  private static readonly PRIVATE_IP_RANGES = [
    /^127\./,        // 127.0.0.0/8
    /^10\./,         // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
    /^192\.168\./,   // 192.168.0.0/16
    /^169\.254\./,   // 169.254.0.0/16 (link-local)
    /^::1$/,         // IPv6 loopback
    /^fc00:/,        // IPv6 unique local
    /^fe80:/         // IPv6 link-local
  ];
  
  /**
   * Check if IP address is private/internal
   */
  private static isPrivateIP(ip: string): boolean {
    return this.PRIVATE_IP_RANGES.some(range => range.test(ip));
  }

  /**
   * Sanitize filename to prevent path traversal
   */
  private static sanitizeFileName(fileName: string): string {
    // Remove path separators and dangerous characters
    const sanitized = fileName
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\.\.+/g, '_')
      .replace(/^[.\s]+|[.\s]+$/g, '')
      .substring(0, 50); // Limit length
    
    // Ensure filename is not empty after sanitization
    return sanitized || 'image';
  }

  /**
   * Download an image from a URL and save it to the attached_assets folder
   */
  static async downloadImage(url: string, customFileName?: string): Promise<ImageDownloadResult> {
    try {
      // Validate URL format
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          success: false,
          error: 'Only HTTP and HTTPS URLs are allowed'
        };
      }

      // SSRF Protection: Check if hostname resolves to private IP
      try {
        const { address } = await dnsLookup(urlObj.hostname);
        if (this.isPrivateIP(address)) {
          return {
            success: false,
            error: 'Access to private/internal IP addresses is not allowed'
          };
        }
      } catch (dnsError) {
        return {
          success: false,
          error: 'Unable to resolve hostname'
        };
      }

      // Make the request with timeout and redirect limits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'ApnaMann-ImageDownloader/1.0'
        },
        signal: controller.signal,
        redirect: 'manual' // Disable automatic redirects to prevent SSRF via redirects
      });
      
      // Check for redirects and reject them
      if (response.status >= 300 && response.status < 400) {
        return {
          success: false,
          error: 'Redirects are not allowed for security reasons'
        };
      }
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !this.ALLOWED_TYPES.includes(contentType.toLowerCase())) {
        return {
          success: false,
          error: `Unsupported image type: ${contentType}. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`
        };
      }

      // Check content length
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File too large: ${Math.round(parseInt(contentLength) / (1024 * 1024))}MB. Maximum allowed: ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
      }

      // Get the image data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Double-check file size after download
      if (buffer.length > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: `Downloaded file too large: ${Math.round(buffer.length / (1024 * 1024))}MB`
        };
      }

      // Generate secure filename
      const timestamp = Date.now();
      const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
      const extension = this.getExtensionFromMimeType(contentType);
      
      const fileName = customFileName 
        ? `${this.sanitizeFileName(customFileName)}_${timestamp}.${extension}`
        : `downloaded_image_${timestamp}_${hash}.${extension}`;

      // Verify the final path is within our download folder
      const filePath = path.join(this.DOWNLOAD_FOLDER, fileName);
      const resolvedPath = path.resolve(filePath);
      const resolvedDownloadFolder = path.resolve(this.DOWNLOAD_FOLDER);
      
      if (!resolvedPath.startsWith(resolvedDownloadFolder)) {
        return {
          success: false,
          error: 'Invalid file path detected'
        };
      }

      // Ensure download folder exists (create both attached_assets and downloads subfolder)
      if (!fs.existsSync(this.DOWNLOAD_FOLDER)) {
        fs.mkdirSync(this.DOWNLOAD_FOLDER, { recursive: true });
      }

      // Save the file using async write
      await fs.promises.writeFile(resolvedPath, buffer);

      // Verify file was written successfully
      if (!fs.existsSync(resolvedPath)) {
        return {
          success: false,
          error: 'Failed to save downloaded image'
        };
      }

      return {
        success: true,
        filePath: resolvedPath,
        fileName: fileName,
        fileSize: buffer.length,
        mimeType: contentType
      };

    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        return {
          success: false,
          error: 'Invalid URL format'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Download multiple images from URLs
   */
  static async downloadMultipleImages(urls: string[], customFileNames?: string[]): Promise<ImageDownloadResult[]> {
    const results: ImageDownloadResult[] = [];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const customName = customFileNames?.[i];
      
      try {
        const result = await this.downloadImage(url, customName);
        results.push(result);
        
        // Add a small delay between downloads to be respectful
        if (i < urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  /**
   * Get file extension from MIME type
   */
  private static getExtensionFromMimeType(mimeType: string): string {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    };
    
    return typeMap[mimeType.toLowerCase()] || 'jpg';
  }

  /**
   * Validate if a URL looks like an image URL
   */
  static isImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']; // Removed .svg for security
      
      return imageExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  }

  /**
   * Clean up old downloaded images (optional utility)
   */
  static cleanupOldImages(daysOld: number = 30): number {
    try {
      const files = fs.readdirSync(this.DOWNLOAD_FOLDER);
      const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const file of files) {
        if (file.startsWith('downloaded_image_')) {
          const filePath = path.join(this.DOWNLOAD_FOLDER, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old images:', error);
      return 0;
    }
  }
}