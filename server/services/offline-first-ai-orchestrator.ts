/**
 * OfflineFirstAIOrchestrator - Intelligent AI service orchestration with offline-first design
 * 
 * This orchestrator prioritizes external AI services (OpenAI, Gemini) but gracefully falls back
 * to LocalAIService when external services are unavailable, slow, or rate-limited.
 * 
 * Features:
 * - Circuit breaker pattern for external services
 * - Configurable timeouts and retries
 * - Health monitoring and automatic recovery
 * - Seamless offline mode operation
 * - Intelligent provider selection
 */

import type { 
  IAIProvider, 
  ChatMessage, 
  PsychologicalResponse, 
  PersonalityConfig, 
  CrisisAnalysisResult, 
  ExerciseType,
  IAIProviderConfig
} from './ai-provider';
import { LocalAIAdapter } from './local-ai-adapter';

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
}

interface ProviderHealth {
  isAvailable: boolean;
  lastCheck: number;
  responseTimeMs: number;
  circuitBreaker: CircuitBreakerState;
}

export interface OrchestratorConfig {
  // Timeout settings
  externalProviderTimeoutMs: number;
  localProviderTimeoutMs: number;
  
  // Circuit breaker settings
  circuitBreakerFailureThreshold: number;
  circuitBreakerRecoveryTimeMs: number;
  circuitBreakerHalfOpenRetryMs: number;
  
  // Health check settings
  healthCheckIntervalMs: number;
  healthCheckTimeoutMs: number;
  
  // Provider preferences
  preferredExternalProvider: 'primary' | 'secondary' | 'auto';
  forceOfflineMode: boolean;
  enableFallback: boolean;
}

export class OfflineFirstAIOrchestrator implements IAIProvider {
  private config: OrchestratorConfig;
  private localProvider: LocalAIAdapter;
  private externalProviders: Map<string, IAIProvider>;
  private providerHealth: Map<string, ProviderHealth>;
  private lastHealthCheck: number = 0;

  constructor(config: Partial<OrchestratorConfig> = {}, chatData?: string) {
    this.config = {
      externalProviderTimeoutMs: 8000,
      localProviderTimeoutMs: 2000,
      circuitBreakerFailureThreshold: 3,
      circuitBreakerRecoveryTimeMs: 60000, // 1 minute
      circuitBreakerHalfOpenRetryMs: 30000, // 30 seconds
      healthCheckIntervalMs: 30000, // 30 seconds
      healthCheckTimeoutMs: 5000,
      preferredExternalProvider: 'auto',
      forceOfflineMode: false,
      enableFallback: true,
      ...config
    };

    this.localProvider = new LocalAIAdapter(chatData);
    this.externalProviders = new Map();
    this.providerHealth = new Map();
  }

  /**
   * Register an external AI provider
   */
  registerExternalProvider(name: string, provider: IAIProvider): void {
    this.externalProviders.set(name, provider);
    this.providerHealth.set(name, {
      isAvailable: true,
      lastCheck: 0,
      responseTimeMs: 0,
      circuitBreaker: {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: 0,
        successCount: 0
      }
    });
  }

  /**
   * Generate response with intelligent provider selection
   */
  async generateResponse(messages: ChatMessage[], personality?: PersonalityConfig): Promise<PsychologicalResponse> {
    const userMessage = messages[messages.length - 1]?.content || '';
    const isHealthcareQuery = this.isHealthcareRelated(userMessage);

    // Force offline mode if configured
    if (this.config.forceOfflineMode) {
      console.log('Offline mode forced, using LocalAI');
      
      // Try Python healthcare AI first for medical queries
      if (isHealthcareQuery) {
        const pythonProvider = this.externalProviders.get('python-healthcare');
        if (pythonProvider) {
          try {
            console.log('Attempting healthcare query with Python AI');
            return await this.executeWithTimeout(
              () => pythonProvider.generateResponse(messages, personality),
              15000, // 15 second timeout for Python AI
              'Python Healthcare AI'
            );
          } catch (error) {
            console.warn('Python Healthcare AI failed, falling back to LocalAI:', error);
          }
        }
      }
      
      return this.executeWithTimeout(
        () => this.localProvider.generateResponse(messages, personality),
        this.config.localProviderTimeoutMs,
        'LocalAI'
      );
    }

    // Check health and update circuit breakers
    await this.updateProviderHealth();

    // Try external providers first
    const availableProviders = this.getAvailableExternalProviders();
    
    for (const providerName of availableProviders) {
      try {
        console.log(`Attempting response generation with ${providerName}`);
        const provider = this.externalProviders.get(providerName);
        if (!provider) continue;

        const response = await this.executeWithTimeout(
          () => provider.generateResponse(messages, personality),
          this.config.externalProviderTimeoutMs,
          providerName
        );

        // Mark success
        this.recordProviderSuccess(providerName);
        console.log(`Successfully generated response with ${providerName}`);
        return response;

      } catch (error) {
        console.warn(`Provider ${providerName} failed:`, error);
        this.recordProviderFailure(providerName);
        continue; // Try next provider
      }
    }

    // Fallback to local provider
    if (this.config.enableFallback) {
      console.log('All external providers failed, falling back to LocalAI');
      
      // Try Python healthcare AI as additional fallback for medical queries
      if (isHealthcareQuery) {
        const pythonProvider = this.externalProviders.get('python-healthcare');
        if (pythonProvider) {
          try {
            console.log('Attempting healthcare fallback with Python AI');
            return await this.executeWithTimeout(
              () => pythonProvider.generateResponse(messages, personality),
              15000, // 15 second timeout for Python AI
              'Python Healthcare AI (fallback)'
            );
          } catch (error) {
            console.warn('Python Healthcare AI fallback failed:', error);
          }
        }
      }
      
      try {
        return await this.executeWithTimeout(
          () => this.localProvider.generateResponse(messages, personality),
          this.config.localProviderTimeoutMs,
          'LocalAI'
        );
      } catch (error) {
        console.error('LocalAI also failed:', error);
        // Return a basic fallback response
        return this.getEmergencyFallbackResponse();
      }
    }

    throw new Error('All AI providers are unavailable and fallback is disabled');
  }

