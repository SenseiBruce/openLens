# Database Monitoring Plan

## Document Information
- **Project Name:** [Project Name]
- **Database Name:** [Database Name]
- **Version:** [Version Number]
- **Date:** [Current Date]
- **Author:** [Author Name]
- **Status:** [Draft | In Review | Approved | Active]

## Document Control
| Version | Date | Author | Changes | Reviewer | Status |
|---------|------|--------|---------|----------|--------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft | [Name] | Draft |
| | | | | | |

---

## Executive Summary

### Purpose
[Brief description of monitoring objectives and scope]

### Monitoring Objectives
- **Availability:** Detect and respond to database outages within [X] minutes
- **Performance:** Identify performance degradation before user impact
- **Capacity:** Proactively manage resource utilization and growth
- **Security:** Detect unauthorized access and suspicious activities
- **Compliance:** Maintain audit trail and meet regulatory requirements

### Key Metrics
| Metric Category | Key Indicators | Alert Threshold | Target SLA |
|-----------------|----------------|-----------------|------------|
| Availability | Uptime, Connection Success Rate | < 99.9% | 99.95% |
| Performance | Query Response Time, Throughput | p95 > baseline +20% | p95 < 100ms |
| Capacity | CPU, Memory, Storage, IOPS | > 80% sustained | < 70% average |
| Security | Failed Logins, Unauthorized Access | > 5 attempts/5 min | 0 incidents |

---

## Monitoring Architecture

### Monitoring Stack
| Component | Technology | Purpose | Status |
|-----------|------------|---------|--------|
| **Metrics Collection** | [Prometheus | CloudWatch | Datadog] | Collect time-series metrics | Active |
| **Log Aggregation** | [ELK | Splunk | CloudWatch Logs] | Centralize and search logs | Active |
| **Visualization** | [Grafana | Kibana | Cloud Dashboard] | Dashboards and graphs | Active |
| **Alerting** | [Alertmanager | PagerDuty | OpsGenie] | Alert routing and escalation | Active |
| **APM** | [New Relic | Datadog | Dynatrace] | Application performance monitoring | Active |
| **Synthetic Monitoring** | [Pingdom | Synthetics | Custom] | Proactive health checks | Active |

### Architecture Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                    Database Servers                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Primary  │  │ Replica  │  │ Replica  │                   │
│  │   DB     │  │   DB     │  │   DB     │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
└───────┼────────────┬─┼────────────┬─┼───────────────────────┘
        │            │ │            │ │
        ▼            ▼ ▼            ▼ ▼
┌─────────────────────────────────────────────────────────────┐
│           Monitoring Agents / Exporters                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ postgres_│  │ mysqld_  │  │ node_    │                  │
│  │ exporter │  │ exporter │  │ exporter │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼────────────┬─┼────────────┬─┼──────────────────────┘
        │            │ │            │ │
        ▼            ▼ ▼            ▼ ▼
┌─────────────────────────────────────────────────────────────┐
│              Metrics & Logs Collection                       │
│  ┌───────────────┐         ┌───────────────┐               │
│  │  Prometheus   │         │  Filebeat /   │               │
│  │  (Metrics)    │         │  Fluentd      │               │
│  └───────┬───────┘         └───────┬───────┘               │
└──────────┼─────────────────────────┼─────────────────────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Storage & Processing                               │
│  ┌───────────────┐         ┌───────────────┐               │
│  │  Prometheus   │         │ Elasticsearch │               │
│  │  TSDB         │         │  (Logs)       │               │
│  └───────┬───────┘         └───────┬───────┘               │
└──────────┼─────────────────────────┼─────────────────────────┘
           │                         │
           ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Visualization & Alerting                             │
│  ┌───────────────┐         ┌───────────────┐               │
│  │   Grafana     │         │    Kibana     │               │
│  │  (Dashboards) │         │   (Logs UI)   │               │
│  └───────┬───────┘         └───────────────┘               │
│          │                                                   │
│  ┌───────▼────────────────────────────┐                    │
│  │      Alertmanager / PagerDuty      │                    │
│  │         (Alerts & Escalation)       │                    │
│  └────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
   ┌──────────────┐
   │  On-Call     │
   │  Engineers   │
   └──────────────┘
