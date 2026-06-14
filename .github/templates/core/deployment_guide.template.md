# Deployment Guide

**Project:** [Project Name]  
**Project ID:** [project_id]  
**Date:** [YYYY-MM-DD]  
**Version:** 1.0  
**DevOps Engineer:** [Name]  
**Status:** Draft | Approved | Active

---

## Executive Summary

[Brief overview of deployment strategy, environments, and key procedures]

---

## 1. Deployment Overview

### 1.1 Deployment Strategy
- **Approach:** [Blue-Green / Canary / Rolling / Recreate]
- **Deployment Tool:** [GitLab CI/CD, GitHub Actions, Jenkins, ArgoCD]
- **Infrastructure:** [Cloud Provider: AWS / GCP / Azure]
- **Containerization:** Docker (Default deployment approach)
- **Orchestration:** [Kubernetes / ECS / GKE / Cloud Run]

### 1.2 Environments

| Environment | Purpose | URL | Auto-Deploy | Approval Required |
|-------------|---------|-----|-------------|-------------------|
| **Development** | Developer testing | [URL] | Yes (on merge to develop) | No |
| **QA/Testing** | QA testing | [URL] | Yes (on merge to develop) | No |
| **Staging** | Pre-production testing | [URL] | Manual trigger | Yes (1 approval) |
| **Production** | Live system | [URL] | Manual trigger | Yes (2+ approvals) |

### 1.3 Branch Strategy

```
baseline (stable reference)
    ↓
develop (development work)
    ↓
main (production-ready)
```

**Branch Rules:**
- **baseline:** Protected, no direct commits, only updated from main after successful releases
- **develop:** Auto-deploys to Dev/QA, requires PR with 1 approval
- **main:** Auto-deploys to Production (with manual approval), requires PR with 2+ approvals

---

## 2. Pre-Deployment Checklist

### 2.1 Code Readiness
- [ ] All code merged to target branch
- [ ] Code review completed and approved
- [ ] No merge conflicts
- [ ] Branch is up to date with latest changes

### 2.2 Testing Verification
- [ ] Unit tests passed (coverage: [85%/90%/95%] for [POC/Prototype/MVP/Handover])
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Security scans completed (SAST, DAST, dependency scan, secrets detection)
- [ ] Performance tests passed (if applicable)
- [ ] Accessibility tests passed (WCAG 2.1, if applicable)
- [ ] Cross-platform testing completed:
  - [ ] Windows (10, 11)
  - [ ] macOS (Ventura, Sonoma)
  - [ ] Linux (Ubuntu 22.04, RHEL 9, Debian 12)
  - [ ] Docker containers

### 2.3 Documentation
- [ ] Deployment runbook updated
- [ ] API documentation updated
- [ ] Configuration changes documented
- [ ] Release notes prepared
- [ ] Rollback procedures documented

### 2.4 Infrastructure
- [ ] Target environment available and healthy
- [ ] Database migrations prepared (if applicable)
- [ ] Secrets and configs updated in environment
- [ ] Monitoring and alerting configured
- [ ] Backup completed (for production deployments)

### 2.5 Approvals
- [ ] Product Manager approval
- [ ] Technical Architect approval
- [ ] Security Engineer approval (for production)
- [ ] Stakeholder sign-off (for production)

### 2.6 Communication
- [ ] Deployment scheduled and communicated to team
- [ ] Stakeholders notified
- [ ] Maintenance window announced (if downtime expected)
- [ ] On-call team alerted

---

## 3. Infrastructure Setup

### 3.1 Cloud Provider Selection

**Deployment-Time Choice:**
- [ ] AWS
- [ ] GCP

**Region Configuration:**
- **Primary Region:** [e.g., us-east-1 / us-central1]
- **DR Region:** [e.g., us-west-2 / us-west1] (if applicable)

### 3.2 Authentication Setup

#### AWS Authentication
Choose one method:
- [ ] **IAM Roles** (recommended for EC2/ECS/Lambda)
  - Role ARN: [arn:aws:iam::account-id:role/role-name]
- [ ] **IAM Access Keys**
  - Access Key ID: [Stored in secrets manager]
  - Secret Access Key: [Stored in secrets manager]
- [ ] **AWS CLI Profile**
  - Profile Name: [profile-name]
- [ ] **Environment Variables**
  ```bash
  AWS_ACCESS_KEY_ID=<value>
  AWS_SECRET_ACCESS_KEY=<value>
  AWS_DEFAULT_REGION=<value>
  ```

