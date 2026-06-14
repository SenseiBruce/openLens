# Database Security Plan

## Document Information
- **Project Name:** [Project Name]
- **Database Name:** [Database Name]
- **Version:** [Version Number]
- **Date:** [Current Date]
- **Author:** [Author Name]
- **Status:** [Draft | In Review | Approved | Implemented]

## Document Control
| Version | Date | Author | Changes | Reviewer | Status |
|---------|------|--------|---------|----------|--------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft | [Name] | Draft |
| | | | | | |

---

## Executive Summary

### Purpose
[Brief description of why database security is critical and what this plan covers]

### Scope
- **Databases Covered:** [List of databases/schemas]
- **Data Classification:** [PII | PHI | PCI | Confidential | etc.]
- **Regulatory Requirements:** [GDPR | HIPAA | PCI DSS | SOC 2 | etc.]

### Security Objectives
- **Confidentiality:** Ensure only authorized users can access sensitive data
- **Integrity:** Protect data from unauthorized modification
- **Availability:** Ensure database availability while maintaining security
- **Compliance:** Meet all regulatory and compliance requirements
- **Auditability:** Maintain comprehensive audit trails

### Risk Assessment Summary
| Risk Level | Count | Critical Controls |
|------------|-------|-------------------|
| Critical | [number] | [Top 3 controls] |
| High | [number] | [Top 3 controls] |
| Medium | [number] | [Summary] |
| Low | [number] | [Summary] |

---

## Regulatory and Compliance Requirements

### Applicable Regulations
- [X] **GDPR** - General Data Protection Regulation
  - Right to erasure implementation
  - Data breach notification procedures
  - Privacy by design principles
  
- [ ] **HIPAA** - Health Insurance Portability and Accountability Act
  - PHI encryption requirements
  - Access controls and audit logs
  - Business Associate Agreements
  
- [ ] **PCI DSS** - Payment Card Industry Data Security Standard
  - Cardholder data environment (CDE) segmentation
  - Encryption of card data at rest and in transit
  - Quarterly vulnerability scans
  
- [ ] **SOC 2** - Service Organization Control 2
  - Security controls documentation
  - Annual audits
  - Continuous monitoring

