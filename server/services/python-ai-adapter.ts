/**
 * Python Healthcare AI Adapter
 * Interfaces with the Python Flask server to provide real-time healthcare search AI
 */

import type { 
  IAIProvider, 
  ChatMessage, 
  PsychologicalResponse, 
  PersonalityConfig, 
  CrisisAnalysisResult 
} from './ai-provider';
import axios from 'axios';

export class PythonHealthcareAIAdapter implements IAIProvider {
  private pythonServerUrl: string;
  private isServerRunning: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor(serverUrl: string = 'http://127.0.0.1:5001') {
    this.pythonServerUrl = serverUrl;
    this.checkServerHealth();
  }

  /**
   * Check if Python AI server is running
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.pythonServerUrl}/health`, {
        timeout: 5000
      });
      
      this.isServerRunning = response.status === 200;
      return this.isServerRunning;
    } catch (error) {
      this.isServerRunning = false;
      return false;
    }
  }

  /**
   * Generate response using Python healthcare AI
   */
  async generateResponse(messages: ChatMessage[], personality?: PersonalityConfig): Promise<PsychologicalResponse> {
    // Check if server is available
    if (!await this.isAvailable()) {
      throw new Error('Python Healthcare AI server is not available');
    }

    const userMessage = messages[messages.length - 1]?.content || '';

    try {
      const response = await axios.post(`${this.pythonServerUrl}/chat`, {
        message: userMessage,
        chat_history: messages.slice(-5), // Last 5 messages for context
        personality: personality
      }, {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const aiMessage = response.data.message;
        const sources = response.data.sources || [];
        const isHealthcareRelated = response.data.is_healthcare_related;

        // If not healthcare related, throw error to fallback to other AI
        if (!isHealthcareRelated) {
          throw new Error('Query not healthcare related');
        }

        // Format sources information
        let formattedMessage = aiMessage;
        if (sources.length > 0) {
          formattedMessage += '\n\n🔍 **Real-time search sources:**';
          sources.slice(0, 3).forEach((source: any, index: number) => {
            formattedMessage += `\n${index + 1}. [${source.title}](${source.url}) - ${source.domain}`;
          });
        }

        // Assess risk level based on message content
        const riskLevel = this.assessRiskLevel(userMessage);
        
        return {
          message: formattedMessage,
          supportiveActions: this.generateSupportiveActions(userMessage, aiMessage),
          riskLevel: riskLevel,
          escalationRequired: riskLevel === 'high'
        };
      } else {
        throw new Error(response.data.error || 'Python AI returned unsuccessful response');
      }

    } catch (error) {
      console.error('Python Healthcare AI error:', error);
      
      // If it's a healthcare query but we failed, provide a helpful fallback
      if (this.isHealthcareQuery(userMessage)) {
        return {
          message: "I'm having trouble accessing current medical information right now. " +
                  "For health concerns, please consult with a healthcare professional or " +
                  "visit trusted medical websites like Mayo Clinic, WebMD, or your doctor's portal.",
          supportiveActions: [
            "Consult with a healthcare provider",
            "Visit trusted medical websites",
            "Contact your doctor if symptoms persist",
            "Call emergency services if urgent"
          ],
          riskLevel: "moderate",
          escalationRequired: false
        };
      }
      
      throw error;
    }
  }

  /**
   * Analyze message for crisis indicators
   */
  async analyzeForCrisis(message: string): Promise<CrisisAnalysisResult> {
    // Use local crisis detection for now, as Python server focuses on healthcare search
    const riskLevel = this.assessRiskLevel(message);
    
    return {
      isHighRisk: riskLevel === 'high',
      severity: riskLevel as "low" | "moderate" | "high",
      indicators: this.extractTriggerWords(message),
      recommendedActions: this.getRecommendedActions(riskLevel)
    };
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return 'Python Healthcare Search AI';
  }

  /**
   * Check if message is healthcare-related
   */
  private isHealthcareQuery(query: string): boolean {
    const healthcareKeywords = [
      'health', 'medical', 'disease', 'symptom', 'treatment', 'medicine',
      'doctor', 'hospital', 'diagnosis', 'therapy', 'medication', 'drug',
      'pain', 'fever', 'infection', 'cancer', 'diabetes', 'heart',
      'blood', 'surgery', 'vaccine', 'virus', 'bacteria', 'wellness',
      'nutrition', 'diet', 'exercise', 'mental health', 'depression',
      'anxiety', 'stress', 'injury', 'emergency', 'first aid'
    ];
    
    const queryLower = query.toLowerCase();
    return healthcareKeywords.some(keyword => queryLower.includes(keyword));
  }

  /**
   * Assess risk level of message
   */
  private assessRiskLevel(message: string): 'low' | 'moderate' | 'high' {
    const highRiskWords = [
      'suicide', 'kill myself', 'end it all', 'can\'t go on', 'emergency',
      'dying', 'hurt myself', 'self harm', 'overdose'
    ];
    
    const moderateRiskWords = [
      'depressed', 'anxious', 'panic', 'crisis', 'urgent', 'worried',
      'scared', 'pain', 'trouble breathing', 'chest pain'
    ];
    
    const messageLower = message.toLowerCase();
    
    if (highRiskWords.some(word => messageLower.includes(word))) {
      return 'high';
    }
    
    if (moderateRiskWords.some(word => messageLower.includes(word))) {
      return 'moderate';
    }
    
    return 'low';
  }

  /**
   * Extract trigger words from message
   */
  private extractTriggerWords(message: string): string[] {
    const triggerWords = [
      'suicide', 'kill', 'die', 'hurt', 'emergency', 'crisis',
      'depressed', 'anxious', 'panic', 'urgent', 'pain'
    ];
    
    const messageLower = message.toLowerCase();
    return triggerWords.filter(word => messageLower.includes(word));
  }

  /**
   * Get recommended actions based on risk level (India-specific)
   */
  private getRecommendedActions(riskLevel: string): string[] {
    switch (riskLevel) {
      case 'high':
        return [
          'Contact emergency services immediately (112)',
          'Go to the nearest emergency room',
          'Call KIRAN Mental Health Helpline: 1800-599-0019',
          'Call AASRA Suicide Prevention: +91-22-27546669',
          'Don\'t be alone - contact a trusted person'
        ];
      case 'moderate':
        return [
          'Contact your healthcare provider',
          'Speak with a counselor or therapist',
          'Call your local health center',
          'Contact Vandrevala Foundation: +91-9999666555',
          'Reach out to a trusted friend or family member'
        ];
      default:
        return [
          'Continue monitoring your symptoms',
          'Practice self-care techniques',
          'Consider scheduling a check-up with a doctor',
          'Maintain healthy lifestyle habits'
        ];
    }
  }

  /**
   * Generate supportive actions based on user message and AI response
   */
  private generateSupportiveActions(userMessage: string, aiResponse: string): string[] {
    const actions: string[] = [];
    
    // Always include consulting healthcare provider for medical queries
    if (this.isHealthcareQuery(userMessage)) {
      actions.push('Consult with a qualified healthcare provider');
    }
    
    // Add specific actions based on message content
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('pain') || messageLower.includes('hurt')) {
      actions.push('Apply ice or heat as appropriate');
      actions.push('Rest and avoid aggravating activities');
    }
    
    if (messageLower.includes('stress') || messageLower.includes('anxious')) {
      actions.push('Practice deep breathing exercises');
      actions.push('Try meditation or mindfulness');
    }
    
    if (messageLower.includes('sleep') || messageLower.includes('tired')) {
      actions.push('Maintain a regular sleep schedule');
      actions.push('Create a relaxing bedtime routine');
    }
    
    if (messageLower.includes('diet') || messageLower.includes('nutrition')) {
      actions.push('Maintain a balanced diet');
      actions.push('Stay hydrated throughout the day');
    }
    
    // Default supportive actions
    if (actions.length === 0) {
      actions.push('Take care of yourself');
      actions.push('Monitor your symptoms');
      actions.push('Don\'t hesitate to seek help if needed');
    }
    
    return actions.slice(0, 4); // Limit to 4 actions
  }