#### GCP Authentication
Choose one method:
- [ ] **Service Account** (recommended)
  - Service Account: [service-account@project-id.iam.gserviceaccount.com]
  - JSON Key: [Stored in secrets manager]
- [ ] **gcloud CLI Profile**
  - Profile: [profile-name]
- [ ] **Application Default Credentials**
  - Configured via: `gcloud auth application-default login`
- [ ] **Environment Variables**
  ```bash
  GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
  GOOGLE_CLOUD_PROJECT=project-id
  ```

### 3.3 Docker Configuration

**Base Image:**
```dockerfile
# For Python
FROM python:3.11-slim

# For Node.js
FROM node:20-alpine

# For Java
FROM eclipse-temurin:17-jre-alpine

# For other languages, choose appropriate base image
```

**Multi-Stage Build Example:**
```dockerfile
# Build stage
FROM [language-specific-builder] AS builder
WORKDIR /app
COPY . .
RUN [build commands]

# Runtime stage
FROM [language-specific-runtime]
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["[start command]"]
```

### 3.4 Container Orchestration

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: [app-name]
  namespace: [namespace]
spec:
  replicas: [number]
  selector:
    matchLabels:
      app: [app-name]
  template:
    metadata:
      labels:
        app: [app-name]
    spec:
      containers:
      - name: [container-name]
        image: [registry]/[image]:[tag]
        ports:
        - containerPort: [port]
        env:
        - name: [ENV_VAR]
          valueFrom:
            secretKeyRef:
              name: [secret-name]
              key: [key]
        resources:
          requests:
            memory: "[X]Mi"
            cpu: "[Y]m"
          limits:
            memory: "[X]Mi"
            cpu: "[Y]m"
        livenessProbe:
          httpGet:
            path: /health
            port: [port]
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: [port]
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### AWS ECS Task Definition
```json
{
  "family": "[task-family]",
  "taskRoleArn": "[role-arn]",
  "executionRoleArn": "[execution-role-arn]",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "[container-name]",
      "image": "[registry]/[image]:[tag]",
      "memory": [memory],
      "cpu": [cpu],
      "essential": true,
      "portMappings": [
        {
          "containerPort": [port],
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "[ENV_VAR]",
          "value": "[value]"
        }
      ],
      "secrets": [
        {
          "name": "[ENV_VAR]",
          "valueFrom": "[secrets-manager-arn]"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/[task-family]",
          "awslogs-region": "[region]",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:[port]/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "[cpu-units]",
  "memory": "[memory-mb]"
}
```

---

## 4. Configuration Management

### 4.1 Configuration Hierarchy
```
Default configs (in code)
    ↓
Environment-specific configs (config/dev.yaml, config/staging.yaml, config/prod.yaml)
    ↓
Secrets (AWS Secrets Manager, GCP Secret Manager, separate gitignored files)
    ↓
Runtime environment variables (set by deployment platform)
```

### 4.2 Configuration Files

**Example: config/production.yaml**
```yaml
app:
  name: [app-name]
  port: [port]
  environment: production
  log_level: INFO

database:
  host: ${DB_HOST}  # Pulled from secrets
  port: ${DB_PORT}
  database: ${DB_NAME}
  # Credentials stored in separate secrets file

redis:
  host: ${REDIS_HOST}
  port: ${REDIS_PORT}
  
api:
  base_url: https://api.example.com
  timeout: 30
  retry_attempts: 3

cloud:
  provider: aws  # or gcp
  region: us-east-1
  
monitoring:
  enabled: true
  metrics_port: 9090
```

### 4.3 Secrets Management

**AWS Secrets Manager:**
```bash
# Store secret
aws secretsmanager create-secret \
  --name /[app-name]/[env]/database \
  --secret-string '{"username":"user","password":"pass"}'

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id /[app-name]/[env]/database
```

**GCP Secret Manager:**
```bash
# Store secret
echo -n "password" | gcloud secrets create database-password --data-file=-

# Retrieve secret
gcloud secrets versions access latest --secret="database-password"
```

**Environment Variables (for CI/CD):**
```bash
# GitLab CI/CD Variables
# Set in Settings > CI/CD > Variables
DB_HOST=<value>
DB_PASSWORD=<masked-value>

# GitHub Actions Secrets
# Set in Settings > Secrets and variables > Actions
```

---

## 5. CI/CD Pipeline

### 5.1 GitLab CI/CD (.gitlab-ci.yml)

