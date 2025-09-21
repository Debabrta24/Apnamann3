/**
 * LocalAIAdapter - Wraps LocalAIService to implement the IAIProvider interface
 * This adapter enables the LocalAIService to work with the OfflineFirstAIOrchestrator
 * while providing fallback implementations for optional methods.
 */

import { LocalAIService } from './local-ai';
import type { 
  IAIProvider, 
  ChatMessage, 
  PsychologicalResponse, 
  PersonalityConfig, 
  CrisisAnalysisResult, 
  ExerciseType 
} from './ai-provider';

export class LocalAIAdapter implements IAIProvider {
  private localAI: LocalAIService;

  constructor(chatData?: string) {
    this.localAI = new LocalAIService(chatData);
  }

  /**
   * Generate psychological response using LocalAIService
   */
  async generateResponse(messages: ChatMessage[], personality?: PersonalityConfig): Promise<PsychologicalResponse> {
    // Apply personality configuration if provided
    if (personality) {
      const localPersonality = {
        customPrompt: personality.customPrompt,
        name: personality.name,
        traits: personality.traits
      };
      this.localAI.setCustomPersonality(localPersonality);
    }

    // LocalAIService.generateResponse is synchronous, so we wrap in Promise.resolve
    const localResponse = this.localAI.generateResponse(messages);

    // The response structure already matches PsychologicalResponse interface
    return {
      message: localResponse.message,
      supportiveActions: localResponse.supportiveActions,
      riskLevel: localResponse.riskLevel,
      escalationRequired: localResponse.escalationRequired
    };
  }

  /**
   * Basic crisis analysis using simple keyword detection
   * This is a simplified implementation - in production, this could delegate to a more sophisticated crisis service
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
      indicators = ['Expressions of hopelessness or depression'];
      recommendedActions = [
        'Encourage professional support',
        'Check in regularly',
        'Provide crisis hotline information'
      ];
    } else {
      recommendedActions = ['Continue supportive conversation', 'Monitor for changes'];
    }

    return {
      isHighRisk,
      severity,
      indicators,
      recommendedActions
    };
  }

  /**
   * Generate guided exercise instructions
   * This provides basic exercises - could be enhanced with more sophisticated content
   */
  async generateGuidedExercise(type: ExerciseType): Promise<string[]> {
    switch (type) {
      case "breathing":
        return [
          "Find a comfortable position, sitting or lying down",
          "Close your eyes or soften your gaze",
          "Breathe in slowly through your nose for 4 counts",
          "Hold your breath gently for 4 counts", 
          "Exhale slowly through your mouth for 6 counts",
          "Repeat this cycle 5-10 times",
          "Notice how your body feels more relaxed with each breath"
        ];

      case "relaxation":
        return [
          "Lie down in a comfortable position",
          "Start by tensing the muscles in your toes for 5 seconds, then release",
          "Move up to your calves - tense for 5 seconds, then relax",
          "Continue with your thighs, buttocks, and abdomen",
          "Tense your arms, hands, and shoulders, then let go",
          "Finally, scrunch your face muscles, then relax completely",
          "Take a moment to notice the feeling of complete relaxation",
          "Breathe deeply and enjoy this peaceful state"
        ];

      case "mindfulness":
        return [
          "Sit comfortably with your feet flat on the ground",
          "Take three deep breaths to center yourself",
          "Notice 5 things you can see around you",
          "Identify 4 things you can physically feel (chair, clothes, temperature)",
          "Listen for 3 different sounds in your environment",
          "Find 2 things you can smell",
          "Think of 1 thing you can taste",
          "Take a final deep breath and return to the present moment"
        ];

      default:
        return [
          "Sit in a quiet, comfortable space",
          "Take a few deep breaths to center yourself",
          "Focus on the present moment",
          "Allow thoughts to come and go without judgment",
          "When ready, gently return your attention to your surroundings"
        ];
    }
  }

  /**
   * Check if LocalAI is available (always true for local service)
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  /**
   * Get provider identification
   */
  getProviderName(): string {
    return "LocalAI";
  }

  /**
   * Allow learning from chat data for personality development
   */
  learnFromChat(chatContent: string): void {
    this.localAI.learnFromChat(chatContent);
  }
}