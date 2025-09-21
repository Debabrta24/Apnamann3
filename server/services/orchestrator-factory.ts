/**
 * OrchestratorFactory - Creates and configures the AI orchestrator based on available API keys
 * 
 * This factory automatically detects available API keys and configures the orchestrator
 * to use external providers when available, or force offline mode when no keys are present.
 */

import { OfflineFirstAIOrchestrator, type OrchestratorConfig } from './offline-first-ai-orchestrator';
import { ExternalAIAdapter } from './external-ai-adapter';
import { PythonHealthcareAIAdapter } from './python-ai-adapter';
import type { IAIProvider } from './ai-provider';

class OrchestratorFactory {
  private static instance: OfflineFirstAIOrchestrator | null = null;
  private static isInitialized = false;

  /**
   * Get the singleton orchestrator instance
   */
  static getOrchestrator(): OfflineFirstAIOrchestrator {
    if (!this.instance || !this.isInitialized) {
      this.instance = this.createOrchestrator();
      this.isInitialized = true;
    }
    return this.instance;
  }

  /**
   * Create and configure the orchestrator for offline-only operation
   */
  private static createOrchestrator(): OfflineFirstAIOrchestrator {
    // Always force offline mode - no external API dependencies
    const forceOfflineMode = true;

    const config: Partial<OrchestratorConfig> = {
      forceOfflineMode,
      enableFallback: true,
      // More aggressive timeouts when we know we don't have keys
      externalProviderTimeoutMs: forceOfflineMode ? 1000 : 8000,
      localProviderTimeoutMs: 2000,
      circuitBreakerFailureThreshold: 2,
      circuitBreakerRecoveryTimeMs: 30000, // 30 seconds in dev, faster recovery
    };

    const orchestrator = new OfflineFirstAIOrchestrator(config);

    // External AI providers disabled for offline-only operation

    // Python Healthcare AI disabled for offline-only operation to ensure fast responses

    // Log the orchestrator configuration
    console.log('🔄 AI Orchestrator initialized in OFFLINE MODE - working without external APIs');
    console.log('   ✓ Local AI will handle all requests');
    console.log('   ✓ Crisis detection available offline');
    console.log('   ✓ Guided exercises available offline');

    return orchestrator;
  }

  /**
   * Reset the factory (useful for testing or configuration changes)
   */
  static reset(): void {
    this.instance = null;
    this.isInitialized = false;
  }

  /**
   * Check if external AI providers are available
   */
  static hasExternalProviders(): boolean {
    return false; // Always offline mode
  }

  /**
   * Get AI capabilities information for frontend
   */
  static getCapabilities() {
    const orchestrator = this.getOrchestrator();
    
    return {
      offline: true,
      providers: ['local'],
      mode: 'offline',
      status: orchestrator.getProviderStatus()
    };
  }
}

export { OrchestratorFactory };