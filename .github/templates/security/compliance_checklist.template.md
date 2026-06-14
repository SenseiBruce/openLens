# Compliance Checklist

**Project:** [Project Name]
**Date:** [YYYY-MM-DD]
**Compliance Officer:** [Name]
**Framework(s):** [GDPR/HIPAA/PCI-DSS/SOC2/ISO27001/etc.]
**Version:** [X.Y]

## Executive Summary

### Compliance Scope
[Brief description of what systems/processes are in scope for compliance]

### Frameworks & Standards
- [ ] GDPR (General Data Protection Regulation)
- [ ] HIPAA (Health Insurance Portability and Accountability Act)
- [ ] PCI-DSS (Payment Card Industry Data Security Standard)
- [ ] SOC 2 (Service Organization Control 2)
- [ ] ISO 27001 (Information Security Management)
- [ ] CCPA (California Consumer Privacy Act)
- [ ] NIST Cybersecurity Framework
- [ ] [Other relevant frameworks]

### Overall Compliance Status
| Framework | Total Controls | Implemented | In Progress | Not Started | Compliance % |
|-----------|----------------|-------------|-------------|-------------|--------------|
| [Framework 1] | [N] | [N] | [N] | [N] | [%] |
| [Framework 2] | [N] | [N] | [N] | [N] | [%] |

## GDPR Compliance

### Lawfulness of Processing (Article 6)
- [ ] Legal basis for processing identified and documented
- [ ] Consent obtained where required (clear, specific, informed)
- [ ] Consent withdrawal mechanism implemented
- [ ] Legitimate interest assessment completed

### Data Protection Principles (Article 5)
- [ ] **Lawfulness, fairness, transparency:** Processing is lawful, fair, and transparent
- [ ] **Purpose limitation:** Data collected for specified, explicit purposes
- [ ] **Data minimization:** Only necessary data collected
- [ ] **Accuracy:** Data kept accurate and up to date
- [ ] **Storage limitation:** Data retained only as long as necessary
- [ ] **Integrity and confidentiality:** Appropriate security measures in place
- [ ] **Accountability:** Compliance can be demonstrated

### Data Subject Rights
| Right | Implementation | Status | Evidence |
|-------|----------------|--------|----------|
| Right to be informed | [Privacy notice/policy] | [Complete/In Progress] | [Document link] |
| Right of access | [Data access request process] | [Complete/In Progress] | [Process doc] |
| Right to rectification | [Data correction process] | [Complete/In Progress] | [Process doc] |
| Right to erasure | [Data deletion process] | [Complete/In Progress] | [Process doc] |
| Right to restrict processing | [Process implemented] | [Complete/In Progress] | [Process doc] |
| Right to data portability | [Export functionality] | [Complete/In Progress] | [Feature link] |
| Right to object | [Opt-out mechanism] | [Complete/In Progress] | [Process doc] |
| Rights related to automated decision making | [Human review process] | [Complete/In Progress/N/A] | [Process doc] |

### Privacy by Design and Default (Article 25)
- [ ] Data protection integrated from design phase
- [ ] Default settings protect privacy
- [ ] Privacy impact assessments conducted
- [ ] Data protection officer (DPO) appointed (if required)

### Data Breach Notification (Articles 33-34)
- [ ] Breach detection procedures in place
- [ ] Breach notification process documented
- [ ] Supervisory authority notification within 72 hours
- [ ] Data subject notification process
- [ ] Breach register maintained

### International Data Transfers (Chapter V)
- [ ] Transfer mechanisms identified (Standard Contractual Clauses, etc.)
- [ ] Transfer impact assessments completed
- [ ] Adequate safeguards in place

### Documentation Requirements
- [ ] Record of processing activities (Article 30)
- [ ] Data protection policies and procedures
- [ ] Privacy notices
- [ ] Consent records
- [ ] DPIA documentation
- [ ] Vendor/processor agreements (Article 28)

## PCI-DSS Compliance

### Requirement 1: Firewall Configuration
- [ ] 1.1: Firewall standards documented and implemented
- [ ] 1.2: Firewall configurations restrict connections
- [ ] 1.3: Direct public access prohibited between internet and cardholder data
- [ ] 1.4: Personal firewalls on mobile/employee devices

### Requirement 2: Default Passwords and Security Parameters
- [ ] 2.1: Vendor defaults changed before production
- [ ] 2.2: Configuration standards for system components
- [ ] 2.3: Non-console administrative access encrypted
- [ ] 2.4: Shared hosting environments properly segmented

### Requirement 3: Protect Stored Cardholder Data
- [ ] 3.1: Data retention policies implemented
- [ ] 3.2: Sensitive authentication data not stored after authorization
- [ ] 3.3: PAN masked when displayed
- [ ] 3.4: Cardholder data encrypted
- [ ] 3.5: Encryption keys protected
- [ ] 3.6: Key management processes documented