```

---

## Metrics to Monitor

### Infrastructure Metrics

#### CPU Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `cpu_usage_percent` | Overall CPU utilization | 15 seconds | 30 days | > 80% for 10 min |
| `cpu_user_percent` | User-space CPU usage | 15 seconds | 30 days | > 70% for 10 min |
| `cpu_system_percent` | System/kernel CPU usage | 15 seconds | 30 days | > 30% for 10 min |
| `cpu_iowait_percent` | CPU waiting for I/O | 15 seconds | 30 days | > 20% for 5 min |
| `load_average_1m` | 1-minute load average | 15 seconds | 30 days | > CPU count × 0.7 |
| `load_average_5m` | 5-minute load average | 15 seconds | 30 days | > CPU count × 0.5 |

**PromQL Query Example:**
```promql
# CPU usage over 80% for 10 minutes
avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance) > 0.8
```

#### Memory Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `memory_used_percent` | Memory utilization | 15 seconds | 30 days | > 85% |
| `memory_available_bytes` | Available memory | 15 seconds | 30 days | < 20% of total |
| `swap_used_percent` | Swap usage | 15 seconds | 30 days | > 10% |
| `buffer_cache_bytes` | OS buffer cache | 1 minute | 30 days | N/A (informational) |

**PromQL Query Example:**
```promql
# Memory usage over 85%
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) > 0.85
```

#### Disk Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `disk_used_percent` | Disk space utilization | 1 minute | 30 days | > 80% warning, > 90% critical |
| `disk_iops_read` | Read IOPS | 15 seconds | 30 days | > 80% of provisioned |
| `disk_iops_write` | Write IOPS | 15 seconds | 30 days | > 80% of provisioned |
| `disk_throughput_read_mbps` | Read throughput (MB/s) | 15 seconds | 30 days | > 80% of max |
| `disk_throughput_write_mbps` | Write throughput (MB/s) | 15 seconds | 30 days | > 80% of max |
| `disk_latency_read_ms` | Read latency | 15 seconds | 30 days | > 10ms (SSD) |
| `disk_latency_write_ms` | Write latency | 15 seconds | 30 days | > 10ms (SSD) |
| `disk_queue_length` | Disk queue depth | 15 seconds | 30 days | > 5 sustained |

#### Network Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `network_in_mbps` | Inbound network traffic | 15 seconds | 30 days | > 80% of max |
| `network_out_mbps` | Outbound network traffic | 15 seconds | 30 days | > 80% of max |
| `network_errors_in` | Inbound network errors | 1 minute | 30 days | > 0 |
| `network_errors_out` | Outbound network errors | 1 minute | 30 days | > 0 |
| `network_packets_dropped` | Dropped packets | 1 minute | 30 days | > 100/min |

### Database Metrics

#### Connection Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `active_connections` | Currently active connections | 15 seconds | 30 days | > 80% of max_connections |
| `idle_connections` | Idle connections | 15 seconds | 30 days | > 50% of max_connections |
| `connections_per_second` | New connections/sec | 15 seconds | 30 days | Sudden spike (> 3x baseline) |
| `connection_errors` | Failed connection attempts | 15 seconds | 30 days | > 5 per minute |
| `max_connections_reached` | Connection limit hit | 15 seconds | 30 days | > 0 |

**PromQL Query Example:**
```promql
# Active connections > 80% of max
(pg_stat_database_numbackends / pg_settings_max_connections) > 0.8
```

#### Query Performance Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `query_duration_avg_ms` | Average query duration | 15 seconds | 30 days | > 100ms |
| `query_duration_p50_ms` | 50th percentile duration | 15 seconds | 30 days | > 50ms |
| `query_duration_p95_ms` | 95th percentile duration | 15 seconds | 30 days | > 200ms |
| `query_duration_p99_ms` | 99th percentile duration | 15 seconds | 30 days | > 500ms |
| `queries_per_second` | Query throughput | 15 seconds | 30 days | < 50% of baseline (degradation) |
| `slow_queries_count` | Queries > threshold | 1 minute | 30 days | > 10 per minute |

#### Transaction Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `transactions_per_second` | Transaction rate | 15 seconds | 30 days | < 50% of baseline |
| `commits_per_second` | Committed transactions | 15 seconds | 30 days | N/A |
| `rollbacks_per_second` | Rolled back transactions | 15 seconds | 30 days | > 10% of commits |
| `active_transactions` | Currently running transactions | 15 seconds | 30 days | > 100 |
| `longest_transaction_sec` | Duration of longest transaction | 15 seconds | 30 days | > 300 seconds (5 min) |
| `transaction_deadlocks` | Deadlocks detected | 1 minute | 30 days | > 1 per hour |

#### Cache Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `buffer_cache_hit_ratio` | Buffer cache hit percentage | 1 minute | 30 days | < 95% |
| `buffer_cache_size_mb` | Buffer cache size | 1 minute | 30 days | N/A |
| `shared_buffers_used` | Shared buffers utilization | 1 minute | 30 days | > 90% |
| `temp_files_created` | Temporary files created | 1 minute | 30 days | > 100 per hour |
| `temp_files_size_mb` | Size of temp files | 1 minute | 30 days | > 10 GB |

**PromQL Query Example:**
```promql
# Buffer cache hit ratio < 95%
(pg_stat_database_blks_hit / (pg_stat_database_blks_read + pg_stat_database_blks_hit)) < 0.95
```

#### Lock Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `lock_waits_per_second` | Lock waits | 15 seconds | 30 days | > 10 per second |
| `lock_wait_time_avg_ms` | Average lock wait duration | 15 seconds | 30 days | > 100ms |
| `deadlocks_per_hour` | Deadlocks detected | 1 minute | 30 days | > 5 per hour |
| `blocking_queries` | Queries blocking others | 15 seconds | 30 days | > 5 |

#### Replication Metrics (if applicable)
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `replication_lag_seconds` | Replication delay | 15 seconds | 30 days | > 30 seconds warning, > 60 critical |
| `replication_lag_bytes` | Replication lag in bytes | 15 seconds | 30 days | > 100 MB |
| `replica_status` | Replica health (up/down) | 15 seconds | 30 days | down = critical |
| `wal_sender_status` | WAL sender active | 15 seconds | 30 days | inactive = critical |

#### Database Size Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `database_size_gb` | Total database size | 5 minutes | 90 days | > 80% of provisioned storage |
| `table_size_gb` | Individual table sizes | 1 hour | 90 days | Sudden growth (> 20% in 24h) |
| `index_size_gb` | Individual index sizes | 1 hour | 90 days | Index larger than table |
| `database_growth_gb_per_day` | Daily growth rate | 1 hour | 90 days | > expected growth rate |

### Application Metrics

#### Error Metrics
| Metric | Description | Collection Interval | Retention | Alert Threshold |
|--------|-------------|---------------------|-----------|-----------------|
| `database_errors_per_second` | Database errors | 15 seconds | 30 days | > 1 per second |
| `connection_errors` | Connection failures | 15 seconds | 30 days | > 5 per minute |
| `query_syntax_errors` | Invalid SQL queries | 1 minute | 30 days | > 10 per hour |
| `constraint_violations` | Constraint errors | 1 minute | 30 days | > expected rate |

---

## Log Monitoring

### Log Categories
| Log Type | Source | Format | Retention | Purpose |
|----------|--------|--------|-----------|---------|
| **Error Logs** | Database server | Text/JSON | 90 days | Troubleshooting, alerting |
| **Slow Query Logs** | Database server | CSV/JSON | 30 days | Performance optimization |
| **Audit Logs** | Database + triggers | JSON | 7 years | Compliance, security |
| **Connection Logs** | Database server | Text/JSON | 30 days | Security, troubleshooting |
| **Replication Logs** | Database server | Text/JSON | 30 days | Replication health |

### Log Collection
- **Method:** [Filebeat | Fluentd | CloudWatch Agent]
- **Destination:** [Elasticsearch | Splunk | CloudWatch Logs]
- **Parsing:** [Grok patterns | JSON | Custom parser]

### Log Alerts
| Alert | Log Pattern | Severity | Notification |
|-------|-------------|----------|--------------|
| Database Crash | `FATAL:.*server.*shutdown` | Critical | Page on-call DBA |
| Out of Memory | `out of memory` | Critical | Page on-call DBA |
| Corruption | `corruption\|corrupt` | Critical | Page on-call DBA + Security |
| Replication Failure | `replication.*failed\|stopped` | High | Alert on-call DBA |
| Failed Authentication | `authentication failed` | Medium | Alert security team if > 5/min |
| Slow Query | `duration: ([5-9]\d{3}\|\d{5,}) ms` | Low | Log only (review daily) |

**Example Elasticsearch Query:**
```json
{
  "query": {
    "bool": {
      "must": [
        {"match": {"log_level": "ERROR"}},
        {"range": {"@timestamp": {"gte": "now-5m"}}}
      ],
      "should": [
        {"match": {"message": "out of memory"}},
        {"match": {"message": "corruption"}}
      ]
    }
  }
}
```

---

## Dashboards

### Dashboard 1: Database Overview
**Purpose:** High-level database health and performance
**Refresh:** 15 seconds
**Audience:** DBAs, Ops team

**Panels:**
1. **Status Indicator:** Database up/down, version, uptime
2. **Connections:** Active connections (gauge), connections over time (graph)
3. **Throughput:** Transactions/second, queries/second (graph)
4. **Performance:** Query duration p50, p95, p99 (graph)
5. **Resource Utilization:** CPU, memory, disk, network (gauges + graphs)
6. **Cache Hit Ratio:** Buffer cache, index cache (gauge)
7. **Alerts:** Active alerts (table)

**Link:** `https://grafana.company.com/d/database-overview`