```yaml
stages:
  - build
  - test
  - security
  - deploy-dev
  - deploy-staging
  - deploy-production

variables:
  DOCKER_REGISTRY: [registry-url]
  IMAGE_NAME: $DOCKER_REGISTRY/$CI_PROJECT_NAME
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA

before_script:
  - echo "Starting pipeline for $CI_COMMIT_REF_NAME"

# Build Stage
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $IMAGE_NAME:$IMAGE_TAG .
    - docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
    - docker push $IMAGE_NAME:$IMAGE_TAG
    - docker push $IMAGE_NAME:latest
  only:
    - develop
    - main

# Test Stage
unit-tests:
  stage: test
  image: [language-specific-image]
  script:
    - [install dependencies]
    - [run unit tests]
    - [generate coverage report]
  coverage: '/TOTAL.*\s+(\d+%)$/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
  only:
    - develop
    - main

integration-tests:
  stage: test
  image: [language-specific-image]
  script:
    - [run integration tests]
  only:
    - develop
    - main

# Security Stage
sast:
  stage: security
  image: [security-scanner-image]
  script:
    - [run static analysis]
  allow_failure: false
  only:
    - develop
    - main

dependency-scan:
  stage: security
  image: [dependency-scanner-image]
  script:
    - [scan dependencies for vulnerabilities]
  allow_failure: false
  only:
    - develop
    - main

secrets-detection:
  stage: security
  image: [secrets-scanner-image]
  script:
    - [scan for exposed secrets]
  allow_failure: false
  only:
    - develop
    - main

# Deploy to Development (automatic)
deploy-dev:
  stage: deploy-dev
  image: [deployment-image]
  script:
    - [authenticate to cloud provider]
    - [deploy to dev environment]
    - [run smoke tests]
  environment:
    name: development
    url: [dev-url]
  only:
    - develop

# Deploy to Staging (manual)
deploy-staging:
  stage: deploy-staging
  image: [deployment-image]
  script:
    - [authenticate to cloud provider]
    - [deploy to staging environment]
    - [run smoke tests]
  environment:
    name: staging
    url: [staging-url]
  when: manual
  only:
    - main

# Deploy to Production (manual with approvals)
deploy-production:
  stage: deploy-production
  image: [deployment-image]
  script:
    - [authenticate to cloud provider]
    - [deploy to production environment]
    - [run smoke tests]
  environment:
    name: production
    url: [production-url]
  when: manual
  only:
    - main
```

### 5.2 GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches:
      - develop
      - main
  pull_request:
    branches:
      - develop
      - main

env:
  DOCKER_REGISTRY: [registry-url]
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Docker Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Unit Tests
        run: |
          [install dependencies]
          [run unit tests]
      
      - name: Run Integration Tests
        run: |
          [run integration tests]
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  security:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      
      - name: SAST Scan
        run: [run static analysis]
      
      - name: Dependency Scan
        run: [scan dependencies]
      
      - name: Secrets Detection
        run: [scan for secrets]

  deploy-dev:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: development
      url: [dev-url]
    steps:
      - name: Deploy to Development
        run: |
          [authenticate to cloud provider]
          [deploy to dev]
          [run smoke tests]

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: [staging-url]
    steps:
      - name: Deploy to Staging
        run: |
          [authenticate to cloud provider]
          [deploy to staging]
          [run smoke tests]

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: [production-url]
    steps:
      - name: Deploy to Production
        run: |
          [authenticate to cloud provider]
          [deploy to production]
          [run smoke tests]
