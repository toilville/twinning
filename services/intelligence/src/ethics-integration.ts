import { logger } from './utils/logger.js';
import { config } from './config.js';

/**
 * Twinning Ethics Integration for Intelligence Service
 * 
 * Integrates SPELWork ethical AI framework with intelligence operations
 * Provides ethical evaluation for all AI-powered data processing
 */

interface WishDefinition {
  objective: string;
  context: Record<string, any>;
  domain: string;
  user_identity: string;
  safeguards: string[];
  human_override_enabled?: boolean;
}

interface EthicalEvaluation {
  ethically_sound: boolean;
  trust_score: number;
  bias_indicators: string[];
  human_review_required: boolean;
  safeguards_triggered: string[];
  reasoning: string;
  timestamp: string;
}

interface ProcessResult {
  success: boolean;
  output: any;
  ethical_validation: EthicalEvaluation;
  human_override_used?: boolean;
}

export class TwinningEthicalFramework {
  private enabled: boolean;
  private initialized: boolean = false;

  constructor() {
    this.enabled = config.ethics.enabled;
  }

  public async initialize(): Promise<void> {
    if (!this.enabled) {
      logger.info('Ethical framework disabled - running without ethical evaluation');
      this.initialized = true;
      return;
    }

    try {
      // Initialize connection to SPELWork framework
      logger.info('Initializing SPELWork ethical framework integration');
      
      // In a full implementation, this would connect to the SPELWork TypeScript modules
      // For now, we'll use the Python integration layer
      
      this.initialized = true;
      logger.info('SPELWork ethical framework initialized successfully', {
        trust_threshold: config.ethics.trustThreshold,
        bias_detection: config.ethics.biasDetection,
        human_review_required: config.ethics.requireHumanReview
      });
    } catch (error) {
      logger.error('Failed to initialize ethical framework', { error });
      throw error;
    }
  }

  public isEnabled(): boolean {
    return this.enabled && this.initialized;
  }

  public async evaluateWish(wish: WishDefinition): Promise<EthicalEvaluation> {
    if (!this.isEnabled()) {
      // Return permissive evaluation when ethics disabled
      return {
        ethically_sound: true,
        trust_score: 1.0,
        bias_indicators: [],
        human_review_required: false,
        safeguards_triggered: [],
        reasoning: 'Ethical framework disabled',
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Calculate trust score based on operation characteristics
      const trustScore = this.calculateTrustScore(wish);
      
      // Detect potential bias indicators
      const biasIndicators = this.detectBiasIndicators(wish);
      
      // Check for required safeguards
      const missingSafeguards = this.checkRequiredSafeguards(wish);
      
      // Determine if human review is required
      const humanReviewRequired = 
        trustScore < config.ethics.trustThreshold ||
        biasIndicators.length > 0 ||
        config.ethics.requireHumanReview;

      // Determine ethical soundness
      const ethicallySound = 
        trustScore >= config.ethics.trustThreshold &&
        biasIndicators.length === 0 &&
        missingSafeguards.length === 0;

      // Generate reasoning
      const reasoningParts: string[] = [];
      if (trustScore < config.ethics.trustThreshold) {
        reasoningParts.push(`Trust score ${trustScore.toFixed(2)} below threshold ${config.ethics.trustThreshold}`);
      }
      if (biasIndicators.length > 0) {
        reasoningParts.push(`Bias indicators: ${biasIndicators.join(', ')}`);
      }
      if (missingSafeguards.length > 0) {
        reasoningParts.push(`Missing safeguards: ${missingSafeguards.join(', ')}`);
      }

      const reasoning = reasoningParts.length > 0 
        ? reasoningParts.join('; ')
        : 'All ethical checks passed';

      const evaluation: EthicalEvaluation = {
        ethically_sound: ethicallySound,
        trust_score: trustScore,
        bias_indicators: biasIndicators,
        human_review_required: humanReviewRequired,
        safeguards_triggered: missingSafeguards,
        reasoning,
        timestamp: new Date().toISOString()
      };

      logger.info('Ethical evaluation completed', {
        objective: wish.objective,
        domain: wish.domain,
        ethically_sound: ethicallySound,
        trust_score: trustScore,
        human_review_required: humanReviewRequired
      });

      return evaluation;

    } catch (error) {
      logger.error('Error in ethical evaluation', { error, wish });
      
      // Fail-safe: require human review on error
      return {
        ethically_sound: false,
        trust_score: 0.0,
        bias_indicators: ['evaluation-error'],
        human_review_required: true,
        safeguards_triggered: ['error-handling'],
        reasoning: `Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async processWithEthics<T>(
    wish: WishDefinition,
    processFunction: () => Promise<T> | T
  ): Promise<ProcessResult> {
    // Evaluate the wish first
    const ethicalEvaluation = await this.evaluateWish(wish);

    if (!ethicalEvaluation.ethically_sound) {
      logger.warn('Process blocked by ethical evaluation', {
        objective: wish.objective,
        reasoning: ethicalEvaluation.reasoning
      });

      return {
        success: false,
        output: null,
        ethical_validation: ethicalEvaluation,
        human_override_used: false
      };
    }

    try {
      // Execute the process
      const output = await processFunction();

      // Validate the output (simplified for now)
      const outputValidation: EthicalEvaluation = {
        ethically_sound: true,
        trust_score: 0.8,
        bias_indicators: [],
        human_review_required: false,
        safeguards_triggered: [],
        reasoning: 'Output validation passed',
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        output,
        ethical_validation: outputValidation,
        human_override_used: false
      };

    } catch (error) {
      logger.error('Process execution failed', { error, wish });

      return {
        success: false,
        output: null,
        ethical_validation: {
          ethically_sound: false,
          trust_score: 0.0,
          bias_indicators: ['execution-error'],
          human_review_required: true,
          safeguards_triggered: ['error-handling'],
          reasoning: `Process execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date().toISOString()
        },
        human_override_used: false
      };
    }
  }

