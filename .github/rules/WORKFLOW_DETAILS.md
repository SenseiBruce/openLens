# Workflow Phase Summaries

This document provides detailed summaries of changes to each workflow phase, incorporating GitHub Copilot agents, serverless architecture, and configuration management standards.

---

## Phase 0: Project Intake and Team Formation

### Overview
Initial project setup where @project_orchestrator gathers requirements and assembles the specialized agent team.

### Key Changes (January 2026)

**Agent-Based Team Assembly:**
- @project_orchestrator runs as autonomous subagent
- Team selected based on project requirements (web app needs @frontend-developer, data project needs @data-engineer)
- Team roster includes GitHub Copilot @mentions for each agent

**Configuration Strategy Established:**
- 3-option protocol presented to user:
  1. Accept Defaults (10 seconds)
  2. Customize Specific (2 minutes)
  3. Review All (30 minutes)
- Environment strategy defined (dev/staging/prod)
- Secrets management approach determined

**Deliverables:**
- `planning/project_charter.md` - OKRs, timeline, constraints, team
- `planning/team_roster.md` - All agents with @mentions and roles
- `config/environments/` - Environment-specific config structure
- `.secrets/.gitignore` - Prevent secret commits

**Quality Gate:**
- [ ] Project charter approved by user
- [ ] Team roster complete with all necessary agents
- [ ] Configuration strategy agreed upon
- [ ] Timeline and budget established

---

## Phase 1: Requirements and Discovery

### Overview
@product-manager creates comprehensive PRD with user personas, journey maps, and success metrics.

### Key Changes (January 2026)

**Comprehensive PRD Format (1668 lines):**
- **User Personas:** Primary, secondary, tertiary with quotes and pain points
- **User Journey Maps:** Before/after scenarios with time savings quantified
- **Feature Specifications:** Priority, acceptance criteria, edge cases, dependencies
- **Success Metrics:** Business, user, and technical KPIs
- **Non-Functional Requirements:** Performance, reliability, security, monitoring, cost

**Configuration Awareness:**
- PRD includes configuration requirements for each feature
- Non-functional requirements specify monitoring needs (31 CloudWatch alarms)
- Cost optimization section with environment-specific budgets

**Template Used:**
`TEMPLATES/prd_template.md` - Comprehensive structure with all sections

**Deliverables:**
- `docs/PRD.md` - Complete product requirements (1668 lines)
- `docs/user_stories.md` - Feature user stories with acceptance criteria
- `planning/success_metrics.md` - KPI tracking spreadsheet

**Quality Gate:**
- [ ] PRD complete with all 10 sections
- [ ] User personas validated by user
- [ ] Success metrics agreed upon
- [ ] User and @technical-architect approval

---

## Phase 2: Design and Architecture

### Overview
@technical-architect designs serverless system architecture, @database-architect creates schema, @devops-engineer plans infrastructure.

### Key Changes (January 2026)

**Serverless-First Architecture:**
- **Compute:** AWS Lambda with FastAPI/Python
- **Database:** PostgreSQL RDS with RDS Proxy for connection pooling
- **AI Services:** AWS Bedrock + GCP Vertex AI (multi-cloud)
- **Infrastructure:** Terraform for complete IaC
- **Monitoring:** CloudWatch with 31 alarms per environment

**Configuration Architecture:**
```
.github/config/
  ├── agent-tech-configs.yml        # Global defaults
  └── config_loader.py              # Configuration utility

projects/proj_*/
  ├── config/
  │   ├── dev.yml                   # Development overrides
  │   ├── staging.yml               # Staging overrides
  │   └── prod.yml                  # Production overrides
  └── .secrets/                     # Local secrets (git-ignored)
```

**Security Design:**
- **Secrets:** AWS Secrets Manager for all credentials
- **Network:** VPC with private subnets for compute/data
- **Encryption:** KMS for data at rest, TLS 1.3 in transit
- **Access:** IAM roles with least privilege, no API keys in code