```

---

## 6. Deployment Procedures

### 6.1 Development Deployment

**Trigger:** Automatic on merge to `develop` branch

**Steps:**
1. Code merged to `develop`
2. CI/CD pipeline triggered
3. Build and tests run
4. Security scans executed
5. Auto-deploy to Dev environment
6. Smoke tests executed
7. Notification sent to team

**Rollback:** Manual trigger of previous successful deployment

### 6.2 Staging Deployment

**Trigger:** Manual approval after merge to `main`

**Steps:**
1. Code merged to `main` (requires 2+ approvals)
2. Manual trigger initiated by DevOps Engineer or Project Manager
3. Build and comprehensive tests run
4. Security scans executed
5. Deploy to Staging environment
6. E2E tests and performance tests executed
7. QA team notified for UAT

**Rollback:** Manual trigger of previous successful deployment

### 6.3 Production Deployment

**Trigger:** Manual approval (requires multiple approvals)

**Pre-Deployment:**
1. Staging deployment successful and verified
2. All exit criteria met (PRE_DEPLOYMENT_CHECKLIST.md completed)
3. Product Manager approval
4. Technical Architect approval
5. Security Engineer approval
6. Stakeholder sign-off

**Deployment Steps:**
1. **Pre-Deployment (T-30 minutes)**
   - Announce deployment window
   - Complete final backup
   - Verify rollback plan ready
   - Enable enhanced monitoring

2. **Deployment (T-0)**
   - Execute deployment strategy (Blue-Green/Canary/Rolling)
   - Monitor metrics in real-time
   - Execute smoke tests

3. **Post-Deployment (T+30 minutes)**
   - Verify all health checks passing
   - Verify monitoring and alerting
   - Verify business metrics
   - Send deployment completion notification
   - Document deployment in DEPLOYMENT_OUTPUTS.md

**Deployment Strategy Example (Blue-Green):**
```
1. Deploy new version to "Green" environment
2. Run health checks and smoke tests on Green
3. Route 10% of traffic to Green (canary)
4. Monitor for 10 minutes
5. If successful, route 50% traffic to Green
6. Monitor for 10 minutes
7. If successful, route 100% traffic to Green
8. Keep Blue environment running for 1 hour (quick rollback)
9. Decommission Blue environment
```

**Rollback Trigger Conditions:**
- Error rate > 1%
- Response time > 2x baseline
- Critical functionality broken
- Database migration failure
- Security vulnerability detected

**Rollback Procedure:**
1. Trigger rollback within [X] minutes of detection
2. Route traffic back to previous (Blue) environment
3. Notify team and stakeholders
4. Document rollback reason
5. Schedule post-mortem

---

## 7. Database Migrations

### 7.1 Migration Strategy

**Approach:** Forward-only migrations with rollback scripts

**Tools:**
- [ ] Flyway
- [ ] Liquibase
- [ ] Alembic (Python)
- [ ] Knex (Node.js)
- [ ] Entity Framework (C#)

### 7.2 Migration Process

**Pre-Migration:**
1. [ ] Database backup completed
2. [ ] Migration scripts tested in lower environments
3. [ ] Rollback scripts prepared
4. [ ] Downtime window communicated (if required)

**Migration Execution:**
```bash
# Example with Flyway
flyway -url=jdbc:postgresql://[host]:[port]/[db] \
  -user=[user] \
  -password=[password] \
  -locations=filesystem:./migrations \
  migrate

# Verify migration
flyway -url=jdbc:postgresql://[host]:[port]/[db] info
```

**Post-Migration:**
1. [ ] Verify schema changes
2. [ ] Run data validation queries
3. [ ] Test application functionality
4. [ ] Monitor database performance

**Rollback (if needed):**
```bash
# Restore from backup
pg_restore -h [host] -U [user] -d [database] [backup-file]

# Or execute rollback migration
flyway -url=jdbc:postgresql://[host]:[port]/[db] undo
```

---

## 8. Monitoring & Health Checks

### 8.1 Health Check Endpoints

**Liveness Probe:** `/health`
- Returns 200 if application is running
- Used to restart unhealthy containers

**Readiness Probe:** `/ready`
- Returns 200 if application is ready to serve traffic
- Checks: database connectivity, cache availability, external API reachability

**Metrics Endpoint:** `/metrics`
- Exposes Prometheus-compatible metrics
- CPU, memory, request rate, error rate, latency

### 8.2 Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Metrics | Prometheus, CloudWatch, Datadog | Collect and store metrics |
| Dashboards | Grafana, CloudWatch Dashboards | Visualize metrics |
| Logs | CloudWatch Logs, ELK Stack, Splunk | Centralized logging |
| Tracing | X-Ray, Jaeger, OpenTelemetry | Distributed tracing |
| Alerting | PagerDuty, Slack, Email | Alert on issues |

### 8.3 Key Metrics to Monitor

**Application Metrics:**
- Request rate (requests/second)
- Error rate (%)
- Response time (p50, p95, p99)
- Throughput

**Infrastructure Metrics:**
- CPU utilization (%)
- Memory utilization (%)
- Disk usage (%)
- Network I/O

**Business Metrics:**
- [Custom metrics relevant to application]

### 8.4 Alerting Thresholds

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|--------------|
| High Error Rate | Error rate > 1% for 5 min | Critical | PagerDuty, Slack |
| High Latency | p95 > 1s for 5 min | High | Slack, Email |
| Low Availability | Uptime < 99.9% | Critical | PagerDuty, Slack |
| High CPU | CPU > 80% for 10 min | Medium | Slack |
| High Memory | Memory > 85% for 10 min | Medium | Slack |
| Disk Space Low | Disk > 80% full | High | Slack, Email |

---

## 9. Rollback Procedures

### 9.1 Automated Rollback

**Trigger Conditions:**
- Health checks failing for > 5 minutes
- Error rate > 5%
- Critical functionality broken

**Automated Steps:**
1. Detect failure condition
2. Trigger rollback automation
3. Route traffic to previous version
4. Notify team
5. Log rollback event

### 9.2 Manual Rollback

**When to Use:**
- Automated rollback doesn't trigger but issue is identified
- Gradual degradation detected
- Business decision to rollback

**Steps:**
```bash
# GitLab CI/CD
# Manually trigger previous successful pipeline