### Dashboard 2: Performance Deep Dive
**Purpose:** Detailed query performance analysis
**Refresh:** 30 seconds
**Audience:** DBAs, Performance Engineers

**Panels:**
1. **Query Duration Heatmap:** Query duration distribution over time
2. **Top 10 Slowest Queries:** Table with query text, avg duration, count
3. **Query Types:** Breakdown by SELECT, INSERT, UPDATE, DELETE
4. **Slow Query Trend:** Queries > 1 second over time
5. **Lock Waits:** Lock wait events and duration
6. **Temporary Files:** Temp file creation rate and size
7. **Index Usage:** Index hit ratio, sequential scans

### Dashboard 3: Capacity Planning
**Purpose:** Trend analysis and growth projections
**Refresh:** 5 minutes
**Audience:** DBAs, IT Management

**Panels:**
1. **Database Size Trend:** Historical growth (30/90/365 days)
2. **Table Growth:** Top 10 fastest-growing tables
3. **Storage Forecast:** Projected storage exhaustion date
4. **Connection Trend:** Connection usage over time
5. **IOPS Trend:** IOPS usage and headroom
6. **Transaction Growth:** Transaction rate trend

### Dashboard 4: Replication Health
**Purpose:** Monitor replication lag and replica health
**Refresh:** 15 seconds
**Audience:** DBAs