**Database Design with RDS Proxy:**
```sql
-- Connection pooling via RDS Proxy
-- Configuration table for app settings
CREATE TABLE app_config (
    env VARCHAR(20),
    key VARCHAR(255),
    value JSONB,
    UNIQUE(env, key)
);

-- Feature flags for controlled rollout
CREATE TABLE feature_flags (
    name VARCHAR(255) UNIQUE,
    enabled BOOLEAN,
    environments TEXT[]
);
```

**3-Option Protocol Implementation:**
Architect presents 3 options for technology choices:
1. **Accept Recommended:** Smart defaults (FastAPI, PostgreSQL, Lambda)
2. **Customize Stack:** User picks specific technologies
3. **Review Alternatives:** Deep dive into all options

**Deliverables:**
- `docs/architecture.md` - Complete system design (1202 lines)
- `docs/technology_decisions.md` - Rationale for all choices
- `infrastructure/terraform/` - Complete IaC skeleton
- `database/schema.sql` - Database schema with config tables

**Quality Gate:**
- [ ] Architecture reviewed and approved
- [ ] Database schema validated
- [ ] Infrastructure plan complete
- [ ] Security review passed
- [ ] User approval of technology choices

---

## Phase 3: Development and Implementation

### Overview
Development agents implement features following serverless best practices and zero hardcoded values standard.

### Key Changes (January 2026)

**Backend Development (@back-end-developer):**

**ZERO Hardcoded Values Enforcement:**
```python
# ❌ NEVER allowed in code
DATABASE_URL = "postgresql://user:pass@host/db"
API_KEY = "sk-abc123..."
TIMEOUT = 30

# ✅ ALWAYS required
from config_loader import load_config
config = load_config(environment=os.getenv('ENV', 'dev'))

DATABASE_URL = config['database']['url']
API_KEY = config['api']['key']
TIMEOUT = config['api']['timeout_seconds']
```

**Lambda Handler Pattern:**
```python
# Initialize outside handler (runs once per container)
import os
from aws_lambda_powertools import Logger, Tracer
from config_loader import load_config

logger = Logger()
tracer = Tracer()
config = load_config(environment=os.getenv('ENV', 'dev'))

# Connection pool via RDS Proxy (prevents cold start issues)
db_pool = create_rds_proxy_pool(
    host=config['database']['proxy_endpoint'],
    max_connections=config['database']['max_pool_size']
)

@tracer.capture_lambda_handler
def lambda_handler(event, context):
    """Handler uses pre-initialized resources"""
    logger.info("Processing request", extra={"event": event})
    
    with db_pool.get_connection() as conn:
        # Business logic here
        result = process_request(conn, event)
    
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
```

**Error Handling with DLQ:**
```python
# Failed Lambda invocations go to Dead Letter Queue
# Implement exponential backoff retry
def process_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                send_to_dlq(e)  # Manual review required
                raise
            wait = 2 ** attempt
            time.sleep(wait)
```

**Frontend Development (@frontend-developer):**
```typescript
// config/index.ts - Environment-aware configuration
export const loadConfig = (mode: string) => {
  const configs = {
    development: {
      api: {
        baseUrl: import.meta.env.VITE_API_URL,
        timeout: 5000
      }
    },
    production: {
      api: {
        baseUrl: import.meta.env.VITE_API_URL,
        timeout: 10000
      }
    }
  };
  return configs[mode];
};

// Usage
const config = loadConfig(import.meta.env.MODE);
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout
});
```

**Code Review Checklist:**
- [ ] ZERO hardcoded values (all config externalized)
- [ ] Secrets loaded from Secrets Manager (never in code)
- [ ] Lambda cold start optimized (initialization outside handler)
- [ ] RDS Proxy used for database connections
- [ ] DLQ configured for error handling
- [ ] Structured logging to CloudWatch
- [ ] Unit tests with >80% coverage
- [ ] Integration tests for critical paths

**Deliverables:**
- `src/backend/` - Lambda functions with config loading
- `src/backend/requirements.txt` - Dependencies
- `src/frontend/` - React/TypeScript application
- `tests/` - Complete test suite
- `config/` - Environment-specific configurations