# Kubernetes
kubectl rollout undo deployment/[deployment-name] -n [namespace]

# AWS ECS
aws ecs update-service \
  --cluster [cluster-name] \
  --service [service-name] \
  --task-definition [previous-task-definition]

# Verify rollback
kubectl rollout status deployment/[deployment-name] -n [namespace]
# or
aws ecs describe-services --cluster [cluster-name] --services [service-name]
```

### 9.3 Database Rollback

**Option 1: Restore from backup**
```bash
# PostgreSQL
pg_restore -h [host] -U [user] -d [database] [backup-file]

# MySQL
mysql -h [host] -u [user] -p [database] < [backup-file]
```

**Option 2: Execute rollback migration**
```bash
# Example with Flyway
flyway undo
```

### 9.4 Post-Rollback

1. [ ] Verify system is stable
2. [ ] Notify stakeholders
3. [ ] Document rollback reason
4. [ ] Schedule post-mortem
5. [ ] Create action items to prevent recurrence

---

## 10. Post-Deployment Verification

### 10.1 Smoke Tests

**Automated Smoke Tests:**
- [ ] Application starts successfully
- [ ] Health endpoints return 200
- [ ] Database connectivity verified
- [ ] Cache connectivity verified
- [ ] Core API endpoints respond correctly
- [ ] Authentication works
- [ ] Critical user flows functional

**Manual Verification:**
- [ ] UI loads correctly
- [ ] Key features tested
- [ ] No JavaScript errors in console
- [ ] No visual regressions

### 10.2 Monitoring

**First 30 Minutes:**
- Monitor error rate every 5 minutes
- Monitor response times every 5 minutes
- Check logs for anomalies
- Verify auto-scaling working (if applicable)

**First 24 Hours:**
- Review all alerts
- Check performance metrics
- Review error logs
- Verify business metrics

**First Week:**
- Weekly review of metrics
- User feedback collection
- Performance analysis
- Cost analysis

---

## 11. Troubleshooting

### 11.1 Common Issues

| Issue | Symptoms | Diagnosis | Resolution |
|-------|----------|-----------|------------|
| Container fails to start | Pod/task stuck in CrashLoopBackOff | Check logs: `kubectl logs [pod]` | Fix config, redeploy |
| High error rate | 5xx responses in monitoring | Check application logs, database | Rollback or hotfix |
| Slow response times | High latency in monitoring | Check database queries, external APIs | Optimize queries, scale up |
| Database migration failure | Migration errors in logs | Review migration scripts | Rollback migration, fix script |
| Secret not found | Application can't read secrets | Verify secrets exist in manager | Create/update secrets |

### 11.2 Debug Commands

**Kubernetes:**
```bash
# Check pod status
kubectl get pods -n [namespace]

# View pod logs
kubectl logs [pod-name] -n [namespace]

# Describe pod (events, status)
kubectl describe pod [pod-name] -n [namespace]

# Execute command in pod
kubectl exec -it [pod-name] -n [namespace] -- /bin/bash

# Check service
kubectl get svc -n [namespace]

# Check ingress
kubectl get ingress -n [namespace]
```

**AWS ECS:**
```bash
# List tasks
aws ecs list-tasks --cluster [cluster-name] --service-name [service-name]

# Describe task
aws ecs describe-tasks --cluster [cluster-name] --tasks [task-arn]

# View logs (CloudWatch)
aws logs tail /ecs/[task-family] --follow
```

**Docker:**
```bash
# List containers
docker ps -a

# View logs
docker logs [container-id]

# Execute command in container
docker exec -it [container-id] /bin/bash

