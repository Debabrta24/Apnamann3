import { storage } from '../storage';
import { InsertWebSnapshot } from '@shared/schema';

export interface WebCacheSearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  cached: boolean;
  cacheDate?: Date;
}

export class WebCacheService {
  // Simulate caching web search results for offline access
  async cacheWebSearchResults(query: string, mockResults: WebCacheSearchResult[]): Promise<void> {
    const cacheExpiresAt = new Date();
    cacheExpiresAt.setDate(cacheExpiresAt.getDate() + 7); // Cache for 7 days

    for (const result of mockResults) {
      // Check if already cached
      const existing = await storage.getWebSnapshotByUrl(result.url);
      
      if (!existing) {
        const insertSnapshot: InsertWebSnapshot = {
          originalUrl: result.url,
          title: result.title,
          content: result.snippet,
          summary: result.snippet.substring(0, 200) + '...', // Brief summary
          domain: result.domain,
          searchQuery: query,
          tags: this.extractTagsFromContent(result.title + ' ' + result.snippet),
          cacheExpiresAt,
          isActive: true
        };

        await storage.createWebSnapshot(insertSnapshot);
      }
    }
  }

  // Simulate internet search that works offline
  async searchOffline(query: string, limit: number = 10): Promise<WebCacheSearchResult[]> {
    // First, search cached web snapshots
    const cachedResults = await storage.searchWebSnapshots(query, limit);
    
    const webResults: WebCacheSearchResult[] = cachedResults.map(snapshot => ({
      title: snapshot.title,
      url: snapshot.originalUrl,
      snippet: snapshot.summary || snapshot.content.substring(0, 150) + '...',
      domain: snapshot.domain,
      cached: true,
      cacheDate: snapshot.createdAt
    }));

    // If we have fewer cached results, add some mock "internet" results
    if (webResults.length < limit) {
      const mockResults = this.generateMockInternetResults(query, limit - webResults.length);
      webResults.push(...mockResults);
    }

    return webResults;
  }

  // Cache a specific URL for offline access (simulate web scraping)
  async cacheUrl(url: string, options?: { title?: string; content?: string; tags?: string[] }): Promise<void> {
    const existing = await storage.getWebSnapshotByUrl(url);
    
    if (existing) {
      // Update last accessed time
      await storage.updateWebSnapshot(existing.id, {
        lastAccessedAt: new Date()
      });
      return;
    }

    // Extract domain from URL
    const domain = this.extractDomain(url);
    
    // Generate or use provided content
    const title = options?.title || this.generateTitleFromUrl(url);
    const content = options?.content || this.generateMockContent(url);
    const tags = options?.tags || this.extractTagsFromContent(title + ' ' + content);

    const cacheExpiresAt = new Date();
    cacheExpiresAt.setDate(cacheExpiresAt.getDate() + 30); // Cache URLs for 30 days

    const insertSnapshot: InsertWebSnapshot = {
      originalUrl: url,
      title,
      content,
      summary: content.substring(0, 200) + '...',
      domain,
      searchQuery: null, // Not from a search query
      tags,
      cacheExpiresAt,
      isActive: true
    };

    await storage.createWebSnapshot(insertSnapshot);
  }

  // Get cached content for a URL
  async getCachedContent(url: string): Promise<any | null> {
    const snapshot = await storage.getWebSnapshotByUrl(url);
    
    if (snapshot) {
      // Update last accessed time
      await storage.updateWebSnapshot(snapshot.id, {
        lastAccessedAt: new Date()
      });
      
      return {
        title: snapshot.title,
        content: snapshot.content,
        summary: snapshot.summary,
        domain: snapshot.domain,
        tags: snapshot.tags,
        cacheDate: snapshot.createdAt,
        lastAccessed: snapshot.lastAccessedAt
      };
    }
    
    return null;
  }

  // Cleanup expired snapshots
  async cleanupExpiredCache(): Promise<number> {
    return await storage.cleanupExpiredSnapshots();
  }

