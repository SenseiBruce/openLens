# Threat Model

**Project:** [Project Name]
**Date:** [YYYY-MM-DD]
**Security Engineer:** [Name]
**Version:** [X.Y]

## Executive Summary
[Brief overview of the threat modeling exercise and key findings]

## System Overview

### System Description
[Detailed description of the system being analyzed]

### System Architecture
```
[Architecture diagram or description]
```

### Trust Boundaries
| Boundary | Description | Security Controls |
|----------|-------------|-------------------|
| [Boundary 1] | [Description] | [Controls] |
| [Boundary 2] | [Description] | [Controls] |

## Assets

### Critical Assets
| Asset | Type | Sensitivity | Business Impact |
|-------|------|-------------|-----------------|
| [Asset 1] | [Data/Service/System] | [High/Medium/Low] | [Impact description] |
| [Asset 2] | [Data/Service/System] | [High/Medium/Low] | [Impact description] |

### Data Flows
| Source | Destination | Data Type | Protocol | Encryption |
|--------|-------------|-----------|----------|------------|
| [Source] | [Destination] | [Type] | [Protocol] | [Yes/No] |

## Threat Analysis (STRIDE)

### Spoofing
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-S-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

### Tampering
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-T-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

### Repudiation
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-R-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

### Information Disclosure
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-I-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

### Denial of Service
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-D-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

### Elevation of Privilege
| Threat ID | Description | Attack Vector | Likelihood | Impact | Risk Level |
|-----------|-------------|---------------|------------|--------|------------|
| T-E-001 | [Threat description] | [How attack occurs] | [High/Medium/Low] | [High/Medium/Low] | [Critical/High/Medium/Low] |

## Attack Trees

### Attack Scenario 1: [Scenario Name]
```
Goal: [Attacker goal]
├── Path 1: [Attack path]
│   ├── Step 1: [Action]
│   └── Step 2: [Action]
└── Path 2: [Alternative path]
    ├── Step 1: [Action]
    └── Step 2: [Action]
```

## Mitigations

### Recommended Controls
| Threat ID | Mitigation Strategy | Implementation Priority | Owner | Status |
|-----------|---------------------|------------------------|-------|--------|
| T-S-001 | [Mitigation description] | [Critical/High/Medium/Low] | [Team/Person] | [Planned/In Progress/Completed] |
| T-T-001 | [Mitigation description] | [Critical/High/Medium/Low] | [Team/Person] | [Planned/In Progress/Completed] |

### Defense in Depth
| Layer | Controls | Implementation Status |
|-------|----------|----------------------|
| Network | [Firewall, IDS, etc.] | [Status] |
| Application | [Input validation, authentication, etc.] | [Status] |
| Data | [Encryption, access control, etc.] | [Status] |

## Risk Assessment

### Risk Matrix
| Risk Level | Count | Percentage |
|------------|-------|------------|
| Critical | [N] | [%] |
| High | [N] | [%] |
| Medium | [N] | [%] |
| Low | [N] | [%] |

### Residual Risk
[Description of remaining risk after mitigations are implemented]

## Assumptions and Dependencies
- [Assumption 1]
- [Assumption 2]
- [Dependency 1]
- [Dependency 2]

## Out of Scope
- [Item 1]
- [Item 2]

## Review and Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Engineer | [Name] | [Date] | [Signature] |
| Security Architect | [Name] | [Date] | [Signature] |
| Technical Lead | [Name] | [Date] | [Signature] |

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial version |
