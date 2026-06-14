# Security Assessment

**Project:** [Project Name]
**Date:** [YYYY-MM-DD]
**Assessor:** [Name/Team]
**Assessment Type:** [Pre-Production/Annual/Incident-Driven/Compliance]
**Version:** [X.Y]

## Executive Summary

### Assessment Overview
[Brief description of the security assessment scope, objectives, and methodology]

### Assessment Scope
**In Scope:**
- [System/Application 1]
- [System/Application 2]
- [Infrastructure components]
- [Third-party integrations]

**Out of Scope:**
- [Item 1]
- [Item 2]

### Key Findings
- **Critical Issues:** [N]
- **High Risk Issues:** [N]
- **Medium Risk Issues:** [N]
- **Low Risk Issues:** [N]

### Overall Security Rating
**Rating:** [Excellent / Good / Fair / Poor / Critical]

**Justification:**
[Brief explanation of the overall rating]

### Recommendations Priority
1. [Top critical recommendation]
2. [Second critical recommendation]
3. [Third recommendation]

## Assessment Methodology

### Frameworks and Standards Used
- [ ] OWASP Testing Guide
- [ ] NIST Cybersecurity Framework
- [ ] SANS Top 25
- [ ] CIS Controls
- [ ] ISO 27001
- [ ] [Other frameworks]

### Assessment Activities
| Activity | Method | Coverage | Findings |
|----------|--------|----------|----------|
| Document Review | Manual | [100%] | [N issues] |
| Configuration Review | Manual/Automated | [100%] | [N issues] |
| Vulnerability Scanning | Automated | [100%] | [N issues] |
| Penetration Testing | Manual | [Selected components] | [N issues] |
| Code Review | Manual/Automated | [X%] | [N issues] |
| Interview Sessions | Manual | [N sessions] | [N findings] |

### Tools Used
| Tool | Purpose | Version |
|------|---------|---------|
| [Nessus] | Vulnerability scanning | [X.Y] |
| [Burp Suite] | Web app testing | [Professional] |
| [Metasploit] | Penetration testing | [X.Y] |
| [SonarQube] | Code analysis | [X.Y] |
| [Tool 5] | [Purpose] | [Version] |

## People, Process, and Technology Assessment

### 1. People

#### Organizational Structure
**Security Team Size:** [N people]
**Security Leadership:** [Dedicated CISO / Security Manager / Distributed]

**Key Roles:**
| Role | Filled | Name | FTE |
|------|--------|------|-----|
| CISO / Security Lead | [Yes/No] | [Name] | [X.X] |
| Security Architect | [Yes/No] | [Name] | [X.X] |
| Security Engineer | [Yes/No] | [Name] | [X.X] |
| Security Analyst | [Yes/No] | [Name] | [X.X] |

#### Security Awareness and Training
| Training Program | Frequency | Completion Rate | Status |
|------------------|-----------|-----------------|--------|
| General Security Awareness | Annual | [%] | [Pass/Fail] |
| Secure Coding Training | Annual | [%] | [Pass/Fail] |
| Phishing Simulation | Quarterly | [%] | [Pass/Fail] |
| Incident Response Training | Annual | [%] | [Pass/Fail] |

**Findings:**
- [Finding 1: e.g., Low completion rate for security training]
- [Finding 2: e.g., No role-specific security training]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

#### Security Culture
- [ ] Security champions program exists
- [ ] Regular security communications
- [ ] Security considerations in design reviews
- [ ] Developers follow secure coding practices

**Assessment:** [Strong / Moderate / Weak]

### 2. Process

#### Security Policies and Procedures
| Policy/Procedure | Exists | Last Updated | Reviewed Annually | Status |
|------------------|--------|--------------|-------------------|--------|
| Information Security Policy | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |
| Access Control Policy | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |
| Incident Response Plan | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |
| Data Protection Policy | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |
| Change Management | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |
| Vendor Security Policy | [Yes/No] | [Date] | [Yes/No] | [Current/Outdated] |

**Findings:**
- [Finding 1: e.g., Incident response plan outdated]
- [Finding 2: e.g., No data classification policy]

**Recommendations:**
- [Update outdated policies]
- [Create missing policies]

#### Secure Development Lifecycle
| SDLC Phase | Security Activities | Implementation | Status |
|------------|---------------------|----------------|--------|
| Requirements | Security requirements definition | [Yes/No] | [Pass/Fail] |
| Design | Threat modeling | [Yes/No] | [Pass/Fail] |
| Development | Secure coding practices | [Yes/No] | [Pass/Fail] |
| Testing | Security testing (SAST/DAST) | [Yes/No] | [Pass/Fail] |
| Deployment | Security configuration review | [Yes/No] | [Pass/Fail] |
| Maintenance | Vulnerability management | [Yes/No] | [Pass/Fail] |

