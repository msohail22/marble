# GitHub Workflows

Basic CI/CD workflows for Marble:

- **test.yml** - Linting, formatting, type checking
- **build.yml** - Build API & Web apps, upload artifacts
- **security.yml** - Security audits (scheduled weekly)
- **docker.yml** - Container builds

## Setup

1. Update Deno version in workflows (`vx.x.x` → current version)
2. Add secrets for deployment (Docker registry, etc.)
3. Connect to your CI/CD platform