  // Get cache statistics
  async getCacheStats(): Promise<any> {
    const allSnapshots = await storage.getActiveWebSnapshots();
    
    const stats = {
      totalSnapshots: allSnapshots.length,
      uniqueDomains: new Set(allSnapshots.map(s => s.domain)).size,
      searchQueries: allSnapshots.filter(s => s.searchQuery).length,
      directUrls: allSnapshots.filter(s => !s.searchQuery).length,
      oldestCache: allSnapshots.length > 0 ? Math.min(...allSnapshots.map(s => s.createdAt.getTime())) : null,
      newestCache: allSnapshots.length > 0 ? Math.max(...allSnapshots.map(s => s.createdAt.getTime())) : null
    };
    
    return stats;
  }

  // Seed some initial web content for offline demonstration
  async seedInitialWebContent(): Promise<void> {
    const mentalHealthUrls = [
      {
        url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders',
        title: 'Mental disorders - World Health Organization',
        content: 'Mental disorders are characterized by significant disturbances in cognition, emotional regulation, or behaviour. Examples include depression, anxiety disorders, schizophrenia, eating disorders and addictive behaviours. Mental disorders affect 1 in 4 people. Effective treatments exist for most mental disorders. The most common mental disorders are anxiety disorders, mood disorders, and substance use disorders.',
        tags: ['WHO', 'mental health', 'disorders', 'global health', 'statistics']
      },
      {
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
        title: 'Anxiety Disorders - National Institute of Mental Health',
        content: 'Anxiety disorders are the most common mental illness in the U.S., affecting 40 million adults. Anxiety disorders are highly treatable, yet only 36.9% of those suffering receive treatment. Common types include generalized anxiety disorder, panic disorder, and social anxiety disorder. Treatment typically involves psychotherapy, medication, or both.',
        tags: ['NIMH', 'anxiety', 'treatment', 'therapy', 'mental health']
      },
      {
        url: 'https://www.helpguide.org/articles/stress/stress-management.htm',
        title: 'Stress Management - HelpGuide.org',
        content: 'Effective stress management helps you break the hold stress has on your life. It includes techniques like deep breathing, meditation, regular exercise, and time management. The goal is to live a balanced life with time for work, relationships, relaxation, and fun. Chronic stress can impact both physical and mental health.',
        tags: ['stress management', 'relaxation', 'meditation', 'exercise', 'wellness']
      }
    ];

    for (const item of mentalHealthUrls) {
      await this.cacheUrl(item.url, {
        title: item.title,
        content: item.content,
        tags: item.tags
      });
    }
  }

  // Helper methods
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown-domain.com';
    }
  }

  private generateTitleFromUrl(url: string): string {
    const domain = this.extractDomain(url);
    const path = url.split('/').pop() || '';
    return `${domain.replace('www.', '')} - ${path.replace(/-/g, ' ')}`;
  }

  private generateMockContent(url: string): string {
    const domain = this.extractDomain(url);
    return `Content from ${domain}. This is cached content that would normally be fetched from the web. The content discusses topics related to mental health, wellness, and educational resources for students.`;
  }

  private extractTagsFromContent(text: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const uniqueWords = Array.from(new Set(words));
    return uniqueWords.slice(0, 5); // Return top 5 unique tags
  }

  private generateMockInternetResults(query: string, count: number): WebCacheSearchResult[] {
    const mockDomains = [
      'psychology.org', 'mentalhealth.gov', 'healthline.com', 
      'webmd.com', 'mayoclinic.org', 'psychologytoday.com'
    ];
    
    const results: WebCacheSearchResult[] = [];
    
    for (let i = 0; i < count; i++) {
      const domain = mockDomains[i % mockDomains.length];
      results.push({
        title: `${query} - Research and Information`,
        url: `https://${domain}/article/${query.replace(/\s+/g, '-').toLowerCase()}`,
        snippet: `Information about ${query} from ${domain}. This content would typically be fetched from the internet but is being simulated for offline functionality.`,
        domain,
        cached: false
      });
    }
    
    return results;
  }
}

// Export singleton instance
export const webCacheService = new WebCacheService();