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
   * Create and configure the orchestrator based on available API keys
   */
  private static createOrchestrator(): OfflineFirstAIOrchestrator {
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
    const hasGeminiKey = !!(process.env.GEMINI_API_KEY);
    const isProduction = process.env.NODE_ENV === 'production';

    // Determine if we should force offline mode
    const forceOfflineMode = !hasOpenAIKey && !hasGeminiKey;

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

    // Register external AI provider if API keys are available
    if (!forceOfflineMode) {
      try {
        const externalAdapter = new ExternalAIAdapter();
        console.log('Registering external AI provider with orchestrator');
        orchestrator.registerExternalProvider('external', externalAdapter);
      } catch (error) {
        console.warn('Failed to register external AI provider:', error);
      }
    }

    // Register Python Healthcare AI as an additional provider (always available)
    try {
      const pythonAI = new PythonHealthcareAIAdapter();
      console.log('Registering Python Healthcare AI provider');
      orchestrator.registerExternalProvider('python-healthcare', pythonAI);
      
      // Try to start the Python server
      pythonAI.startPythonServer().catch(error => {
        console.warn('Python AI server startup failed, will be used as fallback only:', error);
      });
    } catch (error) {
      console.warn('Failed to register Python Healthcare AI provider:', error);
    }

    // Log the orchestrator configuration
    if (forceOfflineMode) {
      console.log('🔄 AI Orchestrator initialized in OFFLINE MODE - no external API keys detected');
      console.log('   ✓ Local AI will handle all requests');
      console.log('   ✓ Python Healthcare AI available for medical queries');
      console.log('   ✓ Crisis detection available offline');
      console.log('   ✓ Guided exercises available offline');
    } else {
      console.log('🌐 AI Orchestrator initialized in HYBRID MODE');
      console.log(`   ✓ External providers: ${hasOpenAIKey ? 'OpenAI ' : ''}${hasGeminiKey ? 'Gemini ' : ''}`);
      console.log('   ✓ Python Healthcare AI available for medical queries');
      console.log('   ✓ Local AI fallback enabled');
    }

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
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPENAI_KEY);
    const hasGeminiKey = !!(process.env.GEMINI_API_KEY);
    return hasOpenAIKey || hasGeminiKey;
  }

  /**
   * Get AI capabilities information for frontend
   */
  static getCapabilities() {
    const hasExternal = this.hasExternalProviders();
    const orchestrator = this.getOrchestrator();
    
    return {
      offline: !hasExternal,
      providers: hasExternal ? ['external', 'python-healthcare', 'local'] : ['python-healthcare', 'local'],
      mode: hasExternal ? 'hybrid' : 'offline',
      status: orchestrator.getProviderStatus()
    };
  }
}

export { OrchestratorFactory };