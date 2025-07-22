# Twinning Architecture

Self-hosted AI infrastructure for data sovereignty and human-amplified analytics.

## Stack Overview
**Phase 0.5:** Nextcloud + Docker + Prometheus/Grafana + Firefly III + InfluxDB
**Phase 1.0:** + Local LLMs + Whisper + SaaS migration tools  
**Phase 2.0:** + Federated sync + ML predictions + Voice agent

## Security Model

- **Zero Cloud Dependencies**: All processing happens locally/VPS
- **Encrypted Storage**: AES-256 for data at rest
- **VPN Access**: WireGuard for secure remote connections  
- **Backup Strategy**: Local + encrypted cloud redundancy
- **Certificate Management**: Let's Encrypt for HTTPS

## Deployment Options

### Mac Mini (Local)
- Docker Desktop + Homebrew
- Local development and testing
- Family/personal use cases

### VPS (Production)  
- Ubuntu/Debian on InMotion VPS
- Public-facing with domain/SSL
- Business and client demonstration

### Hybrid Architecture
- Local Mac Mini for development
- VPS for production services
- Synced data between environments