**Maturity Level:** [Initial / Managed / Defined / Quantitatively Managed / Optimizing]

**Findings:**
- [Finding 1]
- [Finding 2]

#### Change Management
- [ ] Change approval process exists
- [ ] Security review required for changes
- [ ] Rollback procedures documented
- [ ] Change tracking and audit trail

**Assessment:** [Effective / Partially Effective / Ineffective]

#### Incident Response
- [ ] Incident response plan exists and current
- [ ] Incident response team identified
- [ ] Escalation procedures defined
- [ ] Regular IR exercises/drills
- [ ] Incident classification criteria
- [ ] Post-incident review process

**Assessment:** [Mature / Developing / Immature]

#### Vulnerability Management
- [ ] Vulnerability scanning process
- [ ] Patch management process
- [ ] SLA for vulnerability remediation
- [ ] Vulnerability tracking system
- [ ] Regular reporting to management

**Remediation SLAs:**
| Severity | SLA | Compliance |
|----------|-----|------------|
| Critical | [N days] | [%] |
| High | [N days] | [%] |
| Medium | [N days] | [%] |
| Low | [N days] | [%] |

**Assessment:** [Effective / Needs Improvement / Inadequate]

### 3. Technology

#### Authentication and Authorization

##### Authentication Mechanisms
| System | Auth Method | MFA | Password Policy | Session Timeout |
|--------|-------------|-----|-----------------|-----------------|
| [Application 1] | [SSO/Password] | [Yes/No] | [Strong/Weak] | [X min] |
| [Application 2] | [SSO/Password] | [Yes/No] | [Strong/Weak] | [X min] |

**Findings:**
- [Finding 1: e.g., MFA not enforced for admin accounts]
- [Finding 2: e.g., Weak password policy]

**Risk Level:** [High/Medium/Low]

##### Authorization Controls
- [ ] Role-based access control (RBAC) implemented
- [ ] Principle of least privilege enforced
- [ ] Regular access reviews conducted
- [ ] Segregation of duties

**Findings:**
- [Finding 1]
- [Finding 2]

#### Data Protection

##### Encryption
| Data Type | At Rest | In Transit | Key Management | Status |
|-----------|---------|------------|----------------|--------|
| User data | [AES-256/None] | [TLS 1.2+/None] | [KMS/Manual] | [Pass/Fail] |
| Payment data | [AES-256/None] | [TLS 1.2+/None] | [KMS/Manual] | [Pass/Fail] |
| Backups | [AES-256/None] | [TLS 1.2+/None] | [KMS/Manual] | [Pass/Fail] |

**Findings:**
- [Finding 1: e.g., Some databases not encrypted]
- [Finding 2: e.g., TLS 1.0/1.1 still enabled]

**Risk Level:** [Critical/High/Medium/Low]

##### Data Classification
- [ ] Data classification scheme defined
- [ ] Data labeled according to classification
- [ ] Handling procedures per classification
- [ ] Data retention policies enforced

**Assessment:** [Implemented / Partially Implemented / Not Implemented]

#### Network Security

##### Network Architecture
- [ ] Network segmentation implemented
- [ ] DMZ for public-facing services
- [ ] Separate management network
- [ ] Network diagram current and accurate

##### Firewall Configuration
- [ ] Firewall rules documented
- [ ] Default deny policy
- [ ] Regular rule reviews
- [ ] Change management for firewall rules

**Firewall Rule Quality:** [Good / Acceptable / Needs Improvement]

**Findings:**
- [Finding 1: e.g., Overly permissive rules]
- [Finding 2: e.g., Outdated rules not removed]

##### Network Monitoring
- [ ] Intrusion Detection System (IDS)
- [ ] Intrusion Prevention System (IPS)
- [ ] Network traffic analysis
- [ ] DDoS protection

**Assessment:** [Comprehensive / Adequate / Inadequate]

#### Application Security

##### Secure Coding Practices
| Practice | Implemented | Verified | Status |
|----------|-------------|----------|--------|
| Input validation | [Yes/No] | [Yes/No] | [Pass/Fail] |
| Output encoding | [Yes/No] | [Yes/No] | [Pass/Fail] |
| Parameterized queries | [Yes/No] | [Yes/No] | [Pass/Fail] |
| Error handling | [Yes/No] | [Yes/No] | [Pass/Fail] |
| Secure session management | [Yes/No] | [Yes/No] | [Pass/Fail] |

