#!/usr/bin/env python3
"""
Twinning-SPELWork Integration Layer
Python wrapper for integrating SPELWork ethical AI framework into Twinning services
"""

import os
import json
import logging
import subprocess
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class WishDefinition:
    """Defines a user's intention or desired outcome"""
    objective: str
    context: Dict[str, Any]
    domain: str
    user_identity: str
    safeguards: List[str]
    human_override_enabled: bool = True

@dataclass
class EthicalEvaluation:
    """Result of ethical evaluation of a wish or process"""
    ethically_sound: bool
    trust_score: float
    bias_indicators: List[str]
    human_review_required: bool
    safeguards_triggered: List[str]
    reasoning: str
    timestamp: str

@dataclass
class ProcessResult:
    """Result of a process execution with ethical validation"""
    success: bool
    output: Any
    ethical_validation: EthicalEvaluation
    human_override_used: bool = False

class TwinningEthicalFramework:
    """
    Python integration layer for SPELWork ethical AI framework
    Provides ethical evaluation for all Twinning service AI operations
    """
    
    def __init__(self, service_name: str, domain: str, spelwork_path: str = None):
        self.service_name = service_name
        self.domain = domain
        self.spelwork_path = spelwork_path or os.path.join(
            os.path.dirname(__file__), 'spelwork'
        )
        self.ethics_config = self._load_ethics_config()
        
        logger.info(f"Initialized ethical framework for {service_name} in domain {domain}")
    
    def _load_ethics_config(self) -> Dict[str, Any]:
        """Load ethics configuration for the service"""
        config_path = os.path.join(self.spelwork_path, 'config', f'{self.service_name}.json')
        
        # Default ethical configuration
        default_config = {
            'trust_threshold': 0.7,
            'bias_detection_enabled': True,
            'human_review_threshold': 0.5,
            'required_safeguards': ['bias-detection', 'human-override'],
            'allowed_domains': [self.domain],
            'ethical_principles': [
                'human-agency-preservation',
                'transparency',
                'privacy-protection',
                'bias-mitigation',
                'user-control'
            ]
        }
        
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                default_config.update(user_config)
                logger.info(f"Loaded custom ethics config from {config_path}")
            except Exception as e:
                logger.warning(f"Failed to load custom ethics config: {e}")
        
        return default_config
    
    def evaluate_wish(self, wish: WishDefinition) -> EthicalEvaluation:
        """
        Evaluate the ethical soundness of a user's wish/intention
        """
        try:
            # Basic ethical checks
            trust_score = self._calculate_trust_score(wish)
            bias_indicators = self._detect_bias_indicators(wish)
            human_review_required = trust_score < self.ethics_config['trust_threshold']
            
            # Check if required safeguards are present
            missing_safeguards = [
                sg for sg in self.ethics_config['required_safeguards']
                if sg not in wish.safeguards
            ]
            
            # Determine if ethically sound
            ethically_sound = (
                trust_score >= self.ethics_config['trust_threshold'] and
                len(bias_indicators) == 0 and
                len(missing_safeguards) == 0 and
                wish.domain in self.ethics_config['allowed_domains']
            )
            
            # Generate reasoning
            reasoning_parts = []
            if trust_score < self.ethics_config['trust_threshold']:
                reasoning_parts.append(f"Trust score {trust_score:.2f} below threshold")
            if bias_indicators:
                reasoning_parts.append(f"Bias indicators detected: {', '.join(bias_indicators)}")
            if missing_safeguards:
                reasoning_parts.append(f"Missing safeguards: {', '.join(missing_safeguards)}")
            if wish.domain not in self.ethics_config['allowed_domains']:
                reasoning_parts.append(f"Domain '{wish.domain}' not in allowed domains")
            
            reasoning = '; '.join(reasoning_parts) if reasoning_parts else "All ethical checks passed"
            
            evaluation = EthicalEvaluation(
                ethically_sound=ethically_sound,
                trust_score=trust_score,
                bias_indicators=bias_indicators,
                human_review_required=human_review_required,
                safeguards_triggered=missing_safeguards,
                reasoning=reasoning,
                timestamp=datetime.now().isoformat()
            )
            
            logger.info(f"Ethical evaluation complete: {evaluation.ethically_sound} (trust: {trust_score:.2f})")
            return evaluation
            
        except Exception as e:
            logger.error(f"Error in ethical evaluation: {e}")
            # Fail-safe: require human review if evaluation fails
            return EthicalEvaluation(
                ethically_sound=False,
                trust_score=0.0,
                bias_indicators=['evaluation-error'],
                human_review_required=True,
                safeguards_triggered=['error-handling'],
                reasoning=f"Evaluation failed: {str(e)}",
                timestamp=datetime.now().isoformat()
            )
    
    def _calculate_trust_score(self, wish: WishDefinition) -> float:
        """Calculate trust score based on wish characteristics"""
        score = 1.0
        
        # Reduce score for potentially risky objectives
        risky_keywords = ['delete', 'remove', 'bypass', 'override', 'ignore', 'hack']
        for keyword in risky_keywords:
            if keyword.lower() in wish.objective.lower():
                score -= 0.2
        
        # Increase score for explicit safeguards
        if 'human-review' in wish.safeguards:
            score += 0.1
        if 'bias-detection' in wish.safeguards:
            score += 0.1
        
        # Ensure score is between 0 and 1
        return max(0.0, min(1.0, score))
    
    def _detect_bias_indicators(self, wish: WishDefinition) -> List[str]:
        """Detect potential bias indicators in the wish"""
        indicators = []
        
        # Simple bias detection (can be enhanced with ML models)
        bias_patterns = {
            'gender-bias': ['male', 'female', 'man', 'woman', 'he', 'she'],
            'racial-bias': ['race', 'ethnicity', 'nationality'],
            'age-bias': ['young', 'old', 'age', 'elderly', 'youth'],
            'economic-bias': ['rich', 'poor', 'wealthy', 'income', 'class']
        }
        
        objective_lower = wish.objective.lower()
        context_text = json.dumps(wish.context).lower()
        
        for bias_type, keywords in bias_patterns.items():
            if any(keyword in objective_lower or keyword in context_text for keyword in keywords):
                indicators.append(bias_type)
        
        return indicators
    
    def validate_output(self, output: Any, wish: WishDefinition) -> EthicalEvaluation:
        """Validate the output of a process for ethical compliance"""
        # This is a simplified validation - in practice, this would be more sophisticated
        return EthicalEvaluation(
            ethically_sound=True,  # Assume output is ethical if wish was approved
            trust_score=0.8,
            bias_indicators=[],
            human_review_required=False,
            safeguards_triggered=[],
            reasoning="Output validation passed",
            timestamp=datetime.now().isoformat()
        )
    
    def process_with_ethics(self, wish: WishDefinition, process_function, *args, **kwargs) -> ProcessResult:
        """
        Execute a process with ethical evaluation wrapper
        """
        # Evaluate the wish first
        ethical_evaluation = self.evaluate_wish(wish)
        
        if not ethical_evaluation.ethically_sound:
            logger.warning(f"Process blocked by ethical evaluation: {ethical_evaluation.reasoning}")
            return ProcessResult(
                success=False,
                output=None,
                ethical_validation=ethical_evaluation,
                human_override_used=False
            )
        
        try:
            # Execute the process
            output = process_function(*args, **kwargs)
            
            # Validate the output
            output_validation = self.validate_output(output, wish)
            
            return ProcessResult(
                success=True,
                output=output,
                ethical_validation=output_validation,
                human_override_used=False
            )
            
        except Exception as e:
            logger.error(f"Process execution failed: {e}")
            return ProcessResult(
                success=False,
                output=None,
                ethical_validation=EthicalEvaluation(
                    ethically_sound=False,
                    trust_score=0.0,
                    bias_indicators=['execution-error'],
                    human_review_required=True,
                    safeguards_triggered=['error-handling'],
                    reasoning=f"Process execution failed: {str(e)}",
                    timestamp=datetime.now().isoformat()
                ),
                human_override_used=False
            )
    
    def human_override(self, wish: WishDefinition, justification: str) -> bool:
        """
        Allow human override of ethical restrictions
        """
        if not wish.human_override_enabled:
            logger.warning("Human override attempted but not enabled for this wish")
            return False
        
        # Log the override for audit purposes
        logger.info(f"Human override used for {wish.objective}: {justification}")
        
        # In a production system, this might require additional authentication
        # or approval workflows
        
        return True