### Compliance Mapping
| Requirement | Control ID | Implementation | Evidence | Status |
|-------------|-----------|----------------|----------|--------|
| GDPR Art. 32 - Security | SEC-001 | Encryption at rest | Encryption config | Implemented |
| GDPR Art. 32 - Security | SEC-002 | Encryption in transit | TLS config | Implemented |
| GDPR Art. 30 - Records | SEC-010 | Audit logging | Audit logs | Implemented |
| [Requirement] | [ID] | [How it's met] | [Proof] | [Status] |

### Data Classification
| Data Type | Classification | Regulatory Scope | Retention | Encryption Required | Access Level |
|-----------|----------------|------------------|-----------|---------------------|--------------|
| Customer PII | Confidential | GDPR | 7 years | Yes | Restricted |
| Financial Data | Highly Confidential | PCI DSS | 10 years | Yes | Highly Restricted |
| Health Records | Highly Confidential | HIPAA | 6 years | Yes | Highly Restricted |
| System Logs | Internal | SOC 2 | 1 year | No | IT Staff Only |

---

## Security Architecture

### Defense in Depth Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                             │
│  - Firewall rules, VPC/VNet isolation, Security Groups │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Access Control                               │
│  - Authentication, Authorization, MFA, SSO              │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Database Security                            │
│  - User roles, privileges, row-level security          │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Data Protection                              │
│  - Encryption at rest, in transit, masking             │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Monitoring & Audit                           │
│  - Logging, SIEM integration, alerting                 │
└─────────────────────────────────────────────────────────┘
```

### Security Zones
| Zone | Description | Database Tier | Access Method | Security Controls |
|------|-------------|---------------|---------------|-------------------|
| Public | Internet-facing | None | N/A | WAF, DDoS protection |
| DMZ | Application tier | None (app only) | N/A | Security groups, IDS |
| Private | Database tier | All databases | Private subnet only | Network ACLs, encryption |
| Management | Admin access | Bastion/jump host | VPN + MFA | Privileged access management |

---

## Authentication and Access Control

### Authentication Methods
| User Type | Authentication Method | MFA Required | Password Policy | Session Timeout |
|-----------|----------------------|--------------|-----------------|-----------------|
| Database Admin | Certificate-based | Yes | N/A | 30 minutes |
| Application | Service account (rotating key) | N/A | N/A | N/A |
| Developer (Non-Prod) | LDAP/AD | Yes | 12+ chars, complex | 60 minutes |
| Analyst/BI | SSO (SAML) | Yes | 12+ chars, complex | 60 minutes |
| Support | Temporary credentials | Yes | 12+ chars, complex | 15 minutes |

### Password Policy
- **Minimum Length:** 12 characters
- **Complexity:** Must contain uppercase, lowercase, numbers, special characters
- **Rotation:** Every 90 days
- **History:** Cannot reuse last 12 passwords
- **Lockout:** 5 failed attempts, 30-minute lockout
- **Storage:** Hashed with bcrypt (cost factor 12) or Argon2

### Multi-Factor Authentication (MFA)
- **Required for:** All human users accessing production databases
- **Methods Allowed:** Authenticator app, hardware token, SMS (fallback only)
- **Enforcement:** MFA bypass not permitted for production

### Single Sign-On (SSO)
- **Identity Provider:** [Okta | Azure AD | Auth0 | etc.]
- **Protocol:** SAML 2.0
- **Just-in-Time Provisioning:** Enabled
- **Attribute Mapping:** [Document attribute mappings]

---

## Authorization and Access Control

### Role-Based Access Control (RBAC)

#### Database Roles
| Role Name | Purpose | Permissions | Assigned To | Approval Required |
|-----------|---------|-------------|-------------|-------------------|
| `db_owner` | Full database control | ALL | DBAs only | CTO |
| `db_admin` | Administrative tasks | DDL, GRANT | Senior DBAs | IT Manager |
| `app_readwrite` | Application access | SELECT, INSERT, UPDATE, DELETE on app schema | Application service accounts | Tech Lead |
| `app_readonly` | Read-only application | SELECT on app schema | Read replicas, reporting | Tech Lead |
| `analyst` | Business intelligence | SELECT on reporting views | BI analysts | Data Manager |
| `developer` | Non-prod development | ALL (non-prod only) | Developers | Tech Lead |
| `auditor` | Compliance auditing | SELECT on audit tables | Auditors, compliance | Security Officer |

#### Role Assignment Process
1. **Request:** User submits access request via [ticketing system]
2. **Justification:** Business justification required
3. **Approval:** Manager approval + Security approval for production
4. **Provisioning:** Automated via [IaC/scripts]
5. **Review:** Quarterly access reviews
6. **Revocation:** Automatic on termination, manual on role change

### Principle of Least Privilege
- Users granted minimum permissions necessary
- Temporary elevated access via break-glass procedures
- Regular access reviews and privilege audits

### Object-Level Permissions
| Schema/Table | Read | Write | Delete | Granted To | Notes |
|--------------|------|-------|--------|------------|-------|
| public.users | app_readwrite, analyst | app_readwrite | app_readwrite | Application, BI | |
| public.orders | app_readwrite, analyst | app_readwrite | db_admin only | Application, BI | Soft delete only |
| security.audit_log | auditor | Trigger only | Never | Audit system | Append-only |
| [schema.table] | [roles] | [roles] | [roles] | [who] | [notes] |

### Row-Level Security (RLS)
[If applicable - PostgreSQL RLS policies, Oracle VPD, SQL Server RLS]

**Policy Example:**
```sql
-- Users can only see their own data
CREATE POLICY user_isolation ON users
    USING (user_id = current_user_id());

-- Tenant isolation in multi-tenant database
CREATE POLICY tenant_isolation ON tenant_data
    USING (tenant_id = current_tenant_id());
```

### Column-Level Security
| Table | Column | Sensitivity | Protection Method | Accessible By |
|-------|--------|-------------|-------------------|---------------|
| users | ssn | PII | Encryption + masking | db_admin, compliance |
| users | email | PII | Masking | app_readwrite, analyst |
| payments | card_number | PCI | Tokenization | payment_processor only |

---

## Network Security

### Network Architecture
```
Internet
    ↓
[WAF / DDoS Protection]
    ↓
[Load Balancer]
    ↓
[Application Tier - Public Subnet]
    ↓
[Private Subnet - Database Tier]
    ↓
[Database Servers - No Internet Access]
```

### Firewall Rules
| Source | Destination | Port | Protocol | Purpose | Allow/Deny |
|--------|-------------|------|----------|---------|------------|
| Application subnet | Database subnet | 5432 | TCP | PostgreSQL | Allow |
| Bastion host | Database subnet | 5432 | TCP | Admin access | Allow |
| Database subnet | Internet | * | * | Outbound access | Deny |
| Internet | Database subnet | * | * | Inbound access | Deny |
| [Source] | [Destination] | [Port] | [Protocol] | [Purpose] | [Action] |

### VPC/VNet Configuration
- **VPC/VNet:** [VPC ID/Name]
- **Subnets:**
  - Database Subnet: 10.0.10.0/24 (Private)
  - Application Subnet: 10.0.20.0/24 (Private)
  - Management Subnet: 10.0.30.0/24 (Private)
- **Route Tables:** No internet gateway route for database subnet
- **Network ACLs:** Default deny, explicit allow rules only

### VPN and Remote Access
- **VPN Solution:** [AWS Client VPN | Azure VPN | OpenVPN]
- **Authentication:** Certificate-based + MFA
- **Access:** Management subnet only
- **Audit:** All VPN sessions logged

### Database Connection Security
- **Allowed Connection Methods:**
  - Application servers: Private subnet, service account
  - Administrators: Bastion host + VPN + MFA
  - BI Tools: Read replica in private subnet
  
- **Prohibited:**
  - Direct internet access to database
  - Public IP addresses on database servers
  - Default/well-known ports exposed to internet

---

## Encryption

### Encryption at Rest
- **Method:** [AES-256 | TDE - Transparent Data Encryption]
- **Enabled On:**
  - [X] All production databases
  - [X] All backups
  - [X] All logs containing sensitive data
  - [X] Temporary files and swap space
  
- **Key Management:** [AWS KMS | Azure Key Vault | HashiCorp Vault]
- **Key Rotation:** Automatic, every 90 days
- **Key Access:** Limited to authorized services/users via IAM policies

**Implementation:**
```sql
-- PostgreSQL example
ALTER DATABASE mydb SET default_tablespace = encrypted_tablespace;

-- SQL Server TDE
ALTER DATABASE mydb
SET ENCRYPTION ON;
```

### Encryption in Transit
- **Protocol:** TLS 1.2 or higher (TLS 1.3 preferred)
- **Cipher Suites:** 
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  
- **Certificate Management:**
  - Certificate Authority: [Let's Encrypt | Internal CA | Commercial CA]
  - Certificate Validity: 90 days
  - Auto-renewal: Yes
  
- **Enforcement:**
  - [X] Require SSL for all connections
  - [X] Reject non-SSL connections
  - [ ] Allow non-SSL for localhost (if applicable)

**Configuration:**
```sql
-- PostgreSQL pg_hba.conf
hostssl all all 0.0.0.0/0 md5

-- MySQL
[mysqld]
require_secure_transport=ON
```

### Column-Level Encryption
For highly sensitive data that requires encryption even from database administrators:

| Table | Column | Encryption Method | Key Storage | Decryption Allowed By |
|-------|--------|-------------------|-------------|------------------------|
| users | ssn | AES-256 (application-level) | AWS KMS | Application only |
| payments | account_number | Tokenization (external) | Token vault | Payment processor |

**Application-Level Encryption Example:**
```python
# Encrypt before insert
from cryptography.fernet import Fernet
cipher = Fernet(encryption_key)
encrypted_ssn = cipher.encrypt(ssn.encode())

# Decrypt after select
decrypted_ssn = cipher.decrypt(encrypted_ssn).decode()
```

---

## Data Masking and Anonymization

### Static Data Masking
For non-production environments, production data is masked before restoration:

| Table | Column | Data Type | Masking Method | Example |
|-------|--------|-----------|----------------|---------|
| users | email | String | Format-preserving | john.doe@example.com → user1234@example.com |
| users | ssn | String | Randomize | 123-45-6789 → 987-65-4321 |
| users | phone | String | Partial mask | +1-555-1234 → +1-555-XXXX |
| users | first_name | String | Dictionary replacement | John → RandomName |
| payments | card_number | String | Tokenization | 4111-1111-1111-1111 → 4111-XXXX-XXXX-1234 |

**Masking Script:**
```sql
-- Example masking for non-production
UPDATE users SET
    email = CONCAT('user_', id, '@example.com'),
    ssn = LPAD(FLOOR(RAND() * 1000000000), 9, '0'),
    phone = CONCAT(SUBSTRING(phone, 1, 3), '-XXXX')
WHERE environment != 'production';
```

### Dynamic Data Masking
Real-time masking for production queries by users without full access:

| Role | Table | Column | Masking Rule | Example Output |
|------|-------|--------|--------------|----------------|
| analyst | users | ssn | Show last 4 only | XXX-XX-6789 |
| support | users | email | Show domain only | xxxxx@example.com |
| developer (prod) | users | credit_card | Full mask | XXXX-XXXX-XXXX-XXXX |

**Dynamic Masking Implementation:**
```sql
-- SQL Server Dynamic Data Masking
ALTER TABLE users
ALTER COLUMN ssn ADD MASKED WITH (FUNCTION = 'partial(0,"XXX-XX-",4)');

ALTER TABLE users
ALTER COLUMN email ADD MASKED WITH (FUNCTION = 'email()');
```

### Anonymization for Analytics
Irreversible anonymization for data sharing/analytics:
- **K-Anonymization:** Generalize data to groups of k individuals
- **Differential Privacy:** Add statistical noise
- **Pseudonymization:** Replace identifiers with pseudonyms

---

## Backup Security

### Backup Encryption
- **All backups encrypted at rest:** AES-256
- **Encryption method:** Backup encryption + storage encryption (defense in depth)
- **Key management:** Separate keys for backups vs. production database

### Backup Access Control
| Access Type | Authorized Users | MFA Required | Audit Logged |
|-------------|------------------|--------------|--------------|
| Create backups | Backup service account | N/A | Yes |
| Restore to production | DBAs + Incident Commander | Yes | Yes |
| Restore to non-prod | DBAs, Senior Developers | Yes | Yes |
| Delete backups | DBAs only (after retention period) | Yes | Yes |
| Download backups | Not permitted | N/A | Attempts logged |

### Backup Storage Security
- **Storage Location:** [AWS S3 | Azure Blob | Separate datacenter]
- **Encryption:** Server-side encryption (SSE-KMS)
- **Access Control:** IAM policies, bucket policies
- **Versioning:** Enabled (protects against accidental deletion)
- **MFA Delete:** Enabled
- **Network:** Private endpoints only, no public access

### Backup Testing
- **Frequency:** Monthly
- **Scope:** Full restoration test in isolated environment
- **Validation:** Data integrity checks, application smoke tests
- **Access:** Test environment secured similarly to production

---

## Audit Logging and Monitoring

### Audit Logging Requirements
**What to Log:**
- [X] All authentication attempts (success and failure)
- [X] All authorization failures
- [X] All DDL operations (CREATE, ALTER, DROP)
- [X] All DML operations on sensitive tables
- [X] All privilege escalations (GRANT, REVOKE)
- [X] All administrative operations
- [X] All data exports/bulk extracts
- [X] All backup and restore operations
- [X] Configuration changes

**Log Format:**
| Field | Description | Example |
|-------|-------------|---------|
| Timestamp | UTC timestamp | 2024-01-15T14:30:00Z |
| User | Database user | app_readwrite |
| Source IP | Client IP address | 10.0.20.15 |
| Operation | Type of operation | SELECT, INSERT, UPDATE, DELETE, etc. |
| Object | Database object accessed | public.users |
| Success | Success or failure | true/false |
| Rows Affected | Number of rows | 150 |
| Query | SQL query (sanitized) | SELECT * FROM users WHERE... |

### Audit Table Schema
```sql
CREATE TABLE security.audit_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    database_user VARCHAR(100) NOT NULL,
    application_user VARCHAR(100),
    source_ip INET,
    operation VARCHAR(50) NOT NULL,
    object_type VARCHAR(50),
    object_name VARCHAR(255),
    success BOOLEAN NOT NULL,
    rows_affected INTEGER,
    query_text TEXT,
    error_message TEXT,
    session_id VARCHAR(100)
);