### Requirement 4: Encrypt Transmission of Cardholder Data
- [ ] 4.1: Strong cryptography for transmission over open networks
- [ ] 4.2: Never send unprotected PANs via end-user messaging
- [ ] 4.3: Encryption policies and procedures

### Requirement 5: Protect Against Malware
- [ ] 5.1: Anti-malware deployed on all systems
- [ ] 5.2: Anti-malware kept current
- [ ] 5.3: Anti-malware actively running
- [ ] 5.4: Security policies address malware risks

### Requirement 6: Secure Systems and Applications
- [ ] 6.1: Security vulnerabilities identified and assessed
- [ ] 6.2: Security patches installed
- [ ] 6.3: Secure software development practices
- [ ] 6.4: Change control processes
- [ ] 6.5: Common coding vulnerabilities addressed (OWASP Top 10)
- [ ] 6.6: Web application firewall or code review

### Requirement 7: Restrict Access by Business Need
- [ ] 7.1: Access limited to job requirements
- [ ] 7.2: Access control systems in place
- [ ] 7.3: Default "deny all" setting

### Requirement 8: Identify and Authenticate Access
- [ ] 8.1: Users assigned unique ID
- [ ] 8.2: Strong authentication implemented
- [ ] 8.3: Multi-factor authentication for remote access
- [ ] 8.4: Authentication policies documented
- [ ] 8.5: Group/shared accounts prohibited
- [ ] 8.6: Authentication for non-consumer users
- [ ] 8.7: Database access secured
- [ ] 8.8: Authentication policies communicated

### Requirement 9: Restrict Physical Access
- [ ] 9.1: Physical access controls for cardholder data
- [ ] 9.2: Procedures for distinguishing personnel
- [ ] 9.3: Physical access controls for devices
- [ ] 9.4: Media access controlled and tracked

### Requirement 10: Track and Monitor Network Access
- [ ] 10.1: Audit trails implemented
- [ ] 10.2: Automated audit trails for security events
- [ ] 10.3: Audit trails protected
- [ ] 10.4: Logs reviewed regularly
- [ ] 10.5: Audit trail history retained
- [ ] 10.6: Time synchronization
- [ ] 10.7: Log collection and management

### Requirement 11: Test Security Systems
- [ ] 11.1: Unauthorized wireless access points detected
- [ ] 11.2: Vulnerability scans conducted quarterly
- [ ] 11.3: Penetration testing performed annually
- [ ] 11.4: Intrusion detection/prevention deployed
- [ ] 11.5: File integrity monitoring implemented
- [ ] 11.6: Security monitoring and testing policies

### Requirement 12: Information Security Policy
- [ ] 12.1: Security policy established and published
- [ ] 12.2: Risk assessment process
- [ ] 12.3: Usage policies for critical technologies
- [ ] 12.4: Security responsibilities defined
- [ ] 12.5: Security responsibilities assigned
- [ ] 12.6: Security awareness program
- [ ] 12.7: Personnel screening
- [ ] 12.8: Service provider management
- [ ] 12.9: Service provider acknowledgment
- [ ] 12.10: Incident response plan

## HIPAA Compliance (for healthcare data)

### Administrative Safeguards
- [ ] Security Management Process
- [ ] Assigned Security Responsibility
- [ ] Workforce Security
- [ ] Information Access Management
- [ ] Security Awareness and Training
- [ ] Security Incident Procedures
- [ ] Contingency Plan
- [ ] Evaluation
- [ ] Business Associate Contracts

### Physical Safeguards
- [ ] Facility Access Controls
- [ ] Workstation Use
- [ ] Workstation Security
- [ ] Device and Media Controls

### Technical Safeguards
- [ ] Access Control
- [ ] Audit Controls
- [ ] Integrity
- [ ] Person or Entity Authentication
- [ ] Transmission Security

### Organizational Requirements
- [ ] Business Associate Contracts
- [ ] Other Arrangements
- [ ] Requirements for Group Health Plans

### Documentation Requirements
- [ ] Policies and Procedures
- [ ] Documentation (retention 6 years)
- [ ] Time Limit
- [ ] Availability
- [ ] Updates

## SOC 2 Compliance

### Trust Services Criteria

#### Security (CC1-CC9)
- [ ] CC1.1: COSO principles demonstrated
- [ ] CC1.2: Board independence and oversight
- [ ] CC1.3: Organizational structure established
- [ ] CC1.4: Competency and commitment
- [ ] CC1.5: Accountability established
- [ ] CC6.1: Logical and physical access controls
- [ ] CC6.2: Prior to issuing system credentials
- [ ] CC6.6: Vulnerability management
- [ ] CC6.7: Encryption of data
- [ ] CC7.2: Security incident detection and response

#### Availability
- [ ] A1.1: Availability commitments documented
- [ ] A1.2: System availability monitoring
- [ ] A1.3: Recovery procedures documented and tested