**Panels:**
1. **Replication Status:** Replica up/down status
2. **Replication Lag:** Lag in seconds and bytes (graph)
3. **WAL Sender Status:** Active senders
4. **Replica Query Performance:** Query performance on replicas
5. **Replication Conflicts:** Conflicts detected

---

## Alerting

### Alert Severity Levels
| Severity | Description | Response Time | Notification Method | Escalation |
|----------|-------------|---------------|---------------------|------------|
| **Critical** | Service down, data loss risk | Immediate | Page (PagerDuty/phone call) | 15 min |
| **High** | Degraded performance, SLA risk | 15 minutes | Page + Slack | 30 min |
| **Medium** | Warning threshold reached | 1 hour | Slack + Email | 2 hours |
| **Low** | Informational, no immediate action | 4 hours | Email only | None |

### Alert Rules

#### Availability Alerts
| Alert Name | Condition | Severity | Notification | Notes |
|------------|-----------|----------|--------------|-------|
| Database Down | `up == 0` for 1 minute | Critical | Page on-call DBA | Check primary and replicas |
| Connection Refused | Connection errors > 5/min | High | Page on-call DBA | Could indicate network/firewall issue |
| Max Connections Reached | Active connections >= max_connections | High | Alert on-call DBA | Temporary mitigation: kill idle connections |