##### Vulnerability Assessment Results
| Vulnerability Type | Count | Severity Distribution (C/H/M/L) | Trend |
|-------------------|-------|--------------------------------|-------|
| SQL Injection | [N] | [C]/[H]/[M]/[L] | [↑/→/↓] |
| XSS | [N] | [C]/[H]/[M]/[L] | [↑/→/↓] |
| Authentication Issues | [N] | [C]/[H]/[M]/[L] | [↑/→/↓] |
| Authorization Issues | [N] | [C]/[H]/[M]/[L] | [↑/→/↓] |
| Configuration Issues | [N] | [C]/[H]/[M]/[L] | [↑/→/↓] |

##### Security Testing
- [ ] SAST (Static Application Security Testing) in CI/CD
- [ ] DAST (Dynamic Application Security Testing) regular scans
- [ ] Penetration testing annually
- [ ] Dependency scanning for vulnerable libraries

**Testing Coverage:** [%]
**Assessment:** [Mature / Developing / Immature]

#### Infrastructure Security

##### Server Hardening
| Component | CIS Benchmark | Patches Current | Unnecessary Services Disabled | Status |
|-----------|---------------|-----------------|------------------------------|--------|
| [Web Servers] | [Yes/No] | [Yes/No] | [Yes/No] | [Pass/Fail] |
| [App Servers] | [Yes/No] | [Yes/No] | [Yes/No] | [Pass/Fail] |
| [DB Servers] | [Yes/No] | [Yes/No] | [Yes/No] | [Pass/Fail] |

**Findings:**
- [Finding 1]
- [Finding 2]

##### Cloud Security (if applicable)
| Control | AWS/Azure/GCP | Implementation | Status |
|---------|---------------|----------------|--------|
| Account structure | [Multi-account/Single] | [Org structure] | [Pass/Fail] |
| IAM policies | [Least privilege] | [Yes/No] | [Pass/Fail] |
| Encryption | [KMS/Manual] | [Yes/No] | [Pass/Fail] |
| Logging | [CloudTrail/etc] | [Centralized] | [Pass/Fail] |
| Security services | [GuardDuty/etc] | [Enabled] | [Pass/Fail] |

**Cloud Security Posture:** [Strong / Moderate / Weak]

#### Logging and Monitoring

##### Logging Coverage
| System | Logs Collected | Retention | Centralized | Protected |
|--------|----------------|-----------|-------------|-----------|
| [Application] | [Yes/No] | [N days] | [Yes/No] | [Yes/No] |
| [Infrastructure] | [Yes/No] | [N days] | [Yes/No] | [Yes/No] |
| [Security devices] | [Yes/No] | [N days] | [Yes/No] | [Yes/No] |

##### Security Monitoring
- [ ] SIEM deployed
- [ ] Security event correlation
- [ ] Automated alerting
- [ ] 24/7 SOC or monitoring
- [ ] Incident response integration

**Monitoring Effectiveness:** [High / Medium / Low]

**Findings:**
- [Finding 1: e.g., Insufficient log retention]
- [Finding 2: e.g., No correlation of security events]

#### Backup and Recovery
- [ ] Regular backups performed
- [ ] Backups tested for restoration
- [ ] Backups encrypted
- [ ] Offsite/offline backup copies
- [ ] Documented recovery procedures
- [ ] RTO/RPO defined and tested

**Backup Strategy:** [Robust / Adequate / Inadequate]

**RTO:** [X hours]
**RPO:** [X hours]

## Risk Assessment Summary

### Risk Register
| Risk ID | Description | Likelihood | Impact | Risk Level | Mitigation |
|---------|-------------|------------|--------|------------|------------|
| RISK-001 | [Risk description] | [High/Med/Low] | [High/Med/Low] | [Critical/High/Med/Low] | [Mitigation plan] |
| RISK-002 | [Risk description] | [High/Med/Low] | [High/Med/Low] | [Critical/High/Med/Low] | [Mitigation plan] |

### Risk Heat Map
```
Impact
 High    │  3  │  6  │  9  │
 Medium  │  2  │  4  │  6  │
 Low     │  1  │  2  │  3  │
         └─────┴─────┴─────┘
          Low  Med  High
             Likelihood
```

**Risk Distribution:**
- Critical Risks: [N]
- High Risks: [N]
- Medium Risks: [N]
- Low Risks: [N]

## Detailed Findings

### Critical Findings