**Quality Gate:**
- [ ] Code review passed
- [ ] ZERO hardcoded values verified
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Security scan clean (no secrets in code)

---

## Phase 4: Testing and Quality Assurance

### Overview
@test-engineer creates comprehensive test plan and implements automated testing with environment-aware configurations.

### Key Changes (January 2026)

**Test Configuration:**
```python
# tests/conftest.py - Test environment setup
import pytest
from config_loader import load_config

@pytest.fixture(scope='session')
def test_config():
    """Load test environment config"""
    return load_config(environment='test')

@pytest.fixture
def mock_aws(test_config):
    """Mock AWS services"""
    with mock_secretsmanager(), \
         mock_rds_proxy(), \
         mock_lambda():
        # Populate with test data
        yield

# tests/test_config_loading.py
def test_config_loading():
    """Verify no hardcoded values"""
    config = load_config('test')
    assert 'database' in config
    assert 'api' in config
    assert config['database']['url'].startswith('postgresql://')
```

**Integration Testing:**
```python
# tests/integration/test_lambda_e2e.py
def test_lambda_with_rds_proxy(test_config):
    """Test Lambda handler with RDS Proxy"""
    # Invoke Lambda
    response = lambda_client.invoke(
        FunctionName='api-test',
        Payload=json.dumps({'user_id': 123})
    )
    
    assert response['StatusCode'] == 200
    
    # Verify database connection used RDS Proxy
    logs = cloudwatch_logs.filter_log_events(
        logGroupName='/aws/lambda/api-test'
    )
    assert 'rds-proxy' in logs
```

**Performance Testing:**
```python
# tests/performance/test_cold_start.py
def test_lambda_cold_start_performance():
    """Verify cold start < 5 seconds"""
    import time
    
    # Force cold start
    lambda_client.delete_function_concurrency(
        FunctionName='api-test'
    )
    time.sleep(10)
    
    # Measure first invocation
    start = time.time()
    response = lambda_client.invoke(
        FunctionName='api-test',
        Payload=json.dumps({'test': 'cold_start'})
    )
    duration = time.time() - start
    
    assert duration < 5.0, f"Cold start took {duration}s"
```

**Security Testing:**
```bash
# tests/security/test_no_secrets.sh
#!/bin/bash

# Scan for hardcoded secrets
if grep -r "api_key\s*=\s*['\"]" src/ || \
   grep -r "password\s*=\s*['\"]" src/ || \
   grep -r "sk-" src/ || \
   grep -r "aws_.*_key\s*=\s*['\"]" src/; then
    echo "ERROR: Hardcoded secrets detected!"
    exit 1
fi

echo "✅ No hardcoded secrets found"
```

**Deliverables:**
- `docs/test_plan.md` - Complete testing strategy
- `tests/` - Unit, integration, performance tests
- `tests/security/` - Security test suite
- `.github/workflows/tests.yml` - CI/CD pipeline

**Quality Gate:**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Security scan clean (no secrets, dependencies safe)
- [ ] Performance benchmarks met (API p95 < 1s, cold start < 5s)
- [ ] User acceptance testing passed

---

## Phase 5: Deployment and Launch

### Overview
@devops-engineer deploys infrastructure and application with automated deployment script and comprehensive monitoring.

### Key Changes (January 2026)