  /**
   * Crisis analysis with provider selection
   */
  async analyzeForCrisis(message: string): Promise<CrisisAnalysisResult> {
    // Always try external providers first for crisis analysis as it's critical
    if (!this.config.forceOfflineMode) {
      const availableProviders = this.getAvailableExternalProviders();
      
      for (const providerName of availableProviders) {
        try {
          const provider = this.externalProviders.get(providerName);
          if (!provider?.analyzeForCrisis) continue;

          const result = await this.executeWithTimeout(
            () => provider.analyzeForCrisis!(message),
            this.config.externalProviderTimeoutMs,
            providerName
          );

          this.recordProviderSuccess(providerName);
          return result;

        } catch (error) {
          console.warn(`Crisis analysis failed with ${providerName}:`, error);
          this.recordProviderFailure(providerName);
          continue;
        }
      }
    }

    // Fallback to local analysis
    console.log('Using LocalAI for crisis analysis');
    return this.localProvider.analyzeForCrisis!(message);
  }

  /**
   * Guided exercise generation
   */
  async generateGuidedExercise(type: ExerciseType): Promise<string[]> {
    // Try external providers first
    if (!this.config.forceOfflineMode) {
      const availableProviders = this.getAvailableExternalProviders();
      
      for (const providerName of availableProviders) {
        try {
          const provider = this.externalProviders.get(providerName);
          if (!provider?.generateGuidedExercise) continue;

          const result = await this.executeWithTimeout(
            () => provider.generateGuidedExercise!(type),
            this.config.externalProviderTimeoutMs,
            providerName
          );

          this.recordProviderSuccess(providerName);
          return result;

        } catch (error) {
          console.warn(`Guided exercise generation failed with ${providerName}:`, error);
          this.recordProviderFailure(providerName);
          continue;
        }
      }
    }

    // Fallback to local generation
    console.log('Using LocalAI for guided exercise generation');
    return this.localProvider.generateGuidedExercise!(type);
  }

  /**
   * Check if orchestrator is available
   */
  async isAvailable(): Promise<boolean> {
    // If offline mode is forced, only check local provider
    if (this.config.forceOfflineMode) {
      return this.localProvider.isAvailable();
    }

    // Check if any provider is available
    const localAvailable = await this.localProvider.isAvailable();
    const externalAvailable = this.getAvailableExternalProviders().length > 0;

    return localAvailable || externalAvailable;
  }