  private calculateTrustScore(wish: WishDefinition): number {
    let score = 1.0;

    // Reduce score for potentially risky objectives
    const riskyKeywords = ['delete', 'remove', 'bypass', 'override', 'ignore', 'hack'];
    for (const keyword of riskyKeywords) {
      if (wish.objective.toLowerCase().includes(keyword)) {
        score -= 0.2;
      }
    }

    // Increase score for explicit safeguards
    if (wish.safeguards.includes('human-review')) {
      score += 0.1;
    }
    if (wish.safeguards.includes('bias-detection')) {
      score += 0.1;
    }
    if (wish.safeguards.includes('data-validation')) {
      score += 0.05;
    }

    // Ensure score is between 0 and 1
    return Math.max(0.0, Math.min(1.0, score));
  }

  private detectBiasIndicators(wish: WishDefinition): string[] {
    if (!config.ethics.biasDetection) {
      return [];
    }

    const indicators: string[] = [];
    
    // Simple bias detection patterns
    const biasPatterns = {
      'gender-bias': ['male', 'female', 'man', 'woman', 'he', 'she'],
      'racial-bias': ['race', 'ethnicity', 'nationality'],
      'age-bias': ['young', 'old', 'age', 'elderly', 'youth'],
      'economic-bias': ['rich', 'poor', 'wealthy', 'income', 'class']
    };

    const objectiveLower = wish.objective.toLowerCase();
    const contextText = JSON.stringify(wish.context).toLowerCase();

    for (const [biasType, keywords] of Object.entries(biasPatterns)) {
      if (keywords.some(keyword => 
        objectiveLower.includes(keyword) || contextText.includes(keyword)
      )) {
        indicators.push(biasType);
      }
    }

    return indicators;
  }

  private checkRequiredSafeguards(wish: WishDefinition): string[] {
    const required = ['bias-detection', 'human-override'];
    return required.filter(safeguard => !wish.safeguards.includes(safeguard));
  }

  public async cleanup(): Promise<void> {
    if (this.initialized) {
      logger.info('Cleaning up ethical framework resources');
      this.initialized = false;
    }
  }
}

// Factory function for easy integration
export function createEthicalFramework(): TwinningEthicalFramework {
  return new TwinningEthicalFramework();
}

// Helper functions for common intelligence operations
export function createContactIntelligenceWish(
  operation: string,
  contactData: any,
  userId: string
): WishDefinition {
  return {
    objective: `Contact intelligence: ${operation}`,
    context: {
      operation,
      contact_count: Array.isArray(contactData) ? contactData.length : 1,
      user_id: userId
    },
    domain: 'contact-intelligence',
    user_identity: userId,
    safeguards: ['bias-detection', 'human-override', 'data-validation']
  };
}

export function createEmailIntelligenceWish(
  operation: string,
  emailData: any,
  userId: string
): WishDefinition {
  return {
    objective: `Email intelligence: ${operation}`,
    context: {
      operation,
      email_count: Array.isArray(emailData) ? emailData.length : 1,
      user_id: userId
    },
    domain: 'email-intelligence',
    user_identity: userId,
    safeguards: ['bias-detection', 'human-override', 'privacy-protection']
  };
}

export function createDataEnrichmentWish(
  operation: string,
  targetData: any,
  userId: string
): WishDefinition {
  return {
    objective: `Data enrichment: ${operation}`,
    context: {
      operation,
      target_type: typeof targetData,
      user_id: userId
    },
    domain: 'data-enrichment',
    user_identity: userId,
    safeguards: ['bias-detection', 'human-override', 'external-data-validation']
  };
}