**Automated Deployment Script:**
```bash
#!/bin/bash
# infrastructure/deploy.sh - Complete deployment automation

set -e

ENV=${1:-dev}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Deploying to $ENV environment in $REGION..."

# Step 1: Load secrets
echo "📦 Loading secrets from AWS Secrets Manager..."
aws secretsmanager get-secret-value \
    --secret-id "${ENV}/deployment/credentials" \
    --region $REGION \
    --output json > /tmp/deploy-creds.json

# Step 2: Deploy infrastructure
echo "🏗️  Deploying infrastructure with Terraform..."
cd infrastructure/terraform/environments/$ENV
terraform init -backend-config="bucket=terraform-state-${ENV}"
terraform plan -out=tfplan
terraform apply tfplan

# Get outputs
DB_PROXY_ENDPOINT=$(terraform output -raw rds_proxy_endpoint)
API_GATEWAY_URL=$(terraform output -raw api_gateway_url)

# Step 3: Deploy Lambda functions
echo "⚡ Deploying Lambda functions..."
cd ../../../../src/backend
zip -r function.zip . -x "*.pyc" -x "__pycache__/*"

aws lambda update-function-code \
    --function-name "api-${ENV}" \
    --zip-file fileb://function.zip \
    --region $REGION

# Step 4: Update environment variables
aws lambda update-function-configuration \
    --function-name "api-${ENV}" \
    --environment "Variables={
        ENV=${ENV},
        DB_PROXY_ENDPOINT=${DB_PROXY_ENDPOINT},
        CONFIG_BUCKET=agentbase-config-${ENV}
    }" \
    --region $REGION

# Step 5: Deploy frontend
echo "🌐 Deploying frontend..."
cd ../../frontend
npm run build
aws s3 sync dist/ s3://agentbase-web-${ENV}/ --delete

# Step 6: Configure CloudWatch alarms
echo "📊 Setting up CloudWatch alarms..."
cd ../../../monitoring
./setup_alarms.sh $ENV

# Step 7: Smoke tests
echo "✅ Running smoke tests..."
curl -f "${API_GATEWAY_URL}/health" || exit 1

echo "✨ Deployment to $ENV complete!"
echo "API: ${API_GATEWAY_URL}"
echo "Monitoring: https://console.aws.amazon.com/cloudwatch/home?region=${REGION}"
```

**31 CloudWatch Alarms:**
```yaml
# monitoring/alarms-${ENV}.yml
alarms:
  # API Performance (p50, p95, p99)
  - name: API-Latency-P95-${ENV}
    metric: Duration
    statistic: p95
    threshold: 1000  # ms
    evaluation_periods: 2
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
  
  # Error Rates
  - name: API-ErrorRate-${ENV}
    metric: Errors
    threshold: 1  # percent
    evaluation_periods: 3
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
  
  # Lambda Throttling
  - name: Lambda-Throttles-${ENV}
    metric: Throttles
    threshold: 10
    evaluation_periods: 1
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
  
  # Lambda Cold Starts
  - name: Lambda-ColdStart-Duration-${ENV}
    metric: InitDuration
    statistic: p95
    threshold: 5000  # ms
    evaluation_periods: 2
  
  # Database Connections (via RDS Proxy)
  - name: RDS-Proxy-Connections-High-${ENV}
    metric: DatabaseConnectionsCurrentlyInUse
    threshold: 80  # percent of max
    evaluation_periods: 2
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
  
  # Database CPU
  - name: RDS-CPU-High-${ENV}
    metric: CPUUtilization
    threshold: 75  # percent
    evaluation_periods: 3
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
  
  # Dead Letter Queue
  - name: DLQ-Messages-Present-${ENV}
    metric: ApproximateNumberOfMessagesVisible
    threshold: 1
    evaluation_periods: 1
    alarm_actions: arn:aws:sns:${region}:${account}:alerts-${ENV}
    treat_missing_data: notBreaching
  
  # Budget Alerts
  - name: Budget-Exceeded-${ENV}
    metric: EstimatedCharges
    threshold: ${budget}  # 20 dev, 30 staging, 50 prod
    evaluation_periods: 1
    alarm_actions: arn:aws:sns:${region}:${account}:budget-alerts
```

**Operations Runbook Created:**
`docs/operations_runbook.md` includes:
- Deployment procedures
- Monitoring dashboard links
- 31 CloudWatch alarms with thresholds
- Troubleshooting guide:
  - High API latency → Check cold starts, DB queries, RDS Proxy
  - Lambda throttling → Increase concurrency limits
  - DB connection exhaustion → Verify RDS Proxy usage
  - DLQ messages → Review error logs and replay