-- Audit log is append-only
REVOKE UPDATE, DELETE, TRUNCATE ON security.audit_log FROM PUBLIC;
GRANT INSERT ON security.audit_log TO audit_writer;
GRANT SELECT ON security.audit_log TO auditor;
```

### Database Audit Configuration
```sql
-- PostgreSQL pgaudit
ALTER SYSTEM SET pgaudit.log = 'write, ddl, role';
ALTER SYSTEM SET pgaudit.log_catalog = OFF;
ALTER SYSTEM SET pgaudit.log_parameter = ON;

-- SQL Server Audit
CREATE SERVER AUDIT Security_Audit
TO FILE (FILEPATH = '/var/opt/mssql/audit/');

CREATE DATABASE AUDIT SPECIFICATION DB_Audit_Spec
FOR SERVER AUDIT Security_Audit
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo BY public);
```

### Log Retention
| Log Type | Retention Period | Storage Location | Archive Method |
|----------|------------------|------------------|----------------|
| Audit logs | 7 years | Database + S3 | Yearly to cold storage |
| Error logs | 1 year | Log management system | Monthly to cold storage |
| Query logs | 90 days | Database | Deleted |
| Access logs | 1 year | SIEM | Quarterly to cold storage |

### SIEM Integration
- **SIEM Platform:** [Splunk | ELK | Azure Sentinel | AWS Security Hub]
- **Log Forwarding:** Real-time via secure syslog or agent
- **Correlation Rules:** [List key correlation rules]
- **Alerting:** Integrated with incident response process

---

## Security Monitoring and Alerting

### Real-Time Monitoring
| Metric/Event | Threshold | Alert Severity | Response |
|--------------|-----------|----------------|----------|
| Failed login attempts | > 5 in 5 minutes from same IP | High | Block IP, notify security team |
| Privilege escalation | Any GRANT to sensitive roles | Critical | Immediate review, possible rollback |
| Unusual query patterns | Queries returning > 10,000 rows | Medium | Review user activity |
| Data export | SELECT INTO OUTFILE, COPY TO | High | Verify authorization |
| DDL in production | CREATE, ALTER, DROP | High | Verify change management approval |
| Unauthorized access attempt | Access denied to sensitive tables | Medium | Log and review |
| Brute force attack | > 10 failed logins from single user | Critical | Lock account, notify security |
| Anomalous time access | Admin access outside business hours | Medium | Verify with user |

### Security Dashboards
**Key Metrics:**
1. Failed authentication attempts (last 24h)
2. Active database sessions by user/role
3. Sensitive data access patterns
4. Privilege changes (last 7 days)
5. Anomalous queries
6. Backup success rate
7. Encryption status
8. Compliance posture

**Dashboard Tool:** [Grafana | Kibana | Cloud-native dashboard]

### Automated Responses
| Trigger | Automated Action | Manual Follow-up |
|---------|------------------|------------------|
| 5 failed logins | Account temporarily locked | Security team review |
| Unusual data export | Query killed, session terminated | Investigate intent |
| Unauthorized DDL | Transaction rolled back | Review change management |
| Malicious query pattern | IP blocked at firewall | Incident response |

---

## Vulnerability Management

### Database Patching
- **Frequency:** Monthly security patches, quarterly feature updates
- **Testing:** All patches tested in non-prod before production
- **Maintenance Window:** [Day/Time]
- **Rollback Plan:** Snapshot before patching

**Patching Schedule:**
| Environment | Patch Day | Testing Duration | Approval Required |
|-------------|-----------|------------------|-------------------|
| Development | Tuesday Week 1 | 1 day | Tech Lead |
| QA/Staging | Tuesday Week 2 | 3 days | QA Lead |
| Production | Tuesday Week 3 | N/A | Change Board |

### Vulnerability Scanning
- **Tool:** [Nessus | Qualys | OpenVAS | Cloud-native scanner]
- **Frequency:** Weekly automated scans
- **Scope:** Database servers, network, misconfigurations
- **Remediation SLA:**
  - Critical: 7 days
  - High: 30 days
  - Medium: 90 days
  - Low: Next major update

### Security Hardening
Database hardening checklist:
- [X] Remove default accounts
- [X] Disable unnecessary features/services
- [X] Change default ports (if applicable)
- [X] Implement least privilege
- [X] Enable audit logging
- [X] Configure firewall rules
- [X] Enable SSL/TLS
- [X] Set strong password policy
- [X] Disable remote root/admin login
- [X] Regular security updates
- [X] File system permissions hardened
- [X] Sample databases removed

**Hardening Script:** [Link to CIS benchmark script or custom hardening automation]

---

## Incident Response

### Security Incident Classification
| Severity | Definition | Example | Response Time |
|----------|------------|---------|---------------|
| P0 - Critical | Active breach, data exfiltration | Unauthorized data access | Immediate |
| P1 - High | Potential breach, vulnerability exploited | SQL injection detected | 1 hour |
| P2 - Medium | Security policy violation | Unauthorized login attempt | 4 hours |
| P3 - Low | Informational, no immediate threat | Audit log anomaly | 24 hours |

### Incident Response Process
1. **Detection:** Automated alerts or manual report
2. **Triage:** Security team assesses severity (15 minutes)
3. **Containment:** Isolate affected systems
4. **Investigation:** Determine scope and root cause
5. **Eradication:** Remove threat, patch vulnerability
6. **Recovery:** Restore normal operations
7. **Post-Incident:** Lessons learned, improve controls

### Incident Response Team
| Role | Name | Contact | Responsibilities |
|------|------|---------|------------------|
| Incident Commander | [Name] | [Phone/Email] | Overall coordination, decisions |
| Database Lead | [Name] | [Phone/Email] | Database forensics, restoration |
| Security Lead | [Name] | [Phone/Email] | Threat analysis, containment |
| Legal/Compliance | [Name] | [Phone/Email] | Breach notification, regulatory |
| Communications | [Name] | [Phone/Email] | Stakeholder updates |

### Breach Notification
- **Regulatory Timeline:**
  - GDPR: 72 hours to supervisory authority
  - HIPAA: 60 days to HHS (if PHI breach > 500 individuals)
  - State laws: Varies (e.g., California CCPA)
  
- **Notification Process:**
  1. Legal review confirms breach
  2. Draft notification (Legal + Communications)
  3. Notify affected individuals
  4. Notify regulators
  5. Notify credit bureaus (if applicable)
  6. Public disclosure (if required)

### Forensics
- **Log Preservation:** Immediately snapshot all logs
- **Chain of Custody:** Document all evidence handling
- **Forensic Tools:** [List tools for database forensics]
- **External Support:** [External IR firm, legal counsel]

---

## Data Privacy

### Personal Identifiable Information (PII)
| Data Element | PII Type | Storage Location | Retention | Deletion Method |
|--------------|----------|------------------|-----------|-----------------|
| Name | Direct PII | users table | 7 years after last activity | Hard delete + backup scrub |
| Email | Direct PII | users table | 7 years after last activity | Hard delete + backup scrub |
| SSN | Direct PII | users table (encrypted) | Legal requirement | Cryptographic erase (delete key) |
| IP Address | Indirect PII | logs table | 90 days | Automatic deletion |

### Data Subject Rights (GDPR)
| Right | Implementation | Response Time | Automation |
|-------|----------------|---------------|------------|
| Right to Access | Export user data query | 30 days | Automated script |
| Right to Rectification | Update user data | Immediate | Application UI |
| Right to Erasure | Hard delete + anonymize | 30 days | Semi-automated script |
| Right to Portability | JSON export | 30 days | Automated script |
| Right to Object | Opt-out flags | Immediate | Application UI |

**Data Deletion Script:**
```sql
-- GDPR Right to Erasure implementation
BEGIN TRANSACTION;