**Alertmanager Rule:**
```yaml
- alert: DatabaseDown
  expr: up{job="postgres"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Database {{ $labels.instance }} is down"
    description: "PostgreSQL instance {{ $labels.instance }} has been down for more than 1 minute."
```

#### Performance Alerts
| Alert Name | Condition | Severity | Notification | Notes |
|------------|-----------|----------|--------------|-------|
| High Query Latency | p95 query duration > 200ms for 10 min | High | Alert on-call DBA | Check slow query log |
| Low Throughput | Transactions/sec < 50% baseline for 10 min | High | Alert on-call DBA | Possible issue or low traffic |
| Slow Queries Spike | Queries > 5 sec increase by 50% | Medium | Alert on-call DBA | Review query performance |
| High Rollback Rate | Rollbacks > 10% of commits for 5 min | Medium | Alert on-call DBA | Application errors? |

**Alertmanager Rule:**
```yaml
- alert: HighQueryLatency
  expr: histogram_quantile(0.95, rate(pg_stat_statements_mean_exec_time_bucket[5m])) > 200
  for: 10m
  labels:
    severity: high
  annotations:
    summary: "High query latency on {{ $labels.instance }}"
    description: "95th percentile query latency is {{ $value }}ms (threshold: 200ms)"
```

#### Capacity Alerts
| Alert Name | Condition | Severity | Notification | Notes |
|------------|-----------|----------|--------------|-------|
| High CPU Usage | CPU > 80% for 10 min | High | Alert on-call DBA | Check running queries |
| High Memory Usage | Memory > 90% for 5 min | High | Alert on-call DBA | Risk of OOM killer |
| Disk Space Critical | Disk > 90% full | Critical | Page on-call DBA | Immediate expansion needed |
| Disk Space Warning | Disk > 80% full | Medium | Alert on-call DBA | Plan for expansion |
| High IOPS Usage | IOPS > 80% of limit for 10 min | Medium | Alert on-call DBA | Consider upgrading |

**Alertmanager Rule:**
```yaml
- alert: DiskSpaceCritical
  expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) > 0.9
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Disk space critical on {{ $labels.instance }}"
    description: "Disk usage is {{ $value | humanizePercentage }} (threshold: 90%)"
```

#### Replication Alerts
| Alert Name | Condition | Severity | Notification | Notes |
|------------|-----------|----------|--------------|-------|
| Replication Lag High | Lag > 60 seconds | Critical | Page on-call DBA | Risk of data loss on failover |
| Replication Lag Warning | Lag > 30 seconds | High | Alert on-call DBA | Monitor closely |
| Replica Down | Replica status = down for 2 min | Critical | Page on-call DBA | Affects HA/DR |

**Alertmanager Rule:**
```yaml
- alert: ReplicationLagHigh
  expr: pg_replication_lag_seconds > 60
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Replication lag high on {{ $labels.instance }}"
    description: "Replication lag is {{ $value }} seconds (threshold: 60s)"
```

#### Security Alerts
| Alert Name | Condition | Severity | Notification | Notes |
|------------|-----------|----------|--------------|-------|
| Failed Login Spike | Failed logins > 10/min | High | Alert security team | Possible brute force |
| Unauthorized Access Attempt | Access to sensitive tables by unexpected user | High | Alert security team | Investigate immediately |
| Unusual Time Access | Admin access outside business hours | Medium | Log + alert security team | May be legitimate |