**Rollback Procedure:**
```bash
# Rollback to previous version
./deploy.sh dev rollback

# Or manual rollback
aws lambda update-function-code \
    --function-name "api-dev" \
    --s3-bucket lambda-versions \
    --s3-key "api-dev-v1.2.3.zip"
```

**Deliverables:**
- `infrastructure/deploy.sh` - Automated deployment (10 steps)
- `monitoring/alarms-${ENV}.yml` - 31 CloudWatch alarms
- `docs/operations_runbook.md` - Operations guide (400 lines)
- `docs/rollback_procedures.md` - Emergency rollback

**Quality Gate:**
- [ ] Staging deployment successful
- [ ] Smoke tests passing
- [ ] All 31 CloudWatch alarms configured and tested
- [ ] Operations runbook reviewed
- [ ] Rollback procedure tested
- [ ] Production deployment approved

---

## Phase 6: Post-Launch Operations

### Overview
Continuous monitoring, incident response, and iterative improvements based on production data.

### Key Changes (January 2026)

**CloudWatch Dashboards:**
```json
// monitoring/dashboard-${ENV}.json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "title": "API Performance",
        "metrics": [
          ["AWS/Lambda", "Duration", {"stat": "p50", "label": "p50"}],
          ["...", {"stat": "p95", "label": "p95"}],
          ["...", {"stat": "p99", "label": "p99"}]
        ]
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "RDS Proxy Connections",
        "metrics": [
          ["AWS/RDS", "DatabaseConnectionsCurrentlyInUse"],
          ["...", "DatabaseConnectionsCurrentlyBorrowing"]
        ]
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "Error Rates",
        "metrics": [
          ["AWS/Lambda", "Errors", {"stat": "Sum"}],
          ["AWS/ApiGateway", "4XXError", {"stat": "Sum"}],
          ["AWS/ApiGateway", "5XXError", {"stat": "Sum"}]
        ]
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "Cost (Daily)",
        "metrics": [
          ["AWS/Billing", "EstimatedCharges", {"stat": "Maximum"}]
        ]
      }
    }
  ]
}
```

**Incident Response Runbook:**
```markdown
## P1 Incident: API Down

1. **Immediate Actions (0-5 min):**
   - Check CloudWatch dashboard for errors
   - Review Lambda logs: `aws logs tail /aws/lambda/api-prod --follow`
   - Check RDS Proxy status
   - Verify no deployment in progress

2. **Diagnosis (5-15 min):**
   - High error rate? → Check application logs for exceptions
   - High latency? → Check RDS Proxy connections, cold starts
   - Throttling? → Check Lambda concurrency limits
   - DLQ messages? → Review failed requests

3. **Mitigation (15-30 min):**
   - If code issue → Rollback to previous version: `./deploy.sh prod rollback`
   - If infrastructure → Check Terraform state, re-apply if needed
   - If RDS Proxy → Verify security groups, endpoint accessibility
   - If throttling → Increase Lambda reserved concurrency

4. **Communication:**
   - Update status page
   - Notify stakeholders via #incidents Slack channel
   - Post-mortem within 24 hours
```

**Configuration Drift Detection:**
```python
# monitoring/config_drift_check.py
"""Verify no hardcoded values in production"""

def check_configuration():
    # Get Lambda environment variables
    lambda_config = boto3.client('lambda').get_function_configuration(
        FunctionName='api-prod'
    )
    
    # Verify all config comes from Parameter Store/Secrets Manager
    env_vars = lambda_config['Environment']['Variables']
    
    # Should only have pointers, not actual values
    required_pointers = ['CONFIG_BUCKET', 'ENV', 'REGION']
    forbidden_values = ['password', 'api_key', 'secret', 'token']
    
    for key, value in env_vars.items():
        assert key in required_pointers, f"Unexpected env var: {key}"
        assert not any(f in value.lower() for f in forbidden_values), \
            f"Potential secret in env var {key}"
    
    print("✅ No configuration drift detected")
```

