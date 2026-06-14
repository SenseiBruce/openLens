# Security Engineer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Security Engineer  
**Purpose:** Guidance for security testing, threat modeling, compliance, and secure development practices

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Security Testing](#security-testing)
3. [Threat Modeling](#threat-modeling)
4. [Security Architecture Review](#security-architecture-review)
5. [Compliance & Regulations](#compliance--regulations)
6. [Vulnerability Management](#vulnerability-management)
7. [Secure Coding Practices](#secure-coding-practices)
8. [Cloud Security](#cloud-security)
9. [Container Security](#container-security)
10. [API Security](#api-security)
11. [Incident Response](#incident-response)
12. [Quality Standards](#quality-standards)
13. [Integration Points](#integration-points)
14. [Tools & Frameworks](#tools--frameworks)
15. [Project Type Adaptations](#project-type-adaptations)
16. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Defense in Depth
- **Multiple security layers:** No single point of failure
- **Fail securely:** Default to deny, fail closed
- **Least privilege:** Grant minimum necessary permissions
- **Separation of duties:** No single user has complete control
- **Zero trust:** Verify explicitly, never assume trust

### 1.2 Security by Design
- **Shift-left security:** Address security from the start
- **Threat modeling:** Identify threats early in design
- **Secure defaults:** Secure configuration out-of-the-box
- **Privacy by design:** Build privacy into the system
- **Security in CI/CD:** Automated security testing in pipelines

### 1.3 Continuous Security
- **Continuous monitoring:** Real-time threat detection
- **Regular assessments:** Periodic security audits and penetration tests
- **Vulnerability management:** Rapid patching and remediation
- **Security awareness:** Ongoing team training
- **Incident readiness:** Tested response procedures

---

## Security Testing

### 2.1 SAST (Static Application Security Testing)

**Python - Bandit:**
```bash
# Install
pip install bandit

# Run scan
bandit -r src/ -f json -o bandit-report.json

# CI/CD integration
bandit -r src/ -ll -i  # High severity only, ignore low
```

**Example Bandit Configuration (.bandit):**
```yaml
# .bandit
exclude_dirs:
  - /tests/
  - /venv/
  - /.venv/

tests:
  - B201  # Flask debug mode
  - B301  # Pickle usage
  - B303  # MD5 or SHA1
  - B304  # Insecure ciphers
  - B305  # Insecure cipher modes
  - B306  # mktemp usage
  - B307  # Eval usage
  - B308  # mark_safe usage
  - B309  # HTTPSConnection
  - B310  # URL open
  - B311  # Random
  - B312  # Telnet
  - B313  # XML libraries
  - B314  # XML libraries
  - B315  # XML libraries
  - B316  # XML libraries
  - B317  # XML libraries
  - B318  # XML libraries
  - B319  # XML libraries
  - B320  # XML libraries
  - B321  # FTP
  - B322  # Input
  - B323  # Unverified SSL
  - B324  # Weak hash
  - B325  # Weak random
  - B501  # Request with verify=False
  - B502  # SSL with bad version
  - B503  # SSL with bad defaults
  - B504  # SSL with no context
  - B505  # Weak crypto key
  - B506  # Yaml load
  - B507  # SSH host key verification
  - B601  # Paramiko calls
  - B602  # Shell injection
  - B603  # Subprocess without shell
  - B604  # Function call with shell
  - B605  # Process with shell
  - B606  # Process without shell
  - B607  # Partial path
  - B608  # SQL injection
  - B609  # Linux wildcard injection

skips:
  - B101  # Skip assert_used in test files
```

**JavaScript/TypeScript - ESLint Security:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  }
};
```

### 2.2 DAST (Dynamic Application Security Testing)

**OWASP ZAP Automated Scan:**
```python
# tests/security/test_zap_scan.py
from zapv2 import ZAPv2
import time
import json

class ZAPScanner:
    def __init__(self, target_url, api_key):
        self.target = target_url
        self.zap = ZAPv2(apikey=api_key, proxies={'http': 'http://localhost:8080'})
    
    def spider_scan(self):
        """Spider the target application."""
        print(f'Spidering target {self.target}')
        scan_id = self.zap.spider.scan(self.target)
        
        while int(self.zap.spider.status(scan_id)) < 100:
            print(f'Spider progress: {self.zap.spider.status(scan_id)}%')
            time.sleep(2)
        
        print('Spider completed')
    
    def active_scan(self):
        """Perform active security scan."""
        print(f'Active scanning target {self.target}')
        scan_id = self.zap.ascan.scan(self.target)
        
        while int(self.zap.ascan.status(scan_id)) < 100:
            print(f'Active scan progress: {self.zap.ascan.status(scan_id)}%')
            time.sleep(5)
        
        print('Active scan completed')
    
    def get_alerts(self):
        """Retrieve and categorize alerts."""
        alerts = self.zap.core.alerts(baseurl=self.target)
        
        categorized = {
            'High': [],
            'Medium': [],
            'Low': [],
            'Informational': []
        }
        
        for alert in alerts:
            categorized[alert['risk']].append({
                'name': alert['alert'],
                'url': alert['url'],
                'description': alert['description'],
                'solution': alert['solution']
            })
        
        return categorized
    
    def generate_report(self, output_file):
        """Generate HTML report."""
        html_report = self.zap.core.htmlreport()
        with open(output_file, 'w') as f:
            f.write(html_report)
        print(f'Report saved to {output_file}')
    
    def assert_no_high_risk(self):
        """Fail if high-risk vulnerabilities found."""
        alerts = self.get_alerts()
        
        if alerts['High']:
            print("HIGH RISK VULNERABILITIES FOUND:")
            for alert in alerts['High']:
                print(f"  - {alert['name']} at {alert['url']}")
            raise AssertionError(f"Found {len(alerts['High'])} high-risk vulnerabilities")

# Usage
if __name__ == '__main__':
    scanner = ZAPScanner('http://localhost:8000', 'your-api-key')
    scanner.spider_scan()
    scanner.active_scan()
    scanner.generate_report('zap-report.html')
    scanner.assert_no_high_risk()
```

### 2.3 Penetration Testing

**Manual Penetration Test Checklist:**

**Authentication & Session Management:**
- [ ] Test for weak passwords
- [ ] Test password reset functionality
- [ ] Test session timeout
- [ ] Test session fixation
- [ ] Test for concurrent sessions
- [ ] Test remember me functionality
- [ ] Test logout functionality
- [ ] Test account lockout mechanism

**Authorization:**
- [ ] Test horizontal privilege escalation
- [ ] Test vertical privilege escalation
- [ ] Test direct object references
- [ ] Test missing function-level access control
- [ ] Test API authorization

**Input Validation:**
- [ ] SQL injection (all input fields)
- [ ] XSS (reflected, stored, DOM-based)
- [ ] Command injection
- [ ] XXE (XML External Entity)
- [ ] Path traversal
- [ ] LDAP injection
- [ ] Template injection

**Business Logic:**
- [ ] Test workflow bypass
- [ ] Test race conditions
- [ ] Test price manipulation
- [ ] Test quantity limits
- [ ] Test negative numbers
- [ ] Test large numbers (integer overflow)

### 2.4 Dependency Scanning

**Python - Safety:**
```bash
# Install
pip install safety

# Check for known vulnerabilities
safety check --json

# CI/CD integration
safety check --exit-code 1  # Fail on vulnerabilities
```

**JavaScript - npm audit:**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# CI/CD integration
npm audit --audit-level=high  # Fail on high/critical
```

**Snyk Integration:**
```yaml
# .github/workflows/security.yml
- name: Run Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

### 2.5 Secrets Detection

**Git Secrets Scanning:**
```bash
# Install git-secrets
brew install git-secrets  # macOS
apt-get install git-secrets  # Linux

# Initialize
git secrets --install
git secrets --register-aws

# Scan repository
git secrets --scan

# Scan all history
git secrets --scan-history
```

**TruffleHog:**
```bash
# Install
pip install trufflehog

# Scan repository
trufflehog --regex --entropy=True https://github.com/user/repo.git

# CI/CD integration
trufflehog --regex --entropy=True --max_depth=1 .
```

**GitGuardian:**
```yaml
# .github/workflows/secrets.yml
- name: GitGuardian scan
  uses: GitGuardian/ggshield-action@master
  env:
    GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

---

## Threat Modeling

### 3.1 STRIDE Threat Model

**STRIDE Framework:**
- **S**poofing: Impersonating a user or system
- **T**ampering: Modifying data or code
- **R**epudiation: Denying actions performed
- **I**nformation Disclosure: Exposing sensitive information
- **D**enial of Service: Making system unavailable
- **E**levation of Privilege: Gaining unauthorized access

**Threat Modeling Template:**
```markdown
# Threat Model: User Authentication System

## System Overview
- Web application with user login
- JWT-based authentication
- PostgreSQL database
- Redis for session storage

## Data Flow Diagram
```
[User] → [Web App] → [Auth Service] → [Database]
                   ↓
              [Redis Cache]
```

## Assets
1. User credentials (passwords, tokens)
2. User personal data
3. Session tokens
4. API keys

## Trust Boundaries
- Internet → Web Application (HTTPS)
- Web Application → Auth Service (Internal)
- Auth Service → Database (Internal)

## Threats Identified

### T1: Spoofing - Credential Stuffing
- **Description:** Attacker uses leaked credentials from other breaches
- **Impact:** High - Account takeover
- **Likelihood:** Medium
- **Mitigation:**
  - Implement rate limiting
  - Monitor for suspicious login patterns
  - Require MFA for sensitive operations
  - Check against breach databases (Have I Been Pwned)
- **Status:** Mitigated

### T2: Tampering - JWT Token Manipulation
- **Description:** Attacker modifies JWT token to escalate privileges
- **Impact:** Critical - Full system compromise
- **Likelihood:** Low (if properly implemented)
- **Mitigation:**
  - Use strong signing algorithm (RS256)
  - Validate signature on every request
  - Short token expiration (1 hour)
  - Refresh token rotation
- **Status:** Mitigated

### T3: Information Disclosure - Password in Logs
- **Description:** Passwords logged in application logs
- **Impact:** Critical - Credential exposure
- **Likelihood:** Medium
- **Mitigation:**
  - Never log request bodies
  - Sanitize logs
  - Encrypt logs at rest
  - Restrict log access
- **Status:** Mitigated

### T4: Denial of Service - Login Endpoint Flood
- **Description:** Attacker floods login endpoint
- **Impact:** High - Service unavailable
- **Likelihood:** High
- **Mitigation:**
  - Rate limiting (5 attempts per minute)
  - CAPTCHA after failed attempts
  - CDN with DDoS protection
  - Account lockout after 5 failures
- **Status:** Mitigated

### T5: Elevation of Privilege - SQL Injection
- **Description:** Attacker injects SQL to bypass authentication
- **Impact:** Critical - Full database access
- **Likelihood:** Low (if using ORM)
- **Mitigation:**
  - Use parameterized queries
  - ORM with parameter binding
  - Input validation
  - Least privilege database user
  - Web Application Firewall (WAF)
- **Status:** Mitigated
```

### 3.2 Attack Trees

**Example Attack Tree:**
```
Goal: Gain Unauthorized Access to User Account
├─ Obtain Valid Credentials [OR]
│  ├─ Phishing Attack
│  ├─ Credential Stuffing
│  ├─ Brute Force
│  └─ Database Breach
├─ Bypass Authentication [OR]
│  ├─ SQL Injection
│  ├─ Authentication Logic Flaw
│  └─ Session Fixation
└─ Steal Session Token [OR]
   ├─ XSS Attack
   ├─ Man-in-the-Middle
   └─ Session Hijacking
```

---

## Security Architecture Review

### 4.1 Architecture Review Checklist

**Network Security:**
- [ ] Network segmentation implemented
- [ ] Firewalls configured (ingress/egress)
- [ ] VPC/VNet properly configured
- [ ] Private subnets for sensitive services
- [ ] No direct internet access to databases
- [ ] VPN required for admin access
- [ ] DDoS protection enabled

**Authentication & Authorization:**
- [ ] Strong password policy enforced
- [ ] MFA available for all users
- [ ] MFA required for admin accounts
- [ ] Session timeout configured
- [ ] Secure session management
- [ ] Role-based access control (RBAC)
- [ ] Principle of least privilege applied

**Data Protection:**
- [ ] Encryption at rest (databases, storage)
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Secure key management
- [ ] Data classification implemented
- [ ] PII/sensitive data identified
- [ ] Data retention policy defined
- [ ] Secure data deletion

**Application Security:**
- [ ] Input validation on all inputs
- [ ] Output encoding
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers configured
- [ ] Error handling doesn't leak info
- [ ] Logging doesn't contain secrets

**API Security:**
- [ ] Authentication required
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] CORS properly configured
- [ ] API versioning
- [ ] Request size limits
- [ ] No verbose error messages

**Infrastructure Security:**
- [ ] Immutable infrastructure
- [ ] No SSH to production servers
- [ ] Bastion host for admin access
- [ ] Security groups/network policies
- [ ] Automated patching
- [ ] Vulnerability scanning
- [ ] Container security

---

## Compliance & Regulations

### 5.1 GDPR Compliance

**GDPR Requirements Checklist:**
- [ ] **Lawful Basis:** Legal basis for processing documented
- [ ] **Consent:** Explicit consent obtained where required
- [ ] **Data Minimization:** Only collect necessary data
- [ ] **Purpose Limitation:** Data used only for stated purpose
- [ ] **Accuracy:** Mechanisms to keep data accurate
- [ ] **Storage Limitation:** Data retention policy implemented
- [ ] **Security:** Appropriate security measures
- [ ] **Privacy by Design:** Privacy built into systems
- [ ] **DPO:** Data Protection Officer appointed (if required)
- [ ] **Records:** Processing activities documented
- [ ] **DPIA:** Data Protection Impact Assessment completed
- [ ] **Data Breach:** Breach notification process (72 hours)
- [ ] **Subject Rights:** Process for handling data subject requests:
  - Right to access
  - Right to rectification
  - Right to erasure
  - Right to restrict processing
  - Right to data portability
  - Right to object

**GDPR Implementation Example:**
```python
# models/user.py
class User:
    """User model with GDPR compliance."""
    
    # Data minimization - only necessary fields
    id: int
    email: str  # Required for service
    first_name: str  # Required for service
    last_name: str  # Required for service
    
    # Consent tracking
    marketing_consent: bool = False
    marketing_consent_date: datetime = None
    
    # Audit trail
    created_at: datetime
    updated_at: datetime
    last_login: datetime
    
    # Data retention
    deletion_scheduled: datetime = None
    
    def anonymize(self):
        """Anonymize user data (right to erasure)."""
        self.email = f"deleted-{self.id}@example.com"
        self.first_name = "Deleted"
        self.last_name = "User"
        self.deletion_scheduled = None
    
    def export_data(self):
        """Export user data (right to data portability)."""
        return {
            'personal_data': {
                'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
            },
            'account_data': {
                'created_at': self.created_at,
                'last_login': self.last_login,
            },
            'consents': {
                'marketing': self.marketing_consent,
                'marketing_date': self.marketing_consent_date,
            }
        }
```

### 5.2 PCI-DSS Compliance

**PCI-DSS Requirements (if handling payment cards):**
- [ ] **Req 1:** Firewall configuration
- [ ] **Req 2:** No default passwords
- [ ] **Req 3:** Protect stored cardholder data
  - Never store CVV/CVC
  - Encrypt PANs
  - Mask PANs when displayed
- [ ] **Req 4:** Encrypt transmission of cardholder data
  - TLS 1.2+ for all transmission
  - Strong cryptography
- [ ] **Req 5:** Anti-virus software
- [ ] **Req 6:** Secure development
  - Security in SDLC
  - Code reviews
  - Vulnerability management
- [ ] **Req 7:** Restrict access (need-to-know)
- [ ] **Req 8:** Unique IDs for access
  - MFA for remote access
  - Strong passwords
- [ ] **Req 9:** Physical access controls
- [ ] **Req 10:** Track and monitor access
  - Audit logs
  - Log review
- [ ] **Req 11:** Security testing
  - Quarterly vulnerability scans
  - Annual penetration tests
- [ ] **Req 12:** Security policy

**Recommendation:** Use payment processors (Stripe, PayPal) to avoid PCI-DSS scope

### 5.3 HIPAA Compliance

**HIPAA Requirements (if handling health data):**
- [ ] **Administrative Safeguards:**
  - Security management process
  - Workforce security
  - Information access management
  - Security awareness training
  - Incident response plan
- [ ] **Physical Safeguards:**
  - Facility access controls
  - Workstation security
  - Device and media controls
- [ ] **Technical Safeguards:**
  - Access control
  - Audit controls
  - Integrity controls
  - Transmission security
- [ ] **Breach Notification:**
  - Process for breach notification
  - 60-day notification requirement

---

## Vulnerability Management

### 6.1 Vulnerability Scanning

**Automated Scanning Schedule:**
| Scan Type | Frequency | Tool | Severity Threshold |
|-----------|-----------|------|-------------------|
| SAST | Every commit | Bandit, ESLint | High |
| Dependency | Daily | Safety, npm audit, Snyk | High |
| DAST | Weekly | OWASP ZAP | Medium |
| Container | On build | Trivy, Clair | High |
| Infrastructure | Weekly | AWS Inspector, GCP Security Scanner | High |

**Trivy Container Scanning:**
```bash
# Scan Docker image
trivy image myapp:latest

# Fail on high/critical vulnerabilities
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Generate report
trivy image --format json --output report.json myapp:latest
```

### 6.2 Vulnerability Remediation

**Remediation SLAs:**
| Severity | Response Time | Remediation Time | Owner |
|----------|---------------|------------------|--------|
| Critical | 1 hour | 24 hours | Security Team + Dev Lead |
| High | 4 hours | 7 days | Development Team |
| Medium | 1 day | 30 days | Development Team |
| Low | 1 week | 90 days | Development Team |

**Vulnerability Tracking:**
```markdown
# Vulnerability: SQL Injection in Login Endpoint

**ID:** VULN-2026-001
**Severity:** Critical
**CVSS Score:** 9.8
**Discovered:** 2026-02-09
**Status:** In Progress

## Description
SQL injection vulnerability in login endpoint allows unauthenticated attacker to bypass authentication.

## Affected Systems
- Production API (api.example.com)
- Staging API (staging.example.com)

## Proof of Concept
```sql
' OR '1'='1' --
```

## Remediation Steps
1. [x] Disable vulnerable endpoint in production (emergency fix)
2. [ ] Implement parameterized queries
3. [ ] Add input validation
4. [ ] Deploy fix to staging
5. [ ] Test fix
6. [ ] Deploy to production
7. [ ] Verify fix
8. [ ] Add regression test

## Timeline
- **Discovered:** 2026-02-09 10:00
- **Emergency Fix:** 2026-02-09 11:00
- **Permanent Fix ETA:** 2026-02-09 18:00
```

---

## Secure Coding Practices

### 7.1 Input Validation

**Never Trust User Input:**
```python
# BAD - No validation
def create_user(email, password):
    db.execute(f"INSERT INTO users (email, password) VALUES ('{email}', '{password}')")

# GOOD - Parameterized queries + validation
def create_user(email, password):
    # Validate input
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        raise ValueError('Invalid email format')
    
    if len(password) < 8:
        raise ValueError('Password must be at least 8 characters')
    
    # Use parameterized query
    db.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, hash_password(password))
    )
```

**Input Validation Library (Python):**
```python
from marshmallow import Schema, fields, validate, ValidationError

class UserSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(
        required=True,
        validate=[
            validate.Length(min=8, max=128),
            validate.Regexp(
                r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])',
                error='Password must contain uppercase, lowercase, digit, and special character'
            )
        ]
    )
    age = fields.Int(validate=validate.Range(min=18, max=120))

# Usage
schema = UserSchema()
try:
    data = schema.load(request.json)
except ValidationError as err:
    return {'errors': err.messages}, 422
```

### 7.2 Output Encoding

**Prevent XSS:**
```python
# BAD - Raw output
@app.route('/user/<user_id>')
def user_profile(user_id):
    user = get_user(user_id)
    return f"<h1>Welcome {user.name}</h1>"  # XSS vulnerability!

# GOOD - Template with auto-escaping
@app.route('/user/<user_id>')
def user_profile(user_id):
    user = get_user(user_id)
    return render_template('user.html', user=user)  # Jinja2 auto-escapes
```

```html
<!-- Template with proper escaping -->
<h1>Welcome {{ user.name }}</h1>  <!-- Auto-escaped -->
<div>{{ user.bio | safe }}</div>  <!-- Only if sanitized -->
```

### 7.3 Cryptography

**Password Hashing:**
```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def hash_password(password: str) -> str:
    """Hash password using Argon2."""
    return ph.hash(password)

def verify_password(hash: str, password: str) -> bool:
    """Verify password against hash."""
    try:
        ph.verify(hash, password)
        
        # Check if rehashing is needed (parameters changed)
        if ph.check_needs_rehash(hash):
            # Update hash in database with new parameters
            return True, hash_password(password)
        
        return True, None
    except VerifyMismatchError:
        return False, None
```

**Encryption:**
```python
from cryptography.fernet import Fernet
import os

class DataEncryption:
    """Encrypt/decrypt sensitive data."""
    
    def __init__(self):
        # Load key from environment (never hardcode!)
        key = os.environ['ENCRYPTION_KEY'].encode()
        self.cipher = Fernet(key)
    
    def encrypt(self, data: str) -> str:
        """Encrypt string data."""
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt string data."""
        return self.cipher.decrypt(encrypted_data.encode()).decode()

# Usage
encryptor = DataEncryption()
encrypted_ssn = encryptor.encrypt('123-45-6789')
# Store encrypted_ssn in database

# When needed
ssn = encryptor.decrypt(encrypted_ssn)
```

### 7.4 Secrets Management

**Environment Variables (.env file - never commit!):**
```bash
# .env (add to .gitignore!)
DATABASE_URL=postgresql://user:password@localhost:5432/db
SECRET_KEY=your-secret-key-here
API_KEY=your-api-key-here
ENCRYPTION_KEY=your-encryption-key-here
```

**AWS Secrets Manager:**
```python
import boto3
import json

def get_secret(secret_name):
    """Retrieve secret from AWS Secrets Manager."""
    client = boto3.client('secretsmanager', region_name='us-east-1')
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except Exception as e:
        print(f"Error retrieving secret: {e}")
        raise

# Usage
db_creds = get_secret('prod/database/credentials')
DATABASE_URL = f"postgresql://{db_creds['username']}:{db_creds['password']}@{db_creds['host']}/{db_creds['database']}"
```

**HashiCorp Vault:**
```python
import hvac

def get_vault_secret(path):
    """Retrieve secret from HashiCorp Vault."""
    client = hvac.Client(url='https://vault.example.com')
    client.token = os.environ['VAULT_TOKEN']
    
    secret = client.secrets.kv.v2.read_secret_version(path=path)
    return secret['data']['data']

# Usage
db_creds = get_vault_secret('secret/database/prod')
```

---

## Cloud Security

### 8.1 AWS Security Best Practices

**IAM Policies - Least Privilege:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-bucket",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["uploads/*"]
        }
      }
    }
  ]
}
```

**S3 Bucket Security:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::my-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

**VPC Security:**
```hcl
# Security group - restrictive ingress
resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for application"
  vpc_id      = aws_vpc.main.id

  # Only allow HTTPS from ALB
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Allow all outbound (refine as needed)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### 8.2 GCP Security Best Practices

**Service Account with Minimal Permissions:**
```hcl
resource "google_service_account" "app" {
  account_id   = "app-sa"
  display_name = "Application Service Account"
}

# Grant only necessary permissions
resource "google_project_iam_member" "app_storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.app.email}"
  
  condition {
    title       = "Access to specific bucket only"
    expression  = "resource.name.startsWith('projects/_/buckets/my-bucket')"
  }
}
```

**VPC Firewall Rules:**
```hcl
# Allow ingress only from load balancer
resource "google_compute_firewall" "allow_lb" {
  name    = "allow-lb-to-app"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]  # GCP LB ranges
  target_tags   = ["app-server"]
}

# Deny all other ingress by default
resource "google_compute_firewall" "deny_all" {
  name     = "deny-all-ingress"
  network  = google_compute_network.vpc.name
  priority = 65534

  deny {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}
```

---

## Container Security

### 9.1 Dockerfile Security

**Secure Dockerfile:**
```dockerfile
# Use specific version, not 'latest'
FROM python:3.11.7-slim@sha256:specific-hash

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Set working directory
WORKDIR /app

# Install dependencies as root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Don't run as PID 1 (use tini)
ENTRYPOINT ["/usr/bin/tini", "--"]

# Run application
CMD ["gunicorn", "app:app"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"
```

### 9.2 Kubernetes Security

**Pod Security Context:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
      requests:
        memory: "256Mi"
        cpu: "250m"
```

**Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-network-policy
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  - Egress
  
  ingress:
  # Only allow from ingress controller
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8000
  
  egress:
  # Allow DNS
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
  
  # Allow to database
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

---

## API Security

### 10.1 API Authentication

**JWT Best Practices:**
```python
import jwt
from datetime import datetime, timedelta

def generate_access_token(user_id: int) -> str:
    """Generate short-lived access token."""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),  # Short expiration
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    # Use RS256 (asymmetric) for better security
    return jwt.encode(payload, PRIVATE_KEY, algorithm='RS256')

def verify_token(token: str) -> dict:
    """Verify and decode token."""
    try:
        # Verify with public key
        payload = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=['RS256'],
            options={
                'require_exp': True,
                'require_iat': True,
                'verify_signature': True
            }
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
```

### 10.2 Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"
)

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    """Login endpoint with rate limiting."""
    pass

@app.route('/api/expensive-operation')
@limiter.limit("10 per hour")
def expensive_operation():
    """Resource-intensive endpoint."""
    pass
```

### 10.3 API Security Headers

```python
from flask import Flask
from flask_talisman import Talisman

app = Flask(__name__)

# Security headers
Talisman(app, 
    force_https=True,
    strict_transport_security=True,
    strict_transport_security_max_age=31536000,
    content_security_policy={
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
    },
    content_security_policy_nonce_in=['script-src'],
    referrer_policy='strict-origin-when-cross-origin',
    feature_policy={
        'geolocation': "'none'",
        'microphone': "'none'",
        'camera': "'none'",
    }
)

@app.after_request
def set_security_headers(response):
    """Set additional security headers."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response
```

---

## Incident Response

### 11.1 Incident Response Plan

**Incident Response Phases:**
1. **Preparation:** Tools, training, procedures ready
2. **Identification:** Detect and confirm incident
3. **Containment:** Stop spread, limit damage
4. **Eradication:** Remove threat
5. **Recovery:** Restore normal operations
6. **Lessons Learned:** Post-incident review

**Incident Response Runbook:**
```markdown
# Security Incident Response Runbook

## Phase 1: Identification (0-15 minutes)

### Detection
- Alert received from monitoring system
- User report
- Security scan finding

### Initial Assessment
- [ ] Confirm incident is real (not false positive)
- [ ] Determine severity (Critical/High/Medium/Low)
- [ ] Identify affected systems
- [ ] Document initial findings

### Notification
- [ ] Notify Security Team Lead
- [ ] Notify CTO (if Critical/High)
- [ ] Create incident ticket
- [ ] Start incident log

## Phase 2: Containment (15-60 minutes)

### Short-term Containment
- [ ] Isolate affected systems
- [ ] Block malicious IPs
- [ ] Revoke compromised credentials
- [ ] Enable additional logging

### Evidence Preservation
- [ ] Take system snapshots
- [ ] Preserve logs
- [ ] Document all actions taken

### Long-term Containment
- [ ] Apply temporary fixes
- [ ] Monitor for further activity
- [ ] Update security rules

## Phase 3: Eradication (1-24 hours)

- [ ] Identify root cause
- [ ] Remove malware/backdoors
- [ ] Patch vulnerabilities
- [ ] Reset all affected credentials
- [ ] Verify eradication complete

## Phase 4: Recovery (1-48 hours)

- [ ] Restore systems from clean backups
- [ ] Verify system integrity
- [ ] Gradually restore services
- [ ] Monitor for suspicious activity
- [ ] Return to normal operations

## Phase 5: Post-Incident (1-7 days)

- [ ] Conduct post-mortem meeting
- [ ] Document lessons learned
- [ ] Update security procedures
- [ ] Implement preventive measures
- [ ] Close incident ticket
```

### 11.2 Data Breach Response

**GDPR Data Breach Notification (72 hours):**
```markdown
# Data Breach Notification Template

## Breach Details
- **Date Discovered:** 2026-02-09 14:00 UTC
- **Date Occurred:** 2026-02-08 (estimated)
- **Type of Breach:** Unauthorized access to user database
- **Data Affected:** Email addresses, hashed passwords
- **Number of Affected Individuals:** ~10,000

## Breach Description
Unauthorized access to production database through exploited SQL injection vulnerability in user profile endpoint.

## Actions Taken
1. Vulnerability patched (2026-02-09 15:00)
2. All user passwords reset
3. Affected users notified
4. Additional monitoring enabled
5. Penetration test scheduled

## Assessment of Risk
- Passwords were hashed with Argon2 (low risk of compromise)
- No payment or sensitive personal data exposed
- Email addresses may be used for phishing (medium risk)

## Measures to Mitigate
- Mandatory password reset for all users
- Enhanced monitoring for suspicious login attempts
- Security awareness training for users
- Additional security audits scheduled

## Communication
- Users notified: 2026-02-09 18:00
- Supervisory authority notified: 2026-02-10 10:00
- Public statement: 2026-02-10 12:00
```

---

## Quality Standards

### 12.1 Security Metrics

**Security Scan Results:**
- SAST: Zero high/critical findings
- Dependency scan: Zero high/critical vulnerabilities
- DAST: Zero high-risk findings
- Container scan: Zero high/critical vulnerabilities

**Vulnerability Management:**
- Critical vulnerabilities: Fixed within 24 hours
- High vulnerabilities: Fixed within 7 days
- Mean time to remediate: < 5 days

**Security Testing:**
- Automated security tests in CI/CD: 100%
- Manual penetration test: Annual
- Security code review: 100% of critical code

---

## Integration Points

### 13.1 Integration with Other Roles

**From Technical Architect:**
- Architecture diagrams for threat modeling
- Technology choices for security review
- Security requirements

**To Developers:**
- Security scan results
- Vulnerability reports
- Secure coding guidelines
- Security training

**To DevOps:**
- Security requirements for infrastructure
- Secrets management procedures
- Security monitoring requirements
- Incident response procedures

**To QA:**
- Security test cases
- Penetration test results
- Vulnerability verification
- Security regression tests

---

## Tools & Frameworks

### 14.1 Essential Tools

**SAST:** Bandit (Python), ESLint Security (JS), SonarQube
**DAST:** OWASP ZAP, Burp Suite
**Dependency Scanning:** Safety, Snyk, npm audit
**Container Security:** Trivy, Clair, Aqua Security
**Secrets Detection:** git-secrets, TruffleHog, GitGuardian
**Threat Modeling:** Microsoft Threat Modeling Tool, OWASP Threat Dragon

---

## Project Type Adaptations

### 15.1 POC
**Security Focus:** Basic security hygiene
**Time:** 5-10 hours

### 15.2 Prototype
**Security Focus:** Security testing, dependency scanning
**Time:** 20-40 hours

### 15.3 MVP
**Security Focus:** Comprehensive security, compliance
**Time:** 80-150 hours

### 15.4 Handover
**Security Focus:** Enterprise security, audits, compliance
**Time:** 200-400 hours

---

## Self-Assessment Checklist

### 16.1 Security Testing
- [ ] SAST integrated in CI/CD
- [ ] DAST performed regularly
- [ ] Dependency scanning automated
- [ ] Container scanning automated
- [ ] Secrets scanning enabled
- [ ] Penetration testing completed
- [ ] Security regression tests added

### 16.2 Security Controls
- [ ] Authentication implemented securely
- [ ] Authorization enforced
- [ ] Input validation comprehensive
- [ ] Output encoding implemented
- [ ] Encryption at rest and in transit
- [ ] Secrets managed securely
- [ ] Security headers configured
- [ ] Rate limiting implemented

### 16.3 Compliance
- [ ] Compliance requirements identified
- [ ] Data classification completed
- [ ] Privacy by design implemented
- [ ] Audit logging enabled
- [ ] Data retention policy implemented
- [ ] Breach notification process defined

### 16.4 Incident Response
- [ ] Incident response plan documented
- [ ] Team trained on procedures
- [ ] Incident response tested
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD.