#### Finding C1: [Finding Title]
**Severity:** Critical
**Category:** [Authentication/Authorization/Encryption/etc.]

**Description:**
[Detailed description]

**Impact:**
[Potential business and technical impact]

**Affected Systems:**
- [System 1]
- [System 2]

**Evidence:**
[Screenshots, log excerpts, or other evidence]

**Recommendation:**
[Detailed remediation steps]

**Priority:** P0 - Immediate
**Estimated Effort:** [Low/Medium/High]

---

### High Risk Findings

#### Finding H1: [Finding Title]
[Similar structure to Critical]

---

### Medium Risk Findings

#### Finding M1: [Finding Title]
[Similar structure]

---

### Low Risk Findings

#### Finding L1: [Finding Title]
[Similar structure]

---

## Positive Findings

### Security Strengths
1. [Strength 1: e.g., Strong MFA implementation]
2. [Strength 2: e.g., Comprehensive logging and monitoring]
3. [Strength 3: e.g., Regular security testing]

### Best Practices Observed
- [Best practice 1]
- [Best practice 2]

## Compliance Assessment

### Regulatory Compliance
| Regulation | Applicable | Compliance Level | Gaps |
|------------|-----------|------------------|------|
| GDPR | [Yes/No] | [Full/Partial/Non-compliant] | [N issues] |
| PCI-DSS | [Yes/No] | [Full/Partial/Non-compliant] | [N issues] |
| HIPAA | [Yes/No] | [Full/Partial/Non-compliant] | [N issues] |
| SOC 2 | [Yes/No] | [Full/Partial/Non-compliant] | [N issues] |

### Framework Alignment
| Framework | Maturity Level | Coverage |
|-----------|----------------|----------|
| NIST CSF | [Initial/Managed/Defined/Quantitative/Optimizing] | [%] |
| CIS Controls | [Implementation Group 1/2/3] | [%] |
| ISO 27001 | [Not assessed/Partial/Full] | [%] |

## Recommendations

### Immediate Actions (0-30 days)
| # | Recommendation | Risk Addressed | Owner | Effort |
|---|----------------|----------------|-------|--------|
| 1 | [Action 1] | [RISK-001] | [Team/Person] | [Low/Med/High] |
| 2 | [Action 2] | [RISK-002] | [Team/Person] | [Low/Med/High] |

### Short-term (1-3 months)
| # | Recommendation | Risk Addressed | Owner | Effort |
|---|----------------|----------------|-------|--------|
| 1 | [Action 1] | [RISK-003] | [Team/Person] | [Low/Med/High] |

### Medium-term (3-6 months)
| # | Recommendation | Risk Addressed | Owner | Effort |
|---|----------------|----------------|-------|--------|
| 1 | [Action 1] | [RISK-004] | [Team/Person] | [Low/Med/High] |

### Long-term (6-12 months)
| # | Recommendation | Risk Addressed | Owner | Effort |
|---|----------------|----------------|-------|--------|
| 1 | [Strategic recommendation] | [Multiple risks] | [Team/Person] | [High] |

## Remediation Plan

### Roadmap
```
Q1: [Immediate actions]
Q2: [Short-term actions]
Q3: [Medium-term actions]
Q4: [Long-term actions]
```

### Resource Requirements
- **Budget:** [Estimated cost]
- **Personnel:** [FTE required]
- **Tools/Services:** [Tools to procure]
- **Training:** [Training needs]

## Conclusion

### Overall Assessment
[Summary of the organization's security posture]

### Security Maturity Level
**Current Maturity:** [Level 1-5 per chosen framework]
**Target Maturity:** [Level 1-5]

### Progress Since Last Assessment
[Comparison with previous assessment if applicable]

**Improvements:**
- [Improvement 1]
- [Improvement 2]

**Regressions:**
- [Regression 1] (if any)

### Next Steps
1. [Immediate next step]
2. [Second step]
3. [Third step]

## Appendices

### Appendix A: Assessment Scope Details
[Detailed scope information]

### Appendix B: Testing Methodology
[Detailed testing procedures]

### Appendix C: Tool Configurations
[Tool settings and configurations]

### Appendix D: Full Findings List
[Complete list of all findings with details]

### Appendix E: Evidence Archive
[Location of evidence files, screenshots, scan results]

## Approval and Distribution

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Assessor | [Name] | [Date] | [Signature] |
| Security Manager | [Name] | [Date] | [Signature] |
| CISO | [Name] | [Date] | [Signature] |
| CTO/CIO | [Name] | [Date] | [Signature] |

**Distribution:** [Confidential - Limited Distribution]

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial assessment |