  /**
   * Periodically check server health
   */
  private async checkServerHealth(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck > this.healthCheckInterval) {
      this.lastHealthCheck = now;
      await this.isAvailable();
    }
  }

  /**
   * Start Python AI server (if needed)
   */
  async startPythonServer(): Promise<boolean> {
    try {
      // First check if server is already running
      if (await this.isAvailable()) {
        console.log('🏥 Python Healthcare AI server is already running');
        return true;
      }

      console.log('🚀 Starting Python Healthcare AI server...');
      
      const { spawn } = require('child_process');
      const path = require('path');
      
      // Spawn Python server process
      const pythonProcess = spawn('python3', ['start_server.py', '--background'], {
        cwd: path.join(process.cwd(), 'python_ai'),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      // Handle process output
      pythonProcess.stdout?.on('data', (data: Buffer) => {
        console.log(`[Python AI] ${data.toString()}`);
      });

      pythonProcess.stderr?.on('data', (data: Buffer) => {
        console.error(`[Python AI Error] ${data.toString()}`);
      });

      pythonProcess.on('error', (error: Error) => {
        console.error('Failed to start Python AI process:', error);
      });

      // Allow server time to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if server is now available
      const isRunning = await this.isAvailable();
      if (isRunning) {
        console.log('✅ Python Healthcare AI server started successfully');
      } else {
        console.warn('⚠️ Python Healthcare AI server failed to start properly');
      }

      return isRunning;
    } catch (error) {
      console.error('Failed to start Python AI server:', error);
      return false;
    }
  }
}