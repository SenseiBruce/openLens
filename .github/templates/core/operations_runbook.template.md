# Operations Runbook: [Project Name]

**Project ID:** [proj_YYYYMMDD_HHMMSS]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** @devops-engineer / @technical-writer

---

## Overview

This runbook provides operational procedures for running, monitoring, and troubleshooting [Project Name] in production.

**Target Audience:** DevOps engineers, SREs, on-call engineers

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Deployment](#deployment)
3. [Monitoring & Alerts](#monitoring--alerts)
4. [Common Operations](#common-operations)
5. [Troubleshooting](#troubleshooting)
6. [Incident Response](#incident-response)
7. [Maintenance](#maintenance)
8. [Contact Information](#contact-information)

---

## System Architecture

### High-Level Components

```
[User/Client]
     ↓
[API Gateway / Load Balancer]
     ↓
[Application Layer]
     ↓
[Database / Storage]
```

### Key Components

| Component | Technology | Purpose | Location |
|-----------|-----------|---------|----------|
| API | [e.g., FastAPI/Lambda] | REST API endpoints | [AWS Region/URL] |
| Database | [e.g., PostgreSQL RDS] | Data persistence | [AWS Region] |
| Cache | [e.g., Redis/ElastiCache] | Performance | [AWS Region] |
| Storage | [e.g., S3] | File storage | [AWS Region/Bucket] |
| Queue | [e.g., SQS] | Async processing | [AWS Region] |

### Environment Configuration

| Environment | Purpose | URL | Infrastructure |
|-------------|---------|-----|---------------|
| **Development** | Testing | [dev-url] | 512MB Lambda, t3.micro RDS, $20/month |
| **Staging** | Pre-production | [staging-url] | 768MB Lambda, t3.small RDS, $30/month |
| **Production** | Live system | [prod-url] | 1024MB Lambda, t3.small RDS, $50/month |

---

## Deployment

### Prerequisites

- AWS CLI configured
- Terraform installed
- VPN access (for database operations)
- Appropriate IAM permissions

### Standard Deployment

```bash
# Navigate to infrastructure directory
cd /path/to/project/infrastructure

# Deploy to environment
./deploy.sh [dev|staging|prod]

# Script will:
# 1. Check prerequisites
# 2. Load/generate secrets from .secrets/
# 3. Set up S3 backend for Terraform state
# 4. Build Lambda packages
# 5. Run terraform plan
# 6. Prompt for approval
# 7. Apply infrastructure changes
# 8. Initialize database (optional)
# 9. Save deployment info
# 10. Run smoke tests
```

### Manual Deployment

```bash
# Initialize Terraform
cd infrastructure
terraform init -backend-config=environments/prod/backend.conf

# Review changes
terraform plan -var-file=environments/prod/terraform.tfvars

# Apply changes
terraform apply -var-file=environments/prod/terraform.tfvars

# Verify deployment
terraform output
```

### Rollback Procedure

```bash
# Option 1: Terraform state rollback
terraform state pull > backup.tfstate
terraform state push previous.tfstate
terraform apply

# Option 2: Redeploy previous version
git checkout <previous-commit>
./deploy.sh prod

# Option 3: Manual Lambda version rollback
aws lambda update-function-configuration \
  --function-name <function-name> \
  --environment Variables={VERSION=<previous-version>}
```

---

## Monitoring & Alerts

### CloudWatch Dashboards

**Access:** AWS Console → CloudWatch → Dashboards → `[project-name]-[env]`

**Key Metrics:**
- API response times (p50, p95, p99)
- Error rates (4xx, 5xx)
- Lambda invocations and duration
- Database connections and queries
- Queue depth
- Cost trends

### Alarms (31 per environment)

| Alarm | Threshold | Action | Severity |
|-------|-----------|--------|----------|
| API Error Rate | >1% | SNS alert | High |
| Lambda Duration | >5000ms | SNS alert | Medium |
| Lambda Throttles | >10 | SNS alert | High |
| DB Connections | >80% max | SNS alert | High |
| Concurrent Executions | >80% limit | SNS alert | Medium |
| DLQ Messages | >0 | SNS alert | High |
| Budget Alert | >$[budget] | Email | Medium |

### Log Access

```bash
# API Gateway logs
aws logs tail /aws/apigateway/[project-name] --follow

# Lambda function logs
aws logs tail /aws/lambda/[function-name] --follow

# Application logs with filter
aws logs filter-log-events \
  --log-group-name /aws/lambda/[function-name] \
  --filter-pattern "ERROR"

# Database slow queries
# Access via RDS console → Logs → slow_query
```

### Metrics Queries

```bash
# Lambda error count (last hour)
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=[function-name] \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum

# API Gateway request count
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=[api-name] \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

---

## Common Operations

### Starting/Stopping Services

**Lambda Functions:**
```bash
# Disable function (prevent invocations)
aws lambda put-function-concurrency \
  --function-name [function-name] \
  --reserved-concurrent-executions 0

# Re-enable function
aws lambda delete-function-concurrency \
  --function-name [function-name]
```

**Database:**
```bash
# Stop RDS instance (dev/staging only)
aws rds stop-db-instance --db-instance-identifier [db-name]

# Start RDS instance
aws rds start-db-instance --db-instance-identifier [db-name]
```

### Scaling

**Lambda Concurrency:**
```bash
# Set reserved concurrency
aws lambda put-function-concurrency \
  --function-name [function-name] \
  --reserved-concurrent-executions 100

# Set provisioned concurrency (for prod)
aws lambda put-provisioned-concurrency-config \
  --function-name [function-name] \
  --provisioned-concurrent-executions 10 \
  --qualifier [version-or-alias]
```

**Database:**
```bash
# Modify RDS instance class
aws rds modify-db-instance \
  --db-instance-identifier [db-name] \
  --db-instance-class db.t3.medium \
  --apply-immediately
```

### Database Operations

**Connect to Database:**
```bash
# Requires VPN connection
psql -h [rds-endpoint] -U [username] -d [database-name]

# Via RDS Proxy (recommended for Lambda)
psql -h [rds-proxy-endpoint] -U [username] -d [database-name]
```

**Common Queries:**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, query_start 
FROM pg_stat_activity 
WHERE state = 'active' 
AND query_start < now() - interval '5 minutes';

-- Kill long-running query
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE pid = [pid];
```

**Backup & Restore:**
```bash
# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier [db-name] \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier [new-db-name] \
  --db-snapshot-identifier [snapshot-id]
```

### Secrets Rotation

**Location:** `.secrets/[env]_*`

```bash
# Generate new database password
./infrastructure/deploy.sh [env]  # Will prompt to regenerate

# Update in AWS Secrets Manager
aws secretsmanager update-secret \
  --secret-id [secret-name] \
  --secret-string file://.secrets/[env]_db_password.txt

# Restart Lambda functions to pick up new secret
aws lambda update-function-configuration \
  --function-name [function-name] \
  --environment Variables={FORCE_RELOAD=true}
```

---

## Troubleshooting

### Issue: High API Latency

**Symptoms:**
- API response times >2 seconds
- CloudWatch alarm: Lambda duration exceeded

**Diagnosis:**
```bash
# Check Lambda duration metrics
aws cloudwatch get-metric-statistics --namespace AWS/Lambda \
  --metric-name Duration --dimensions Name=FunctionName,Value=[name] \
  --start-time [time] --end-time [time] --period 60 --statistics Average,Maximum

# Check database connections
psql -h [endpoint] -c "SELECT count(*) FROM pg_stat_activity;"

# Check RDS Proxy connections
aws rds describe-db-proxies --db-proxy-name [proxy-name]
```

**Solutions:**
1. Check if cold start (first invocation) - consider provisioned concurrency
2. Check database query performance - review slow query log
3. Check RDS Proxy connection pooling - may need to increase max connections
4. Check if Lambda needs more memory - increase from 512MB to 1024MB

### Issue: Lambda Throttling

**Symptoms:**
- CloudWatch alarm: Throttles >10
- Intermittent 5xx errors from API Gateway

**Diagnosis:**
```bash
# Check concurrent executions
aws lambda get-function-concurrency --function-name [name]

# Check account-level limits
aws servicequotas get-service-quota \
  --service-code lambda \
  --quota-code L-B99A9384  # Concurrent executions
```

**Solutions:**
1. Increase reserved concurrency for function
2. Request AWS quota increase
3. Implement retry logic with exponential backoff
4. Check if burst capacity is sufficient

### Issue: Database Connection Exhaustion

**Symptoms:**
- Error: "remaining connection slots are reserved"
- Lambda functions timing out

**Diagnosis:**
```sql
-- Check current connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Check max connections
SHOW max_connections;

-- Find connection sources
SELECT client_addr, count(*) FROM pg_stat_activity GROUP BY client_addr;
```

**Solutions:**
1. Ensure Lambda uses RDS Proxy (not direct RDS connection)
2. Implement connection pooling in application code
3. Reduce Lambda concurrency temporarily
4. Increase RDS max_connections parameter

### Issue: Dead Letter Queue Messages

**Symptoms:**
- CloudWatch alarm: DLQ depth >0
- Failed async Lambda invocations

**Diagnosis:**
```bash
# Check DLQ messages
aws sqs receive-message --queue-url [dlq-url] --max-number-of-messages 10

# Get message details
aws sqs get-queue-attributes --queue-url [dlq-url] \
  --attribute-names ApproximateNumberOfMessages
```

**Solutions:**
1. Review error messages in DLQ
2. Fix root cause in Lambda function
3. Manually replay messages after fix
4. Set up DLQ monitoring and alerting

---

## Incident Response

### Severity Levels

| Level | Definition | Response Time | Notification |
|-------|-----------|---------------|--------------|
| **P1** | Complete outage | Immediate | Page on-call |
| **P2** | Degraded service | 15 minutes | Alert team |
| **P3** | Minor issue | 1 hour | Slack notification |
| **P4** | Cosmetic | Next business day | Email |

### Response Procedure

1. **Acknowledge:** Confirm receipt of alert
2. **Assess:** Determine severity and impact
3. **Communicate:** Notify stakeholders
4. **Mitigate:** Apply temporary fix
5. **Resolve:** Implement permanent fix
6. **Document:** Post-mortem (for P1/P2)

### Emergency Contacts

| Role | Name | Contact | Backup |
|------|------|---------|--------|
| On-call Engineer | [Name] | [Phone/Slack] | [Backup] |
| Team Lead | [Name] | [Phone/Slack] | [Backup] |
| Product Owner | [Name] | [Phone/Email] | [Backup] |

---

## Maintenance

### Regular Maintenance Tasks

| Task | Frequency | Owner | Procedure |
|------|-----------|-------|-----------|
| Review CloudWatch alarms | Daily | On-call | Check dashboard |
| Check cost trends | Weekly | DevOps | Review Cost Explorer |
| Rotate secrets | Monthly | Security | Use secrets rotation script |
| Update dependencies | Monthly | DevOps | Update requirements.txt, redeploy |
| Review slow queries | Weekly | DBA | Check RDS slow query log |
| Clean up old logs | Monthly | DevOps | CloudWatch log retention policy |

### Scheduled Downtime

**For non-critical maintenance:**
1. Announce 48 hours in advance
2. Use staging environment for testing
3. Schedule during low-traffic window (2-4 AM local)
4. Have rollback plan ready

---

## Contact Information

**Team Slack Channel:** #[project-name]-ops  
**PagerDuty:** [pagerduty-url]  
**Runbook Repository:** [gitlab-url]  
**Monitoring Dashboard:** [cloudwatch-dashboard-url]  
**AWS Console:** [aws-console-url]

---

**Document Owner:** @devops-engineer  
**Review Frequency:** Monthly  
**Last Reviewed:** [Date]