# Inspect container
docker inspect [container-id]
```

---

## 12. Disaster Recovery

### 12.1 Backup Strategy

**Database Backups:**
- **Frequency:** Daily automated backups, hourly point-in-time recovery
- **Retention:** 30 days
- **Location:** [S3 bucket / Cloud Storage bucket] with cross-region replication

**Configuration Backups:**
- All configs stored in Git
- Secrets backed up to secondary secrets manager

**Application State:**
- Stateless design (no local state)
- Session data in Redis (replicated)

### 12.2 Recovery Procedures

**RTO (Recovery Time Objective):** [e.g., 1 hour]  
**RPO (Recovery Point Objective):** [e.g., 15 minutes]

**Disaster Scenarios:**

#### Scenario 1: Complete Region Failure
1. Activate DR region
2. Update DNS to point to DR region
3. Restore database from latest backup
4. Deploy application to DR region
5. Verify functionality
6. Communicate status to stakeholders

#### Scenario 2: Database Corruption
1. Stop application writes
2. Restore from latest clean backup
3. Replay transactions from point-in-time recovery
4. Verify data integrity
5. Resume application

#### Scenario 3: Complete Application Failure
1. Trigger automated rollback
2. If rollback fails, restore from baseline
3. Verify recovery
4. Investigate root cause

---

## 13. Security

### 13.1 Deployment Security Checklist

- [ ] All secrets stored in secrets manager (never in code/configs)
- [ ] TLS/SSL enabled for all external endpoints
- [ ] Network security groups/firewall rules configured
- [ ] IAM roles/service accounts follow least privilege
- [ ] Container images scanned for vulnerabilities
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Audit logging enabled
- [ ] Encryption at rest enabled for databases and storage
- [ ] Secrets rotation configured

### 13.2 Compliance

- [ ] GDPR compliance verified (if applicable)
- [ ] HIPAA compliance verified (if applicable)
- [ ] SOC 2 controls implemented (if applicable)
- [ ] PCI DSS requirements met (if applicable)

---

## 14. Documentation Updates

After deployment, update:
- [ ] [DEPLOYMENT_OUTPUTS.md](DEPLOYMENT_OUTPUTS.md) - Record deployment details
- [ ] [PHASE_STATUS.md](phase_status.template.md) - Update phase progress
- [ ] [README.md](README.md) - Update version, changelog
- [ ] API documentation - Swagger/OpenAPI specs
- [ ] Architecture diagrams - If infrastructure changed

---

## 15. Communication

### 15.1 Deployment Notifications

**Before Deployment:**
```
Subject: [DEPLOYMENT NOTICE] [Environment] - [YYYY-MM-DD HH:MM]

Deployment Schedule:
- Environment: [Dev/Staging/Production]
- Date/Time: [YYYY-MM-DD HH:MM TZ]
- Duration: [Expected duration]
- Downtime: [Yes/No - if yes, duration]

Changes:
- [Change 1]
- [Change 2]

Rollback Plan: [Brief description]

Questions? Contact: [DevOps Engineer name and contact]
```

**After Deployment:**
```
Subject: [DEPLOYMENT COMPLETE] [Environment] - [Status]

Deployment Status: [Success/Failed/Rolled Back]

Deployed Version: [v1.2.3]
Deployment Time: [YYYY-MM-DD HH:MM TZ]
Duration: [Actual duration]

Post-Deployment Verification:
✓ Smoke tests passed
✓ Health checks passing
✓ Monitoring active
✓ No errors in logs

Known Issues: [None/List issues]

Next Steps: [Monitoring plan, UAT schedule, etc.]
```

---

## 16. Approval & Sign-off

| Role | Name | Approval | Date | Comments |
|------|------|----------|------|----------|
| DevOps Engineer | [Name] | ✓/👁/x | [Date] | [Comments] |
| Product Manager | [Name] | ✓/👁/x | [Date] | [Comments] |
| Technical Architect | [Name] | ✓/👁/x | [Date] | [Comments] |
| Security Engineer | [Name] | ✓/👁/x | [Date] | [Comments] |

---

## 17. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial deployment guide |
| 1.1 | [Date] | [Name] | [Changes] |

---

## Appendices

### Appendix A: Environment Variables Reference
[Complete list of environment variables for each environment]

### Appendix B: Network Diagram
[Infrastructure and network architecture]

### Appendix C: Runbook
[Step-by-step operational procedures]

### Appendix D: Contact List
[On-call rotation, escalation contacts]