  /**
   * Get provider identification
   */
  getProviderName(): string {
    if (this.config.forceOfflineMode) {
      return `Orchestrator (offline: ${this.localProvider.getProviderName()})`;
    }

    const availableExternal = this.getAvailableExternalProviders();
    if (availableExternal.length > 0) {
      return `Orchestrator (primary: ${availableExternal[0]}, fallback: ${this.localProvider.getProviderName()})`;
    }

    return `Orchestrator (offline: ${this.localProvider.getProviderName()})`;
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>, 
    timeoutMs: number, 
    providerName: string
  ): Promise<T> {
    const startTime = Date.now();
    
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${providerName} timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]).then(result => {
      const responseTime = Date.now() - startTime;
      this.updateProviderResponseTime(providerName, responseTime);
      return result;
    });
  }

  /**
   * Get available external providers based on circuit breaker status
   */
  private getAvailableExternalProviders(): string[] {
    const now = Date.now();
    return Array.from(this.externalProviders.keys()).filter(name => {
      const health = this.providerHealth.get(name);
      if (!health) return false;

      const breaker = health.circuitBreaker;
      
      // Circuit breaker is closed (working normally)
      if (!breaker.isOpen) return true;

      // Circuit breaker is open - check if recovery time has passed
      if (now - breaker.lastFailureTime > this.config.circuitBreakerRecoveryTimeMs) {
        // Allow half-open state for testing
        return true;
      }

      return false;
    });
  }

  /**
   * Update provider health status
   */
  private async updateProviderHealth(): Promise<void> {
    const now = Date.now();
    
    // Don't check too frequently
    if (now - this.lastHealthCheck < this.config.healthCheckIntervalMs) {
      return;
    }

    this.lastHealthCheck = now;

    // Check each external provider's health
    for (const [name, provider] of Array.from(this.externalProviders.entries())) {
      try {
        const startTime = Date.now();
        const available = await this.executeWithTimeout(
          () => provider.isAvailable(),
          this.config.healthCheckTimeoutMs,
          `${name} health check`
        ) as boolean;
        
        const responseTime = Date.now() - startTime;
        
        const health = this.providerHealth.get(name)!;
        health.isAvailable = available;
        health.lastCheck = now;
        health.responseTimeMs = responseTime;

      } catch (error) {
        const health = this.providerHealth.get(name)!;
        health.isAvailable = false;
        health.lastCheck = now;
        console.warn(`Health check failed for ${name}:`, error);
      }
    }
  }

  /**
   * Record provider success for circuit breaker
   */
  private recordProviderSuccess(providerName: string): void {
    const health = this.providerHealth.get(providerName);
    if (!health) return;

    const breaker = health.circuitBreaker;
    breaker.successCount++;
    breaker.failureCount = 0;
    
    // Close circuit breaker if it was open
    if (breaker.isOpen) {
      console.log(`Circuit breaker closed for ${providerName} after successful request`);
      breaker.isOpen = false;
    }
  }

  /**
   * Record provider failure for circuit breaker
   */
  private recordProviderFailure(providerName: string): void {
    const health = this.providerHealth.get(providerName);
    if (!health) return;

    const breaker = health.circuitBreaker;
    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();
    breaker.successCount = 0;

    // Open circuit breaker if failure threshold reached
    if (breaker.failureCount >= this.config.circuitBreakerFailureThreshold && !breaker.isOpen) {
      console.warn(`Circuit breaker opened for ${providerName} after ${breaker.failureCount} failures`);
      breaker.isOpen = true;
    }
  }

  /**
   * Update provider response time metrics
   */
  private updateProviderResponseTime(providerName: string, responseTimeMs: number): void {
    const health = this.providerHealth.get(providerName);
    if (health) {
      health.responseTimeMs = responseTimeMs;
    }
  }

  /**
   * Emergency fallback response when all providers fail
   */
  private getEmergencyFallbackResponse(): PsychologicalResponse {
    return {
      message: "I'm having trouble connecting to my AI services right now, but I'm here to listen. " +
               "Please know that you're not alone, and if this is urgent, don't hesitate to reach out " +
               "to a counselor or crisis helpline immediately.",
      supportiveActions: [
        "Take deep breaths to stay calm",
        "Reach out to a trusted friend or family member", 
        "Contact your campus counseling center",
        "Call a crisis helpline if you're in immediate distress"
      ],
      riskLevel: "moderate",
      escalationRequired: true
    };
  }

  /**
   * Get current provider health status (for monitoring/debugging)
   */
  getProviderStatus(): Record<string, any> {
    const status: Record<string, any> = {
      config: {
        forceOfflineMode: this.config.forceOfflineMode,
        enableFallback: this.config.enableFallback
      },
      providers: {}
    };

    // Add local provider status
    status.providers.local = {
      name: this.localProvider.getProviderName(),
      isAvailable: true, // LocalAI is always available
      type: 'local'
    };

    // Add external provider status
    for (const [name, provider] of Array.from(this.externalProviders.entries())) {
      const health = this.providerHealth.get(name);
      status.providers[name] = {
        name: provider.getProviderName(),
        isAvailable: health?.isAvailable ?? false,
        responseTimeMs: health?.responseTimeMs ?? 0,
        circuitBreakerOpen: health?.circuitBreaker.isOpen ?? false,
        failureCount: health?.circuitBreaker.failureCount ?? 0,
        lastCheck: health?.lastCheck ?? 0,
        type: 'external'
      };
    }

    return status;
  }

  /**
   * Check if a message is healthcare-related
   */
  private isHealthcareRelated(message: string): boolean {
    const healthcareKeywords = [
      'health', 'medical', 'disease', 'symptom', 'treatment', 'medicine',
      'doctor', 'hospital', 'diagnosis', 'therapy', 'medication', 'drug',
      'pain', 'fever', 'infection', 'cancer', 'diabetes', 'heart',
      'blood', 'surgery', 'vaccine', 'virus', 'bacteria', 'wellness',
      'nutrition', 'diet', 'exercise', 'mental health', 'depression',
      'anxiety', 'stress', 'injury', 'emergency', 'first aid'
    ];
    
    const messageLower = message.toLowerCase();
    return healthcareKeywords.some(keyword => messageLower.includes(keyword));
  }

  /**
   * Allow learning from chat data for the local provider
   */
  learnFromChat(chatContent: string): void {
    this.localProvider.learnFromChat(chatContent);
  }
}