### Alert Escalation
```
Alert Triggered
      │
      ▼
┌─────────────────┐
│  Primary        │  Notify via Slack + Email
│  On-Call DBA    │  Response Time: 15 min (Critical), 1 hour (Medium)
└────────┬────────┘
         │ No Response in 15 min (Critical) or 1 hour (Medium)?
         ▼
┌─────────────────┐
│  Secondary      │  Page via PagerDuty (phone call)
│  On-Call DBA    │  Response Time: 15 min
└────────┬────────┘
         │ No Response in 15 min?
         ▼
┌─────────────────┐
│  Database       │  Page + Email
│  Manager        │  Response Time: 15 min
└────────┬────────┘
         │ No Response in 15 min?
         ▼
┌─────────────────┐
│  IT Director    │  Page + SMS + Email
│                 │  Initiate incident management process
└─────────────────┘
```

---

## Synthetic Monitoring

### Health Check Endpoints
| Check Name | Endpoint/Query | Frequency | Timeout | Expected Response | Alert On Failure |
|------------|----------------|-----------|---------|-------------------|------------------|
| **Database Connectivity** | `SELECT 1` | 30 seconds | 5 seconds | Returns 1 | Critical |
| **Read Query** | `SELECT COUNT(*) FROM health_check_table` | 1 minute | 10 seconds | Returns count | High |
| **Write Query** | `INSERT INTO health_check_table...` | 5 minutes | 10 seconds | Success | High |
| **Replication Check** | `SELECT pg_last_wal_receive_lsn()` | 1 minute | 10 seconds | Returns LSN | High (if replica) |

**Example Health Check Script:**
```python
#!/usr/bin/env python3
import psycopg2
import sys
import time

def check_database_health(host, port, database, user, password):
    try:
        start = time.time()
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            connect_timeout=5
        )
        cur = conn.cursor()
        
        # Connectivity check
        cur.execute("SELECT 1")
        result = cur.fetchone()
        if result[0] != 1:
            raise Exception("Unexpected result")
        
        # Query performance check
        cur.execute("SELECT COUNT(*) FROM health_check_table")
        count = cur.fetchone()[0]
        
        elapsed = time.time() - start
        
        cur.close()
        conn.close()
        
        print(f"OK: Database healthy (response time: {elapsed:.2f}s, row count: {count})")
        return 0
    except Exception as e:
        print(f"CRITICAL: Database health check failed: {e}")
        return 2

if __name__ == "__main__":
    sys.exit(check_database_health(
        host="db.company.com",
        port=5432,
        database="production",
        user="health_check",
        password="xxx"
    ))
```

---

## On-Call and Incident Response

### On-Call Schedule
- **Rotation:** Weekly rotation
- **Handoff:** Monday 9 AM
- **Backup:** Secondary on-call for escalation
- **Tools:** PagerDuty for scheduling and alerting

**Current On-Call:**
| Week | Primary DBA | Secondary DBA | Database Manager |
|------|-------------|---------------|------------------|
| [Date Range] | [Name] | [Name] | [Name] |

### Incident Response Runbooks
| Scenario | Runbook Link | Owner | Last Updated |
|----------|--------------|-------|--------------|
| Database Down | `/runbooks/database-down.md` | [Name] | YYYY-MM-DD |
| High CPU Usage | `/runbooks/high-cpu.md` | [Name] | YYYY-MM-DD |
| Disk Space Full | `/runbooks/disk-full.md` | [Name] | YYYY-MM-DD |
| Replication Lag | `/runbooks/replication-lag.md` | [Name] | YYYY-MM-DD |
| Slow Queries | `/runbooks/slow-queries.md` | [Name] | YYYY-MM-DD |

### Incident Severity Matrix
| Severity | Impact | Examples | Target Response Time | Target Resolution Time |
|----------|--------|----------|----------------------|------------------------|
| P0 - Critical | Complete outage, data loss | Database down, corruption | 15 minutes | 2 hours |
| P1 - High | Severe degradation, SLA breach | High latency, partial outage | 30 minutes | 4 hours |
| P2 - Medium | Minor degradation, workaround available | Slow queries, warnings | 2 hours | 1 business day |
| P3 - Low | No user impact, informational | Low disk space warning | 1 business day | 1 week |

---

## Reporting