#### Processing Integrity
- [ ] PI1.1: Processing integrity commitments documented
- [ ] PI1.2: Inputs are complete and accurate
- [ ] PI1.3: Processing is complete and accurate
- [ ] PI1.4: Outputs are complete and accurate

#### Confidentiality
- [ ] C1.1: Confidentiality commitments documented
- [ ] C1.2: Confidential information identified and protected

#### Privacy (if applicable)
- [ ] P1.0-P8.1: Privacy criteria met

## ISO 27001 Compliance

### Annex A Controls

#### A.5 Information Security Policies
- [ ] A.5.1.1: Policies for information security
- [ ] A.5.1.2: Review of policies

#### A.6 Organization of Information Security
- [ ] A.6.1.1: Information security roles and responsibilities
- [ ] A.6.1.2: Segregation of duties
- [ ] A.6.1.3: Contact with authorities
- [ ] A.6.2.1: Mobile device policy
- [ ] A.6.2.2: Teleworking

#### A.7 Human Resource Security
- [ ] A.7.1.1: Screening
- [ ] A.7.1.2: Terms and conditions of employment
- [ ] A.7.2.1: Management responsibilities
- [ ] A.7.2.2: Information security awareness
- [ ] A.7.3.1: Termination responsibilities

#### A.8 Asset Management
- [ ] A.8.1.1: Inventory of assets
- [ ] A.8.1.2: Ownership of assets
- [ ] A.8.1.3: Acceptable use of assets
- [ ] A.8.2.1: Classification guidelines
- [ ] A.8.2.2: Labeling of information
- [ ] A.8.3.1: Management of removable media
- [ ] A.8.3.2: Disposal of media

#### A.9 Access Control
- [ ] A.9.1.1: Access control policy
- [ ] A.9.2.1: User registration
- [ ] A.9.2.2: Privileged access rights
- [ ] A.9.2.3: User access rights management
- [ ] A.9.3.1: Use of secret authentication
- [ ] A.9.4.1: Information access restriction

#### A.10 Cryptography
- [ ] A.10.1.1: Policy on use of cryptographic controls
- [ ] A.10.1.2: Key management

[Continue with remaining Annex A controls A.11-A.18...]

## Compliance Gaps and Remediation

### Critical Gaps
| Gap ID | Requirement | Current State | Target State | Owner | Due Date | Status |
|--------|-------------|---------------|--------------|-------|----------|--------|
| GAP-001 | [Requirement] | [Current] | [Target] | [Name] | [Date] | [Open/In Progress/Closed] |

### Remediation Plan
| Action Item | Priority | Effort | Dependencies | Owner | Due Date |
|-------------|----------|--------|--------------|-------|----------|
| [Action 1] | [Critical/High/Medium] | [Low/Medium/High] | [Dependencies] | [Name] | [Date] |

## Evidence Repository

### Documentation
| Requirement | Evidence Type | Location | Last Updated | Status |
|-------------|---------------|----------|--------------|--------|
| [Requirement 1] | [Policy/Procedure/Audit] | [File path/URL] | [Date] | [Current/Outdated] |

### Audit Trail
| Control | Last Tested | Test Method | Result | Auditor |
|---------|-------------|-------------|--------|---------|
| [Control 1] | [Date] | [Review/Test/Scan] | [Pass/Fail] | [Name] |

## Compliance Monitoring

### Continuous Monitoring
- [ ] Automated compliance scanning implemented
- [ ] Regular compliance audits scheduled
- [ ] Compliance dashboard in place
- [ ] Alerting for compliance violations

### Review Schedule
| Framework | Review Frequency | Last Review | Next Review | Owner |
|-----------|------------------|-------------|-------------|-------|
| GDPR | [Quarterly] | [Date] | [Date] | [Name] |
| PCI-DSS | [Quarterly] | [Date] | [Date] | [Name] |
| SOC 2 | [Annual] | [Date] | [Date] | [Name] |

## Third-Party Compliance

### Vendor Assessment
| Vendor | Services | Compliance Requirements | Assessment Date | Status |
|--------|---------|------------------------|-----------------|--------|
| [Vendor 1] | [Services] | [Requirements] | [Date] | [Compliant/Non-compliant] |

### Data Processors (GDPR Article 28)
- [ ] Data Processing Agreements in place
- [ ] Processor security assessments completed
- [ ] Sub-processor approvals documented

## Training and Awareness

### Required Training
| Training Topic | Target Audience | Frequency | Completion Rate |
|----------------|----------------|-----------|-----------------|
| GDPR Awareness | All staff | Annual | [%] |
| PCI-DSS | IT/Dev teams | Annual | [%] |
| Security Awareness | All staff | Quarterly | [%] |

## Attestation

### Compliance Statement
[Official statement of compliance status]

### Sign-off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| Compliance Officer | [Name] | [Date] | [Signature] |
| CISO | [Name] | [Date] | [Signature] |
| Legal Counsel | [Name] | [Date] | [Signature] |
| CEO | [Name] | [Date] | [Signature] |

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial checklist |
