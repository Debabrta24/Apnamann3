/**
 * ExternalAIAdapter - Adapter that wraps the existing AIService to implement IAIProvider interface
 * 
 * This adapter allows the existing AIService (which handles OpenAI and Gemini) to be used
 * with the orchestrator by implementing the required IAIProvider interface.
 */

import type { 
  IAIProvider, 
  ChatMessage, 
  PsychologicalResponse, 
  PersonalityConfig, 
  CrisisAnalysisResult, 
  ExerciseType 
} from './ai-provider';
import { AIService } from './ai-service';

export class ExternalAIAdapter implements IAIProvider {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Generate psychological response using the external AIService
   */
  async generateResponse(messages: ChatMessage[], personality?: PersonalityConfig): Promise<PsychologicalResponse> {
    return this.aiService.generateResponse(messages, personality);
  }

  /**
   * Basic crisis analysis - delegate to simple keyword detection
   * The AIService doesn't have crisis analysis, so we implement a basic version
   */
  async analyzeForCrisis(message: string): Promise<CrisisAnalysisResult> {
    const messageLower = message.toLowerCase();
    
    // High-risk indicators
    const highRiskKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
      'hurt myself', 'self harm', 'overdose', 'pills', 'jumping', 'hanging'
    ];
    
    // Moderate risk indicators
    const moderateRiskKeywords = [
      'depressed', 'hopeless', 'worthless', 'empty', 'alone forever',
      'can\'t go on', 'no point', 'give up', 'tired of living'
    ];

    const hasHighRisk = highRiskKeywords.some(keyword => messageLower.includes(keyword));
    const hasModerateRisk = moderateRiskKeywords.some(keyword => messageLower.includes(keyword));

    let severity: "low" | "moderate" | "high" = "low";
    let isHighRisk = false;
    let indicators: string[] = [];
    let recommendedActions: string[] = [];

    if (hasHighRisk) {
      severity = "high";
      isHighRisk = true;
      indicators = ['Direct expression of self-harm intent'];
      recommendedActions = [
        'Immediate professional intervention required',
        'Contact emergency services if necessary',
        'Do not leave the person alone'
      ];
    } else if (hasModerateRisk) {
      severity = "moderate";
      isHighRisk = false;
      indicators = ['Expression of distress and hopelessness'];
      recommendedActions = [
        'Schedule professional counseling appointment',
        'Reach out to trusted friends or family',
        'Practice coping strategies and self-care'
      ];
    } else {
      severity = "low";
      isHighRisk = false;
      indicators = [];
      recommendedActions = [
        'Continue regular self-care practices',
        'Stay connected with support systems'
      ];
    }

    return {
      severity,
      isHighRisk,
      indicators,
      recommendedActions
    };
  }

  /**
   * Generate guided exercise using the AIService
   */
  async generateGuidedExercise(type: ExerciseType): Promise<string[]> {
    return this.aiService.generateGuidedExercise(type);
  }

  /**
   * Check if external AI services are available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Try a simple test to see if the service has valid API keys
      const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
      const hasGeminiKey = !!(process.env.GEMINI_API_KEY);
      
      return hasOpenAIKey || hasGeminiKey;
    } catch (error) {
      console.warn('ExternalAIAdapter availability check failed:', error);
      return false;
    }
  }

  /**
   * Get provider identification
   */
  getProviderName(): string {
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
    const hasGeminiKey = !!(process.env.GEMINI_API_KEY);
    
    if (hasOpenAIKey && hasGeminiKey) {
      return "ExternalAI (OpenAI + Gemini)";
    } else if (hasOpenAIKey) {
      return "ExternalAI (OpenAI)";
    } else if (hasGeminiKey) {
      return "ExternalAI (Gemini)";
    } else {
      return "ExternalAI (No keys)";
    }
  }
}