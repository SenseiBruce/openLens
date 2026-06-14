# Mobile Security Checklist

**App:** [App Name]
**Platform:** [iOS / Android / Both]
**Version:** [X.Y.Z]
**Reviewer:** [Name]
**Date:** [YYYY-MM-DD]

## Authentication & Authorization

### User Authentication
- [ ] Passwords transmitted over secure channel (HTTPS/TLS)
- [ ] Passwords never stored in plain text
- [ ] Strong password policy enforced (length, complexity)
- [ ] Multi-factor authentication (MFA) supported
- [ ] Biometric authentication (Face ID, Touch ID, fingerprint) implemented securely
- [ ] Account lockout after failed login attempts
- [ ] Session timeout implemented (configurable)
- [ ] Logout clears all session data
- [ ] "Remember me" uses secure token storage
- [ ] Password reset requires email/SMS verification

### Token Management
- [ ] OAuth 2.0 / JWT tokens used for authentication
- [ ] Tokens stored in Keychain (iOS) / KeyStore (Android)
- [ ] Access tokens have reasonable expiration (e.g., 1 hour)
- [ ] Refresh tokens implemented and secured
- [ ] Token refresh happens automatically before expiration
- [ ] Tokens invalidated on logout
- [ ] Tokens not exposed in logs or error messages
- [ ] No tokens in URL parameters

### Authorization
- [ ] Role-based access control (RBAC) implemented
- [ ] Proper authorization checks on all sensitive operations
- [ ] Client-side authorization checks backed by server-side validation
- [ ] Principle of least privilege enforced
- [ ] No hardcoded admin credentials or backdoors

## Data Protection

### Data at Rest
- [ ] Sensitive data encrypted at rest (AES-256)
- [ ] Database encrypted (SQLCipher, encrypted Core Data, Room encryption)
- [ ] Files containing sensitive data encrypted
- [ ] Keychain/KeyStore used for credentials, tokens, keys
- [ ] Secure enclave used for cryptographic keys (iOS)
- [ ] Android KeyStore with hardware-backed keys
- [ ] UserDefaults/SharedPreferences encrypted for sensitive settings
- [ ] No sensitive data in cache directories
- [ ] No sensitive data in system logs
- [ ] Proper file permissions set

### Data in Transit
- [ ] All network communication over HTTPS (TLS 1.2+)
- [ ] Certificate pinning implemented
- [ ] Backup certificate pins configured
- [ ] No cleartext traffic permitted (enforced by ATS/Network Security Config)
- [ ] Certificate validation not disabled
- [ ] Hostname verification enabled
- [ ] No self-signed certificates in production
- [ ] TLS 1.0/1.1 disabled
- [ ] Strong cipher suites only

### Data Minimization
- [ ] Only necessary data collected
- [ ] Data retention policies implemented
- [ ] Unnecessary data purged regularly
- [ ] User can delete their data
- [ ] PII handling complies with GDPR/CCPA
- [ ] Privacy policy accessible in app
- [ ] User consent obtained for data collection

## Secure Coding Practices

### Input Validation
- [ ] All user inputs validated (client and server side)
- [ ] Input length limits enforced
- [ ] Whitelist validation used where possible
- [ ] Special characters sanitized
- [ ] SQL injection prevention (parameterized queries, ORM)
- [ ] XSS prevention (output encoding)
- [ ] Path traversal prevention
- [ ] File upload validation (type, size, content)

### Code Quality
- [ ] No debug code in production builds
- [ ] No commented-out security checks
- [ ] No hardcoded secrets (API keys, passwords)
- [ ] No sensitive information in strings.xml or plist
- [ ] Secrets loaded from secure configuration
- [ ] Error messages don't leak sensitive information
- [ ] Stack traces not exposed to users
- [ ] Logging doesn't include PII or secrets

### Third-Party Libraries
- [ ] All dependencies reviewed for security
- [ ] Dependencies kept up to date
- [ ] Vulnerability scanning (SCA) implemented
- [ ] No known vulnerable dependencies
- [ ] Unnecessary dependencies removed
- [ ] License compliance verified
- [ ] SDKs from trusted sources only

## Platform-Specific Security

### iOS Security
- [ ] App Transport Security (ATS) enabled
- [ ] NSAllowsArbitraryLoads not set to true
- [ ] Keychain items with appropriate access control
- [ ] Touch ID/Face ID implementation follows best practices
- [ ] Background snapshots don't contain sensitive data
- [ ] Screen capture disabled for sensitive screens
- [ ] Pasteboard/clipboard cleared after use
- [ ] No sensitive data in URL schemes
- [ ] Proper entitlements configured
- [ ] Bitcode enabled (if required)

### Android Security
- [ ] Network Security Configuration properly set
- [ ] cleartextTrafficPermitted set to false
- [ ] Certificate pinning in Network Security Config
- [ ] Proguard/R8 obfuscation enabled for release builds
- [ ] AndroidManifest.xml reviewed for security
- [ ] Exported components properly secured
- [ ] Content providers with proper permissions
- [ ] Broadcast receivers protected
- [ ] android:allowBackup set appropriately
- [ ] Debuggable flag false in production
- [ ] android:usesCleartextTraffic false

