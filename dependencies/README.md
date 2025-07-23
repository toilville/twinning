# Twinning Dependencies

This directory contains external dependencies that are integrated into the Twinning ecosystem as git submodules or other dependency mechanisms.

## Current Dependencies

### SPELWork - Ethical AI Framework

**Location**: `dependencies/spelwork/`
**Type**: Git Submodule
**Purpose**: Ethical AI framework and process automation design methodology

SPELWork provides the foundational ethical AI framework that all Twinning services should build upon. It offers:

- **Ethical Process Design**: Framework for evaluating organizational processes
- **Human-Centered Automation**: Principles for preserving human agency in AI systems
- **Trust & Safety Integration**: Protective measures and ethical decision frameworks
- **Bias Detection**: Tools for identifying and mitigating systematic deviations

### Integration Pattern

All Twinning services should integrate SPELWork principles:

```typescript
// Example: How services should import and use SPELWork
import { EthicalFramework, WishDefinition, ProcessEvaluation } from '@toilville/spelwork';

// In your service initialization
const ethicalFramework = new EthicalFramework({
  service: 'scuttle-social',
  domain: 'social-media-automation',
  humanOverrideEnabled: true
});

// Before processing any AI requests
const wishEvaluation = await ethicalFramework.evaluateWish({
  objective: 'Generate social media content',
  context: userInput,
  safeguards: ['bias-detection', 'human-review']
});

if (wishEvaluation.ethicallySound) {
  // Proceed with AI processing
  const content = await processWithAI(input);
  return ethicalFramework.validateOutput(content);
}
```

### Service Integration Requirements

Every Twinning service must:

1. **Import SPELWork Framework**: Include ethical evaluation in all AI operations
2. **Implement Wish Definition**: Clear articulation of what the service aims to achieve
3. **Maintain Human Override**: Users can always override AI decisions
4. **Trust Metrics**: Implement multi-dimensional trust evaluation
5. **Bias Detection**: Monitor for and mitigate systematic biases

## Managing Dependencies

### Updating SPELWork

```bash
# Update to latest version
cd dependencies/spelwork
git pull origin main
cd ../..
git add dependencies/spelwork
git commit -m "Update SPELWork to latest version"
```

### Adding New Dependencies

When adding new dependencies to Twinning:

1. **Evaluate Need**: Ensure the dependency aligns with Twinning's self-hosted, privacy-first principles
2. **Choose Integration Method**: 
   - **Git Submodule**: For frameworks and libraries we want to track independently
   - **Package Dependency**: For stable, versioned packages
   - **API Integration**: For external services (discouraged)
3. **Document Integration**: Update this README and service documentation
4. **Implement Ethical Framework**: Ensure all dependencies respect SPELWork principles

### Dependency Philosophy

Twinning's approach to dependencies:

- **Prefer Self-Hosted**: Dependencies should not require external services
- **Respect Privacy**: No dependency should compromise user data sovereignty
- **Human Control**: All dependencies must preserve human agency and choice
- **Ethical Integration**: Apply SPELWork framework to all dependency decisions
- **Minimal Surface**: Keep dependencies minimal to reduce complexity and attack surface

## Future Dependencies

Planned dependency integrations:

- **Local LLM Framework**: Self-hosted language model infrastructure
- **Privacy-First Analytics**: Analytics that respects user privacy
- **Federated Identity**: Decentralized identity management
- **Encryption Libraries**: Enhanced data protection capabilities

## Contributing

When proposing new dependencies:

1. **Justify Need**: Explain why existing capabilities are insufficient
2. **Ethical Review**: Demonstrate alignment with SPELWork principles
3. **Integration Plan**: Provide detailed integration approach
4. **Documentation**: Include comprehensive usage documentation
5. **Testing**: Ensure thorough testing of integration points

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for general contribution guidelines.

## Support

For questions about Twinning dependencies:

- **SPELWork Issues**: Create issues in the [SPELWork repository](https://github.com/toilville/spelWork)
- **Integration Questions**: Create issues in the main [Twinning repository](https://github.com/toilville/twinning)
- **General Discussion**: Join our community discussions

---

**Dependencies serve human choice, not the other way around.**