-- Anonymize user data
UPDATE users SET
    email = CONCAT('deleted_user_', id, '@anonymized.com'),
    first_name = 'Deleted',
    last_name = 'User',
    ssn = NULL,
    phone = NULL,
    address = NULL,
    deletion_date = CURRENT_TIMESTAMP,
    is_deleted = TRUE
WHERE user_id = :user_id;

-- Delete from associated tables (or anonymize)
DELETE FROM user_preferences WHERE user_id = :user_id;
DELETE FROM user_sessions WHERE user_id = :user_id;

-- Audit the deletion
INSERT INTO security.data_deletion_log (user_id, requested_by, deletion_date)
VALUES (:user_id, :admin_user, CURRENT_TIMESTAMP);

COMMIT;
```

### Cross-Border Data Transfer
- **Data Residency:** [Region/Country where data is stored]
- **Transfer Mechanisms:** [Standard Contractual Clauses | Adequacy Decision | etc.]
- **Encryption:** All data encrypted in transit across borders

---

## Third-Party Access

### Third-Party Risk Assessment
| Vendor | Purpose | Access Level | Data Shared | Risk Level | Review Date |
|--------|---------|--------------|-------------|------------|-------------|
| [Vendor] | [Purpose] | [Read/Write] | [Data types] | [Low/Med/High] | YYYY-MM-DD |

### Third-Party Access Controls
- **Authentication:** Separate service accounts, short-lived credentials
- **Authorization:** Minimum necessary access
- **Monitoring:** All third-party access logged and monitored
- **Contracts:** Data Processing Agreement (DPA), confidentiality clauses
- **Reviews:** Quarterly access reviews, annual security assessments

### Vendor Security Requirements
- [ ] SOC 2 Type II certification
- [ ] ISO 27001 certification
- [ ] Regular penetration testing
- [ ] Incident response plan
- [ ] Data encryption at rest and in transit
- [ ] Background checks for personnel
- [ ] Right to audit

---

## Security Training and Awareness

### Training Requirements
| Audience | Training Topic | Frequency | Format | Tracking |
|----------|----------------|-----------|--------|----------|
| All employees | Security awareness | Annual | E-learning | LMS |
| Developers | Secure coding, SQL injection prevention | Onboarding + Annual | Workshop | Attendance |
| DBAs | Database security best practices | Quarterly | Hands-on | Attendance |
| Administrators | Privileged access management | Onboarding + Annual | Workshop | Attendance |

### Security Awareness Topics
- SQL injection and prevention
- Least privilege principle
- Password security
- Phishing and social engineering
- Data classification and handling
- Incident reporting procedures

---

## Continuous Improvement

### Security Metrics and KPIs
| Metric | Target | Current | Trend | Owner |
|--------|--------|---------|-------|-------|
| Time to patch critical vulnerabilities | < 7 days | [X days] | [↑/↓/→] | [Name] |
| Failed login attempts | < 100/day | [X/day] | [↑/↓/→] | [Name] |
| Security incidents | 0 | [X] | [↑/↓/→] | [Name] |
| Access review completion | 100% | [X%] | [↑/↓/→] | [Name] |
| Unauthorized access attempts | 0 | [X] | [↑/↓/→] | [Name] |

### Security Assessments
| Assessment Type | Frequency | Last Completed | Next Scheduled | Findings |
|----------------|-----------|----------------|----------------|----------|
| Penetration Test | Annual | YYYY-MM-DD | YYYY-MM-DD | [Link to report] |
| Vulnerability Scan | Weekly | YYYY-MM-DD | YYYY-MM-DD | [Summary] |
| Security Audit | Quarterly | YYYY-MM-DD | YYYY-MM-DD | [Link to report] |
| Access Review | Quarterly | YYYY-MM-DD | YYYY-MM-DD | [Summary] |

### Continuous Monitoring
- **Security Posture Dashboard:** [Link]
- **Automated Compliance Checks:** [Tool/Frequency]
- **Threat Intelligence Integration:** [Feeds/Sources]

---

## Disaster Recovery and Business Continuity

### RPO and RTO
- **Recovery Point Objective (RPO):** [Maximum acceptable data loss - e.g., 15 minutes]
- **Recovery Time Objective (RTO):** [Maximum acceptable downtime - e.g., 1 hour]

### High Availability
- **Architecture:** [Master-slave | Multi-master | Active-active]
- **Automatic Failover:** [Enabled/Disabled]
- **Data Replication:** [Synchronous | Asynchronous]

### Disaster Recovery
- **DR Site:** [Geographic location]
- **DR Testing:** Quarterly
- **Last DR Test:** YYYY-MM-DD
- **Test Results:** [Pass/Fail - notes]

[Detailed DR procedures in separate Disaster Recovery Plan document]

---

## Appendices

### Appendix A: Security Controls Matrix
[Comprehensive mapping of all security controls to regulatory requirements]

### Appendix B: Threat Model
[Detailed threat modeling - attack vectors, threat actors, mitigations]

### Appendix C: Security Runbooks
[Step-by-step procedures for common security tasks]

### Appendix D: Compliance Evidence
[Inventory of compliance artifacts and evidence]

### Appendix E: Security Architecture Diagrams
[Detailed network and security architecture diagrams]

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Database Architect | | | |
| Security Officer | | | |
| Compliance Officer | | | |
| IT Director | | | |

---

## Revision History

| Version | Date | Author | Description | Approver |
|---------|------|--------|-------------|----------|
| 1.0 | YYYY-MM-DD | [Name] | Initial version | [Name] |
| | | | | |