## Binary Protection

### Code Obfuscation
- [ ] Code obfuscation enabled (ProGuard/R8 for Android)
- [ ] Symbol stripping enabled (iOS)
- [ ] Anti-tampering measures implemented
- [ ] String encryption for sensitive strings
- [ ] Control flow obfuscation (optional)

### Runtime Protection
- [ ] Jailbreak/root detection implemented
- [ ] Debugger detection implemented
- [ ] Emulator detection (if required)
- [ ] Integrity checks (signature verification)
- [ ] Anti-hooking measures
- [ ] SSL pinning can't be bypassed easily

### Reverse Engineering Protection
- [ ] Important logic on server-side
- [ ] Critical algorithms protected
- [ ] No proprietary algorithms in client
- [ ] API keys not embedded (or obfuscated if necessary)
- [ ] Secrets retrieved from server at runtime

## Session Management

### Session Security
- [ ] Secure session token generation (cryptographically random)
- [ ] Session fixation prevention
- [ ] Session tokens rotated on privilege change
- [ ] Concurrent session limits (optional)
- [ ] Session revocation on password change
- [ ] Session timeout on inactivity
- [ ] Session data cleared on logout
- [ ] No session data in shared storage

### Cookie Security (if using web views)
- [ ] Secure flag set on cookies
- [ ] HttpOnly flag set
- [ ] SameSite attribute configured
- [ ] Cookie expiration set appropriately

## Local Storage Security

### Secure Storage
- [ ] Keychain (iOS) used for sensitive data
- [ ] KeyStore (Android) used for cryptographic keys
- [ ] File protection attributes set (iOS)
- [ ] Internal storage used for sensitive files (Android)
- [ ] External storage not used for sensitive data
- [ ] Temp files cleaned up
- [ ] Clipboard cleared after use for sensitive data

### Database Security
- [ ] Database encrypted (SQLCipher/Room encryption)
- [ ] No sensitive data in unencrypted databases
- [ ] Database files not world-readable
- [ ] SQL injection prevention (parameterized queries)
- [ ] Database backups encrypted

## Network Security

### API Security
- [ ] API authentication implemented
- [ ] API authorization enforced
- [ ] Rate limiting on sensitive endpoints
- [ ] API versioning implemented
- [ ] API errors don't leak information
- [ ] No sensitive data in GET parameters
- [ ] Proper HTTP methods used (POST for mutations)
- [ ] CSRF protection (if applicable)

### Certificate Validation
- [ ] Certificate validation enabled
- [ ] Certificate pinning implemented correctly
- [ ] Backup pins configured
- [ ] Pin expiration handling
- [ ] Certificate validation not bypassed in production

### DNS Security
- [ ] DNS over HTTPS (DoH) considered
- [ ] DNS spoofing protection

## Privacy & Compliance

### Permissions
- [ ] Minimum permissions requested
- [ ] Permissions requested at appropriate time
- [ ] Permission rationale explained to users
- [ ] Graceful degradation if permission denied
- [ ] No dangerous permissions unless necessary
- [ ] Location precision appropriate (coarse vs fine)
- [ ] Background location justified and disclosed

### Privacy Policy
- [ ] Privacy policy accessible in app
- [ ] Privacy policy covers all data collection
- [ ] Privacy policy updated for this version
- [ ] User consent obtained where required
- [ ] Age verification for children's apps

### Data Subject Rights (GDPR/CCPA)
- [ ] Right to access (data export)
- [ ] Right to deletion (account deletion)
- [ ] Right to rectification (data correction)
- [ ] Right to object (opt-out mechanisms)
- [ ] Data portability

### Analytics & Tracking
- [ ] Analytics opt-out available
- [ ] No PII sent to analytics
- [ ] User IDs anonymized or hashed
- [ ] Third-party analytics reviewed for privacy
- [ ] IDFA/AAID usage declared (iOS/Android)
- [ ] App Tracking Transparency (iOS 14.5+) implemented

## Inter-Process Communication

### Deep Links / Universal Links
- [ ] Deep link validation implemented
- [ ] URL scheme handling secure
- [ ] No sensitive data in deep link URLs
- [ ] Intent filter validation (Android)
- [ ] Associated domains configured (iOS)

### Custom URL Schemes
- [ ] URL schemes validated before processing
- [ ] No sensitive actions via URL schemes
- [ ] Authentication required for sensitive operations

### WebViews
- [ ] JavaScript disabled unless necessary
- [ ] File access disabled
- [ ] JavaScript bridges secured
- [ ] Only trusted content loaded
- [ ] No user input directly in WebView
- [ ] CSP headers configured

## Push Notifications

### Notification Security
- [ ] No sensitive data in notification payload
- [ ] Notifications authenticated at server
- [ ] Push tokens secured
- [ ] Push tokens rotated/refreshed
- [ ] Deep links in notifications validated

