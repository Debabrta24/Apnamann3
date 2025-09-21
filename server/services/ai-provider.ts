/**
 * Standardized interface for all AI service providers in the mental health support application.
 * This interface ensures consistent functionality across external API services (OpenAI, Gemini)
 * and local AI implementations.
 */

// Core types for AI provider interface
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface PsychologicalResponse {
  message: string;
  supportiveActions: string[];
  riskLevel: "low" | "moderate" | "high";
  escalationRequired: boolean;
}

// Additional configuration types
export interface PersonalityConfig {
  customPrompt?: string;
  name?: string;
  traits?: Record<string, any>;
}

export interface CrisisAnalysisResult {
  isHighRisk: boolean;
  severity: "low" | "moderate" | "high";
  indicators?: string[];
  recommendedActions?: string[];
}

// Exercise types with proper union for extensibility
export type ExerciseType = "breathing" | "relaxation" | "mindfulness" | (string & {});

export interface IAIProvider {
  /**
   * Generate a psychological response based on conversation history
   * @param messages - Array of conversation messages for context
   * @param personality - Optional custom personality configuration
   * @returns Promise resolving to structured psychological response
   */
  generateResponse(messages: ChatMessage[], personality?: PersonalityConfig): Promise<PsychologicalResponse>;

  /**
   * Analyze a message for crisis indicators and risk assessment
   * Optional method - providers can implement this or delegate to a crisis service
   * @param message - User message to analyze
   * @returns Promise resolving to crisis analysis with risk level
   */
  analyzeForCrisis?(message: string): Promise<CrisisAnalysisResult>;

  /**
   * Generate step-by-step guided exercise instructions
   * Optional method - providers can implement this or delegate to a shared service
   * @param type - Type of exercise (breathing, relaxation, mindfulness, etc.)
   * @returns Promise resolving to array of exercise steps
   */
  generateGuidedExercise?(type: ExerciseType): Promise<string[]>;

  /**
   * Check if the AI provider is currently available and functional
   * @returns Promise resolving to boolean indicating availability
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get the provider's identification string for logging/debugging
   * @returns Human-readable provider name
   */
  getProviderName(): string;
}

export interface IAIProviderConfig {
  timeoutMs?: number;
  maxRetries?: number;
  fallbackEnabled?: boolean;
}