### Daily Reports
**Audience:** DBAs, Ops team
**Delivery:** Email at 8 AM
**Contents:**
- Uptime summary (last 24 hours)
- Alerts triggered and resolved
- Performance summary (avg query duration, throughput)
- Slow queries identified (top 10)
- Capacity utilization (CPU, memory, disk, IOPS)
- Backup status

### Weekly Reports
**Audience:** Engineering management, DBAs
**Delivery:** Email Monday morning
**Contents:**
- Availability summary (uptime percentage)
- Performance trends (week-over-week comparison)
- Capacity forecast
- Top 10 issues and resolutions
- Planned maintenance

### Monthly Reports
**Audience:** IT management, Engineering leadership
**Delivery:** Email first Monday of month
**Contents:**
- SLA compliance (availability, performance)
- Capacity planning and growth analysis
- Performance optimization summary
- Security incidents and audit summary
- Compliance status
- Recommendations for next month

---

## Monitoring Maintenance

### Agent/Exporter Maintenance
- **Updates:** Monthly (security patches), quarterly (feature updates)
- **Testing:** Test in staging before production
- **Rollback Plan:** Keep previous version available

### Dashboard Maintenance
- **Review Frequency:** Quarterly
- **Update Process:** Propose changes, review with team, implement
- **Version Control:** Dashboards stored in Git

### Alert Tuning
- **Review Frequency:** Monthly (reduce alert fatigue)
- **Process:**
  1. Analyze alert frequency and false positive rate
  2. Adjust thresholds or add conditions
  3. Test in staging
  4. Deploy to production
  5. Monitor for 1 week

**Alert Tuning Log:**
| Date | Alert | Change | Reason | Result |
|------|-------|--------|--------|--------|
| YYYY-MM-DD | High CPU Usage | Increased threshold from 70% to 80% | Too many false positives | Reduced alerts by 60% |
| [Date] | [Alert] | [Change] | [Reason] | [Result] |

---

## Compliance and Audit

### Audit Logging
All monitoring access and configuration changes are logged:
- **Who:** User making the change
- **What:** Configuration changed
- **When:** Timestamp
- **Why:** Change ticket/reason

### Compliance Monitoring
| Regulation | Requirement | Metric/Alert | Evidence |
|------------|-------------|--------------|----------|
| SOC 2 | Availability monitoring | Uptime tracking, alerting | Monitoring dashboards, incident logs |
| SOC 2 | Performance monitoring | Query performance metrics | Performance reports |
| GDPR | Audit logging | Audit log monitoring | Audit logs, SIEM |

---

## Continuous Improvement

### Monitoring Metrics (Meta-Monitoring)
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Alert False Positive Rate | < 10% | [%] | [🟢/🟡/🔴] |
| Mean Time to Detect (MTTD) | < 5 min | [min] | [🟢/🟡/🔴] |
| Mean Time to Acknowledge (MTTA) | < 15 min | [min] | [🟢/🟡/🔴] |
| Mean Time to Resolve (MTTR) | < 2 hours (P0) | [hours] | [🟢/🟡/🔴] |
| Dashboard Load Time | < 3 seconds | [sec] | [🟢/🟡/🔴] |

### Improvement Initiatives
| Initiative | Priority | Timeline | Expected Benefit |
|------------|----------|----------|------------------|
| Implement anomaly detection (ML-based) | High | Q2 2024 | Reduce false positives, earlier detection |
| Add distributed tracing | Medium | Q3 2024 | Better root cause analysis |
| Automate remediation for common issues | High | Q2 2024 | Reduce MTTR |

---

## Appendices

### Appendix A: Monitoring Tool Configuration
[Detailed configuration files for Prometheus, Grafana, etc.]

### Appendix B: Alert Notification Templates
[Email and Slack message templates]

### Appendix C: Dashboard JSON Definitions
[Grafana dashboard JSON exports]

### Appendix D: Runbook Index
[Complete list of all runbooks]

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Database Administrator | | | |
| DevOps Lead | | | |
| IT Manager | | | |

---

## Revision History

| Version | Date | Author | Description | Approver |
|---------|------|--------|-------------|----------|
| 1.0 | YYYY-MM-DD | [Name] | Initial version | [Name] |
| | | | | |
