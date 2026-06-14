# Runbook

## Runbook Information
- **Service/System:** [Service name]
- **Owner:** [Team name]
- **Last Updated:** [Date]
- **Version:** [Version number]
- **On-Call:** [On-call schedule link or rotation]

---

## Table of Contents

1. [Service Overview](#service-overview)
2. [Architecture](#architecture)
3. [Common Operations](#common-operations)
4. [Troubleshooting](#troubleshooting)
5. [Alerts and Monitoring](#alerts-and-monitoring)
6. [Incident Response](#incident-response)
7. [Maintenance Procedures](#maintenance-procedures)
8. [Runbook Health](#runbook-health)

---

## Service Overview

### What This Service Does

**Purpose:**
[What does this service do? What problem does it solve?]

**Example:**
"The Notification Service sends real-time notifications to users via email, SMS, and in-app push. It processes ~500K notifications per day and is critical for user engagement (onboarding emails, campaign alerts, system notifications)."

---

### Key Responsibilities

**This service is responsible for:**
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

**Example:**
- Receiving notification requests from other services via REST API
- Routing notifications to appropriate channels (email, SMS, push)
- Managing delivery retries and failure handling
- Tracking delivery status and analytics

---

### Service Level Objectives (SLOs)

**Our commitments:**

| Metric | Target | Measurement | Consequence if Missed |
|--------|--------|-------------|----------------------|
| [SLO 1] | [Target] | [How measured] | [Impact] |

**Example:**
| Metric | Target | Measurement | Consequence if Missed |
|--------|--------|-------------|----------------------|
| Availability | 99.9% | Uptime monitoring | Users don't receive notifications, poor experience |
| Latency (p95) | < 5 seconds | Time from request to delivery | Delayed notifications, user confusion |
| Delivery rate | 99% | Successful deliveries / attempts | Users miss important updates |
| Error rate | < 1% | Errors / total requests | User-facing errors, poor experience |

**Current SLO status:** [Link to dashboard]

---

### Critical Dependencies

**This service depends on:**

| Dependency | Purpose | Criticality | Contact | Fallback |
|------------|---------|-------------|---------|----------|
| [Service/System] | [What we use it for] | High/Med/Low | [Contact] | [What happens if down] |

**Example:**
| Dependency | Purpose | Criticality | Contact | Fallback |
|------------|---------|-------------|---------|----------|
| SendGrid API | Email delivery | High | support@sendgrid.com | Queue emails, retry later |
| Twilio API | SMS delivery | High | support@twilio.com | Queue SMS, retry later |
| PostgreSQL DB | Store notification queue | Critical | #database-team | None - service down if DB down |
| Redis Cache | Rate limiting, deduplication | Medium | #platform-team | Degrade gracefully, slower |
| User Service | User preferences, contact info | High | #user-team | Use cached data if available |

**Services depending on us:**
- [Service 1] - [What they use us for]
- [Service 2] - [What they use us for]

**Example:**
- User Onboarding Service - Welcome email sequence
- Campaign Service - Marketing emails and push notifications
- Billing Service - Payment reminders, invoice emails
- Security Service - 2FA codes, security alerts

---

## Architecture

### System Architecture

**High-level diagram:**

```
┌─────────────┐         ┌──────────────────┐
│  API Gateway│────────▶│ Notification API  │
└─────────────┘         │  (Load Balanced)  │
                        └──────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐   ┌──────────┐  ┌──────────┐
              │  Queue   │   │  Queue   │  │  Queue   │
              │  Email   │   │   SMS    │  │   Push   │
              └────┬─────┘   └────┬─────┘  └────┬─────┘
                   │              │              │
                   ▼              ▼              ▼
              ┌──────────┐   ┌──────────┐  ┌──────────┐
              │  Worker  │   │  Worker  │  │  Worker  │
              │  Email   │   │   SMS    │  │   Push   │
              └────┬─────┘   └────┬─────┘  └────┬─────┘
                   │              │              │
                   ▼              ▼              ▼
              ┌──────────┐   ┌──────────┐  ┌──────────┐
              │ SendGrid │   │  Twilio  │  │   FCM    │
              └──────────┘   └──────────┘  └──────────┘
```

---

### Infrastructure

**Hosting:**
- Platform: [AWS / GCP / Azure / On-prem]
- Region: [Primary region]
- Availability Zones: [How many AZs]

**Example:**
- Platform: AWS
- Region: us-east-1 (primary), us-west-2 (failover)
- Availability Zones: 3 (us-east-1a, 1b, 1c)

**Instances:**

| Component | Instance Type | Count | Auto-scaling |
|-----------|--------------|-------|-------------|
| [Component] | [Type] | [Count] | [Yes/No] |

**Example:**
| Component | Instance Type | Count | Auto-scaling |
|-----------|--------------|-------|-------------|
| API servers | c5.large | 3-10 | Yes (CPU > 70%) |
| Email workers | t3.medium | 5-20 | Yes (queue depth) |
| SMS workers | t3.medium | 2-5 | Yes (queue depth) |
| Database | db.r5.xlarge | 1 primary + 2 replicas | No |
| Redis | cache.r5.large | 1 primary + 1 replica | No |

**Network:**
- Load Balancer: [Type and config]
- VPC: [VPC ID]
- Security Groups: [Key security groups]

---

### Data Storage

**Databases:**

| Database | Purpose | Type | Size | Backup |
|----------|---------|------|------|--------|
| [DB name] | [What data] | [Postgres/MySQL/etc] | [Size] | [Frequency] |

**Example:**
| Database | Purpose | Type | Size | Backup |
|----------|---------|------|------|--------|
| notifications_db | Notification queue, history | PostgreSQL 15 | 500 GB | Daily at 2 AM |
| redis_cache | Rate limiting, dedup | Redis 7 | 10 GB | None (ephemeral) |

**Data retention:**
- Notification queue: 7 days (then archived)
- Notification history: 90 days (then deleted)
- Analytics: 1 year (then aggregated)

---

## Common Operations

### Starting the Service

**How to start:**

```bash
# Start all components (production)
kubectl apply -f k8s/production/

# Verify startup
kubectl get pods -n notifications
kubectl logs -f deployment/notification-api -n notifications

# Check health endpoint
curl https://notifications.example.com/health
# Expected: {"status": "healthy", "version": "2.5.0"}
```

**Expected startup time:** 2-3 minutes

**Health check:** GET /health should return 200

---

### Stopping the Service

**How to stop (for maintenance):**

```bash
# Enable maintenance mode (queues requests)
kubectl set env deployment/notification-api MAINTENANCE_MODE=true

# Wait for in-flight requests to complete (30 seconds)
sleep 30

# Scale down workers
kubectl scale deployment/notification-email-worker --replicas=0
kubectl scale deployment/notification-sms-worker --replicas=0
kubectl scale deployment/notification-push-worker --replicas=0

# Scale down API (after workers stopped)
kubectl scale deployment/notification-api --replicas=0

# Verify all pods stopped
kubectl get pods -n notifications
```

**⚠️ Warning:** Stopping the service means notifications won't be delivered. Only stop for critical maintenance.

---

### Deploying a New Version

**Deployment procedure:**

```bash
# 1. Deploy to staging first
kubectl apply -f k8s/staging/

# 2. Run smoke tests in staging
./scripts/smoke-test-staging.sh

# 3. Deploy to production (gradual rollout)
kubectl set image deployment/notification-api \
  notification-api=company/notification-api:v2.5.0

# Kubernetes will automatically:
# - Deploy to 25% of pods
# - Wait for health checks
# - Gradually roll out to 100%

# 4. Monitor deployment
kubectl rollout status deployment/notification-api -n notifications

# 5. Verify new version
curl https://notifications.example.com/version
# Expected: {"version": "2.5.0"}

# 6. Monitor for 30 minutes
# Watch dashboards, error rates, latency
```

**Rollback procedure:**

```bash
# Rollback to previous version
kubectl rollout undo deployment/notification-api -n notifications

# Verify rollback
kubectl rollout status deployment/notification-api -n notifications
curl https://notifications.example.com/version
```

**Deployment frequency:** Weekly on Tuesdays, 2 PM EST

---

### Scaling the Service

**Manual scaling:**

```bash
# Scale API servers
kubectl scale deployment/notification-api --replicas=10

# Scale email workers
kubectl scale deployment/notification-email-worker --replicas=20
```

**Auto-scaling:**
Auto-scaling configured via Horizontal Pod Autoscaler (HPA):
- API servers: Scale on CPU > 70% (min 3, max 10)
- Email workers: Scale on queue depth > 1000 (min 5, max 20)
- SMS workers: Scale on queue depth > 500 (min 2, max 5)

**Capacity planning:**
- Current peak load: 100 notifications/sec (~300K/hour)
- Max capacity: 500 notifications/sec (~1.8M/hour)
- Safety margin: 5x current peak

---

## Troubleshooting

### Symptom: High Error Rate

**Symptom:**
Error rate > 5% (normal is <1%)

**Detection:**
Alert: "NotificationServiceErrorRate" fires

**Diagnosis:**

```bash
# 1. Check error logs
kubectl logs -f deployment/notification-api -n notifications | grep ERROR

# 2. Check error types in DataDog
# Go to: https://app.datadoghq.com/dashboard/abc-123
# Look at: "Errors by Type" chart

# 3. Check dependency health
curl https://notifications.example.com/health/dependencies
# Shows: {sendgrid: ok, twilio: ok, database: ok, redis: ok}
```

**Common causes:**

**1. Third-party API down (SendGrid, Twilio)**
- Symptom: Errors like "SendGrid API returned 503"
- Solution: SendGrid/Twilio will auto-retry. Queue will back up, then drain when service recovers.
- Action: Monitor queue depth. If queue > 10K, consider scaling workers.

**2. Database connection pool exhausted**
- Symptom: Errors like "could not obtain connection from pool"
- Solution: Increase connection pool size or scale API servers
- Action:
  ```bash
  # Increase pool size (restart required)
  kubectl set env deployment/notification-api DB_POOL_SIZE=50
  
  # Or scale horizontally
  kubectl scale deployment/notification-api --replicas=6
  ```

**3. Rate limiting**
- Symptom: Errors like "rate limit exceeded for user X"
- Solution: User sending too many notifications, rate limiter working correctly
- Action: If legitimate traffic, increase rate limit for user

**Escalation:**
If error rate > 10% for > 15 min, page on-call engineer

---

### Symptom: High Latency

**Symptom:**
p95 latency > 10 seconds (normal is <5s)

**Detection:**
Alert: "NotificationServiceLatency" fires

**Diagnosis:**

```bash
# Check latency by component
curl https://notifications.example.com/metrics | grep latency

# Check database query performance
# Connect to database
kubectl exec -it notification-db-primary-0 -- psql -U postgres notifications_db

# Find slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
WHERE mean_exec_time > 100 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Common causes:**

**1. Database slow queries**
- Solution: Optimize queries, add indexes
- Action: See slow queries above, work with DBA

**2. Third-party API slow**
- Symptom: SendGrid/Twilio responding slowly
- Solution: Increase timeout, scale workers
- Action:
  ```bash
  # Increase worker timeout
  kubectl set env deployment/notification-email-worker SENDGRID_TIMEOUT=30s
  ```

**3. Worker queue backup**
- Symptom: Queue depth high, workers can't keep up
- Solution: Scale workers
- Action:
  ```bash
  # Scale email workers
  kubectl scale deployment/notification-email-worker --replicas=20
  ```

---

### Symptom: Service Down / Not Responding

**Symptom:**
Health check failing, 503 errors, users reporting outage

**Detection:**
Alert: "NotificationServiceDown" fires

**Diagnosis:**

```bash
# 1. Check pod status
kubectl get pods -n notifications

# Look for:
# - CrashLoopBackOff
# - Pending
# - ImagePullBackOff

# 2. Check pod logs
kubectl logs -f deployment/notification-api -n notifications

# 3. Check events
kubectl get events -n notifications --sort-by='.lastTimestamp'

# 4. Check resource limits
kubectl top pods -n notifications
```

**Common causes:**

**1. Pods crashing**
- Symptom: Pods in CrashLoopBackOff
- Solution: Check logs for error, rollback if needed
- Action:
  ```bash
  # Check crash reason
  kubectl describe pod <pod-name> -n notifications
  
  # Rollback if deployment caused crash
  kubectl rollout undo deployment/notification-api -n notifications
  ```

**2. Database down**
- Symptom: Can't connect to database
- Solution: Escalate to database team
- Action: Page database on-call (#database-team)

**3. Out of resources (memory/CPU)**
- Symptom: Pods being OOMKilled (Out Of Memory)
- Solution: Increase resource limits
- Action:
  ```bash
  # Edit deployment to increase memory limit
  kubectl edit deployment notification-api -n notifications
  # Change: memory: "1Gi" to memory: "2Gi"
  ```

**Escalation:**
If service down > 5 min, page on-call engineer AND manager

---

### Symptom: Messages Not Being Delivered

**Symptom:**
Users report not receiving notifications

**Diagnosis:**

```bash
# 1. Check if request reached our service
# Search logs for user ID or email
kubectl logs deployment/notification-api -n notifications | grep "user@example.com"

# 2. Check notification status in database
kubectl exec -it notification-db-primary-0 -- psql -U postgres notifications_db

SELECT id, user_id, type, channel, status, created_at, delivered_at, error
FROM notifications
WHERE user_id = '12345'
ORDER BY created_at DESC
LIMIT 10;

# Status can be: pending, queued, sent, delivered, failed, bounced

# 3. If status=failed, check error message
# 4. If status=sent but not delivered, check third-party (SendGrid/Twilio)

# 5. Check user preferences (maybe they opted out)
SELECT * FROM user_notification_preferences WHERE user_id = '12345';
```

**Common causes:**

**1. User opted out of notifications**
- Solution: User preference working correctly
- Action: Explain to user how to opt back in

**2. Invalid email/phone number**
- Symptom: Error like "invalid email format" or "phone number not found"
- Solution: Update user contact info
- Action: Alert user to update their profile

**3. Third-party delivery failure (bounced email, SMS failed)**
- Symptom: SendGrid reports "bounced" or Twilio reports "undelivered"
- Solution: Check SendGrid/Twilio dashboard for details
- Action: May need to update email/phone or check spam folder

**4. Notification deduplication**
- Symptom: We intentionally didn't send (duplicate within 1 hour)
- Solution: Deduplication working correctly
- Action: Explain to user (prevents spam)

---

## Alerts and Monitoring

### Key Dashboards

**Primary dashboard:**
[Link to main dashboard]

**Example:**
https://app.datadoghq.com/dashboard/notification-service

**Panels:**
- Request rate (req/sec)
- Error rate (%)
- Latency (p50, p95, p99)
- Queue depth by channel (email, SMS, push)
- Worker utilization
- Third-party API health

**Secondary dashboards:**
- [Link to infrastructure dashboard]
- [Link to business metrics dashboard]

---

### Critical Alerts

| Alert | Condition | Severity | Response Time | Action |
|-------|-----------|----------|---------------|--------|
| [Alert name] | [When it fires] | [P0/P1/P2] | [Response SLA] | [What to do] |

**Example:**
| Alert | Condition | Severity | Response Time | Action |
|-------|-----------|----------|---------------|--------|
| NotificationServiceDown | Health check fails for 5 min | P0 | Immediate | Follow "Service Down" runbook, page on-call |
| NotificationServiceErrorRate | Error rate > 10% for 15 min | P1 | 15 min | Follow "High Error Rate" runbook |
| NotificationServiceLatency | p95 latency > 30s for 10 min | P1 | 15 min | Follow "High Latency" runbook |
| QueueDepthHigh | Queue > 50K messages | P2 | 30 min | Scale workers, investigate if still growing |
| ThirdPartyAPIDown | SendGrid/Twilio down | P2 | 30 min | Monitor, queue will retry automatically |

**Alert routing:**
- P0: Page on-call engineer via PagerDuty
- P1: Slack #notifications-alerts + page if not acknowledged in 15 min
- P2: Slack #notifications-alerts

**Muting alerts:**
During planned maintenance, mute alerts:
```bash
# Mute via DataDog UI or API
curl -X POST "https://api.datadoghq.com/api/v1/downtime" \
  -H "DD-API-KEY: ${DD_API_KEY}" \
  -d '{
    "scope": "service:notification-service",
    "start": 1706918400,
    "end": 1706922000,
    "message": "Planned maintenance"
  }'
```

---

### Key Metrics

**Service health metrics:**
- Uptime (target: 99.9%)
- Request rate (normal: 50-100 req/sec)
- Error rate (target: <1%)
- Latency p95 (target: <5s)

**Business metrics:**
- Notifications sent per day (normal: 500K)
- Delivery rate (target: 99%)
- Open rate (email)
- Click-through rate (email)

**Infrastructure metrics:**
- CPU utilization (normal: 40-60%)
- Memory usage (normal: 50-70%)
- Disk usage (database: <80%)
- Network I/O

---

## Incident Response

### Severity Levels

| Severity | Definition | Response Time | Example |
|----------|-----------|---------------|---------|
| P0 | Service completely down | Immediate | All notifications failing, database down |
| P1 | Major functionality impaired | 15 min | Error rate >10%, latency >30s, critical channel down |
| P2 | Minor functionality impaired | 30 min | Error rate 5-10%, one channel degraded |
| P3 | Low impact issue | 4 hours | Slow response, minor bugs |

---

### Incident Response Process

**1. Detection (0-5 min)**
- Alert fires
- On-call engineer notified
- Acknowledge alert in PagerDuty

**2. Assessment (5-10 min)**
- Determine severity (P0, P1, P2, P3)
- Gather initial information (dashboards, logs)
- Update status page if user-facing

**3. Communication (10-15 min)**
- Post in #incidents Slack channel
- Start incident Zoom call (for P0/P1)
- Assign incident commander (for P0/P1)
- Notify stakeholders

**4. Mitigation (15+ min)**
- Follow relevant troubleshooting runbook
- Implement fix or workaround
- Monitor impact

**5. Resolution**
- Verify issue resolved
- Update status page
- Close incident
- Schedule post-mortem (for P0/P1)

**6. Post-Mortem (within 48 hours)**
- Write incident report
- Identify root cause
- Create action items
- Share learnings

---

### Escalation Path

**Level 1:** On-call engineer (paged automatically)

**Level 2:** Engineering manager (if not resolved in 30 min for P0, 60 min for P1)

**Level 3:** VP Engineering (for P0 only, if not resolved in 60 min)

**Cross-team escalation:**
- Database issues: #database-team
- Infrastructure: #platform-team
- Third-party APIs: Contact SendGrid/Twilio support

---

## Maintenance Procedures

### Routine Maintenance

**Daily:**
- [ ] Check dashboards for anomalies
- [ ] Review error logs
- [ ] Check queue depth

**Weekly:**
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Clean up old test data

**Monthly:**
- [ ] Review and update this runbook
- [ ] Capacity planning review
- [ ] Rotate API keys (if applicable)

---

### Database Maintenance

**Backup verification:**
```bash
# Check latest backup
aws s3 ls s3://backups/notifications-db/ --recursive | tail -1

# Test restore (in staging)
pg_restore -U postgres -d notifications_db_test /path/to/backup.dump
```

**Frequency:** Daily at 2 AM EST

**Retention:** 30 days

---

### Log Rotation

**Log retention:**
- Application logs: 7 days
- Access logs: 30 days
- Audit logs: 1 year

**Automatic rotation:** Configured in Kubernetes, logs shipped to DataDog

---

## Runbook Health

**Runbook metadata:**
- **Last updated:** [Date]
- **Last tested:** [Date]
- **Owner:** [Team name]
- **Reviewers:** [Names]

**Runbook review schedule:** Monthly

**How to update this runbook:**
1. Edit the source file in Git: `docs/runbooks/notification-service.md`
2. Create pull request
3. Get review from team lead
4. Merge and update "Last Updated" date

**Feedback:** Found an error or have suggestions? Post in #engineering-docs or create GitHub issue.

---

**© 2026 [Organization Name]. All rights reserved.**