# Factory function for easy integration
def create_ethical_framework(service_name: str, domain: str) -> TwinningEthicalFramework:
    """Factory function to create ethical framework instance"""
    return TwinningEthicalFramework(service_name, domain)

# Example usage patterns for different Twinning services
class ScuttleEthicsIntegration:
    """Example integration for Scuttle social media service"""
    
    def __init__(self):
        self.ethics = create_ethical_framework('scuttle', 'social-media-automation')
    
    def ethical_content_processing(self, content: str, platforms: List[str], user_id: str):
        """Example of ethical AI content processing"""
        wish = WishDefinition(
            objective=f"Generate social media content for platforms: {', '.join(platforms)}",
            context={
                'original_content': content,
                'platforms': platforms,
                'user_id': user_id
            },
            domain='social-media-automation',
            user_identity=user_id,
            safeguards=['bias-detection', 'human-review', 'platform-compliance']
        )
        
        def process_content():
            # This would call the actual AI processing
            return f"Processed: {content}"
        
        result = self.ethics.process_with_ethics(wish, process_content)
        return result

# Usage example
if __name__ == "__main__":
    # Example usage
    ethics = create_ethical_framework('example-service', 'test-domain')
    
    wish = WishDefinition(
        objective="Test ethical framework",
        context={'test': True},
        domain='test-domain',
        user_identity='test-user',
        safeguards=['bias-detection', 'human-override']
    )
    
    evaluation = ethics.evaluate_wish(wish)
    print(f"Ethical evaluation: {evaluation}")