## Biometric Authentication

### Implementation
- [ ] Biometric authentication properly implemented
- [ ] Fallback to password available
- [ ] Biometric data never leaves device
- [ ] Keychain/KeyStore items protected by biometrics
- [ ] LAPolicy/BiometricPrompt used correctly
- [ ] Biometric invalidation on enrollment change

## Logging & Monitoring

### Logging
- [ ] No PII in logs
- [ ] No passwords, tokens, keys in logs
- [ ] Logs don't expose sensitive business logic
- [ ] Production logs stored securely
- [ ] Log retention policy defined
- [ ] Sensitive errors logged server-side only

### Crash Reporting
- [ ] Crash reports don't include PII
- [ ] Crash reports don't include secrets
- [ ] Custom keys don't leak sensitive data
- [ ] Breadcrumbs reviewed for privacy

### Security Monitoring
- [ ] Failed authentication attempts logged
- [ ] Suspicious activity detected
- [ ] Security events reported to backend
- [ ] Anomaly detection for user behavior

## Secure Communication Protocols

### Real-time Communication
- [ ] WebSocket connections over WSS (TLS)
- [ ] Socket.io with secure transport
- [ ] MQTT over TLS (if applicable)
- [ ] Push notifications encrypted (if containing data)

## Physical Security

### Device Protection
- [ ] App locks after timeout
- [ ] Sensitive screens prevent screenshots
- [ ] Auto-lock on sensitive screens
- [ ] No sensitive data visible in app switcher
- [ ] Pasteboard/clipboard protection

## Third-Party Integrations

### SDK Security
- [ ] All third-party SDKs reviewed
- [ ] SDKs from official sources
- [ ] SDK privacy practices reviewed
- [ ] SDK data collection disclosed
- [ ] SDK permissions justified
- [ ] SDKs kept updated

### Payment Processing
- [ ] PCI-DSS compliance (if handling payments)
- [ ] No credit card data stored locally
- [ ] Payment SDK from trusted provider
- [ ] 3D Secure implemented
- [ ] Payment data encrypted

## Backup & Recovery

### Backup Security
- [ ] Sensitive data excluded from backups (iOS)
- [ ] allowBackup configured correctly (Android)
- [ ] Cloud backup encryption
- [ ] Backup restore doesn't reuse old tokens
- [ ] Keychain items with proper accessibility

## Incident Response

### Security Preparedness
- [ ] Security incident response plan exists
- [ ] Security team contact defined
- [ ] Vulnerability disclosure process
- [ ] Ability to remotely disable features
- [ ] Kill switch for critical security issues
- [ ] User notification process for breaches

## Testing & Validation

### Security Testing
- [ ] SAST (Static Analysis) performed
- [ ] DAST (Dynamic Analysis) performed
- [ ] Penetration testing completed
- [ ] Code review with security focus
- [ ] Dependency vulnerability scanning
- [ ] Manual security testing

### Test Results
- [ ] No critical vulnerabilities
- [ ] High vulnerabilities addressed or accepted
- [ ] Penetration test report reviewed
- [ ] Security scan results documented

## Documentation

### Security Documentation
- [ ] Architecture security review documented
- [ ] Threat model created
- [ ] Security requirements defined
- [ ] Secure coding guidelines followed
- [ ] Security test plan executed
- [ ] Security sign-off obtained

## Compliance

### Regulatory Compliance
- [ ] GDPR compliance (if applicable)
- [ ] CCPA compliance (if applicable)
- [ ] HIPAA compliance (if applicable)
- [ ] PCI-DSS compliance (if applicable)
- [ ] COPPA compliance (if children's app)
- [ ] Regional privacy laws reviewed

### App Store Requirements
- [ ] iOS App Store security guidelines met
- [ ] Google Play security guidelines met
- [ ] Privacy manifest (iOS 17+) configured
- [ ] Data safety section (Android) completed accurately

## Pre-Release Checklist

### Final Verification
- [ ] All security checklist items completed
- [ ] Security review approved
- [ ] Penetration test passed
- [ ] No known security vulnerabilities
- [ ] Privacy policy updated
- [ ] Security documentation complete
- [ ] Team trained on security practices

## Security Score

**Total Items:** [N]
**Completed:** [N]
**Not Applicable:** [N]
**Remaining:** [N]

**Compliance Rate:** [X]%

**Overall Security Rating:** [Excellent / Good / Fair / Poor]

## Critical Issues

| Issue | Severity | Status | Owner | Due Date |
|-------|----------|--------|-------|----------|
| [Issue 1] | [Critical/High/Medium] | [Open/In Progress/Resolved] | [Name] | [Date] |

## Recommendations

1. [Top security recommendation]
2. [Second recommendation]
3. [Third recommendation]

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Engineer | [Name] | [Date] | [Signature] |
| Mobile Lead | [Name] | [Date] | [Signature] |
| QA Lead | [Name] | [Date] | [Signature] |

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial checklist |