**Cost Monitoring:**
```python
# monitoring/cost_analysis.py
"""Daily cost report and anomaly detection"""

def analyze_costs():
    ce = boto3.client('ce')
    
    # Get costs for last 7 days
    response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
            'End': datetime.now().strftime('%Y-%m-%d')
        },
        Granularity='DAILY',
        Metrics=['UnblendedCost'],
        GroupBy=[{'Type': 'SERVICE', 'Key': 'SERVICE'}]
    )
    
    # Alert if cost spike > 50% of average
    costs = [float(day['Total']['UnblendedCost']['Amount']) 
             for day in response['ResultsByTime']]
    avg = sum(costs) / len(costs)
    latest = costs[-1]
    
    if latest > avg * 1.5:
        send_alert(f"Cost spike detected: ${latest:.2f} (avg: ${avg:.2f})")
```

**Continuous Improvement:**
- Weekly review of CloudWatch metrics
- Monthly cost optimization review
- Quarterly architecture review
- User feedback incorporation for iterations

**Deliverables:**
- CloudWatch dashboards (operations, business, cost)
- Incident response runbooks
- Cost analysis reports
- Post-launch iteration plan

**Quality Gate:**
- [ ] All 31 CloudWatch alarms functional
- [ ] Incident response procedures tested
- [ ] Cost within budget (+/- 10%)
- [ ] Success metrics on track
- [ ] No critical bugs or security issues

---

## Workflow Summary

### Complete 7-Phase Flow

```
Phase 0: Project Intake
  ↓ @project_orchestrator assembles team
  ↓ Configuration strategy defined
  ↓ [GATE: Charter approved]

Phase 1: Requirements
  ↓ @product-manager creates PRD (1668 lines)
  ↓ User personas, journeys, metrics defined
  ↓ [GATE: Requirements signed off]

Phase 2: Design
  ↓ @technical-architect designs serverless system
  ↓ @database-architect creates schema with config tables
  ↓ @devops-engineer plans Terraform IaC
  ↓ [GATE: Design approved]

Phase 3: Development
  ↓ @back-end-developer implements Lambda with ZERO hardcoded values
  ↓ @frontend-developer builds React app with config loading
  ↓ All code loads config from external sources
  ↓ [GATE: Code review passed, no secrets in code]

Phase 4: Testing
  ↓ @test-engineer implements comprehensive tests
  ↓ Security scans verify no hardcoded secrets
  ↓ Performance tests validate <5s cold start
  ↓ [GATE: All tests passing]

Phase 5: Deployment
  ↓ @devops-engineer deploys with ./deploy.sh
  ↓ 31 CloudWatch alarms configured
  ↓ Operations runbook created (400 lines)
  ↓ [GATE: Deployment successful, monitoring active]

Phase 6: Operations
  ↓ Continuous monitoring via CloudWatch
  ↓ Incident response with runbooks
  ↓ Cost optimization and iterations
  ↓ [GATE: Production stable, metrics on track]
```

### Critical Success Factors

1. **Configuration Management:**
   - ZERO hardcoded values in any code
   - All config in `.github/config/` or `projects/*/config/`
   - Secrets in AWS Secrets Manager only

2. **Serverless Best Practices:**
   - Lambda with RDS Proxy (no direct DB connections)
   - Cold start optimization (<5s initialization)
   - DLQ for error handling
   - Environment-specific sizing (512MB dev, 1024MB prod)

3. **Monitoring:**
   - 31 CloudWatch alarms per environment
   - Structured logging to CloudWatch Logs
   - Daily cost reports with anomaly detection
   - Operations runbook for troubleshooting

4. **Security:**
   - No secrets in code (enforced by security scans)
   - VPC with private subnets
   - Encryption at rest (KMS) and in transit (TLS 1.3)
   - IAM roles with least privilege

---

**Last Updated:** January 19, 2026  
**Related:** [orchestration_rules.md](orchestration_rules.md), [protocols/agent_communication.md](../protocols/agent_communication.md), [protocols/workflow_adaptation.md](../protocols/workflow_adaptation.md)  
**Maintained By:** @project_orchestrator
