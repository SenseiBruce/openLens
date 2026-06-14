# Database Operations Runbook

## Document Information
- **Project Name:** [Project Name]
- **Database Name:** [Database Name]
- **Version:** [Version Number]
- **Date:** [Current Date]
- **Maintainer:** [DBA Team Name]
- **Status:** [Draft | Active | Archived]

---

## Overview

This runbook provides step-by-step procedures for common database operations, maintenance tasks, and troubleshooting scenarios for the `[Database Name]` database.

### Runbook Scope
- Routine maintenance procedures
- Common troubleshooting scenarios
- Emergency response procedures
- Performance optimization tasks
- Backup and recovery operations

### Prerequisites
- Access to database server (SSH, RDP, or database client)
- Appropriate database credentials (read-only, admin, etc.)
- Access to monitoring dashboards
- Access to backup storage

---

## Quick Reference

### Emergency Contacts
| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|--------------|
| Primary On-Call DBA | [Name] | [Phone] | [Email] | 24/7 |
| Secondary On-Call DBA | [Name] | [Phone] | [Email] | 24/7 |
| Database Manager | [Name] | [Phone] | [Email] | Business hours |
| Infrastructure Lead | [Name] | [Phone] | [Email] | Business hours |
| Vendor Support | [Vendor] | [Support #] | [Email] | 24/7 (P0/P1 only) |

### Key System Information
| Item | Value |
|------|-------|
| **Database System** | [PostgreSQL 14.5 | MySQL 8.0 | etc.] |
| **Server Hostname** | [db-prod-01.company.com] |
| **Connection Port** | [5432 | 3306 | etc.] |
| **Primary Database** | [production_db] |
| **Monitoring Dashboard** | [https://grafana.company.com/db-prod] |
| **Log Location** | [/var/log/postgresql/ | /var/log/mysql/] |
| **Backup Location** | [s3://company-backups/database/] |
| **Configuration File** | [/etc/postgresql/14/main/postgresql.conf] |
| **Data Directory** | [/var/lib/postgresql/14/main/] |

### Common Commands Quick Reference
```bash
# Check database status
sudo systemctl status postgresql

# Connect to database
psql -h localhost -U postgres -d production_db

# Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Check database size
SELECT pg_size_pretty(pg_database_size('production_db'));

# Check for long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 minutes';
```

---

## Routine Maintenance

### Daily Tasks

#### Task 1: Check Database Health
**Frequency:** Daily (automated)
**Duration:** 5 minutes
**Owner:** On-Call DBA

**Steps:**
1. **Check database availability**
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql
   
   # Check connectivity
   psql -h localhost -U postgres -c "SELECT 1"
   ```

2. **Check disk space**
   ```bash
   df -h /var/lib/postgresql
   # Alert if > 80% full
   ```

3. **Check active connections**
   ```sql
   SELECT count(*) AS active_connections
   FROM pg_stat_activity 
   WHERE state = 'active';
   -- Alert if > 150 (80% of max_connections)
   ```

4. **Check for errors in logs**
   ```bash
   # Last 24 hours errors
   sudo tail -1000 /var/log/postgresql/postgresql-14-main.log | grep -i "error\|fatal\|panic"
   ```

5. **Check replication lag** (if applicable)
   ```sql
   -- On replica
   SELECT 
       now() - pg_last_xact_replay_timestamp() AS replication_lag;
   -- Alert if > 60 seconds
   ```

6. **Review monitoring dashboard**
   - CPU, Memory, Disk I/O metrics
   - Query performance metrics
   - Alert status

**Success Criteria:**
- ✓ Database is running
- ✓ Disk space < 80%
- ✓ No critical errors in logs
- ✓ Replication lag < 60 seconds
- ✓ All dashboards green

---

#### Task 2: Review Slow Query Log
**Frequency:** Daily
**Duration:** 15 minutes
**Owner:** On-Call DBA

**Steps:**
1. **Query slow query log**
   ```sql
   -- PostgreSQL with pg_stat_statements extension
   SELECT 
       calls,
       total_exec_time,
       mean_exec_time,
       max_exec_time,
       query
   FROM pg_stat_statements
   WHERE mean_exec_time > 100 -- queries slower than 100ms
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

2. **Analyze top slow queries**
   - Identify patterns (missing indexes, full table scans, etc.)
   - Check execution plans
   ```sql
   EXPLAIN ANALYZE <slow_query>;
   ```

3. **Create optimization tickets**
   - For queries consistently > 1 second
   - Include query text, execution plan, and recommendations

4. **Update slow query tracking spreadsheet**
   - Date, query hash, avg duration, action taken

**Success Criteria:**
- ✓ Top 10 slow queries identified
- ✓ Optimization tickets created if needed
- ✓ No queries consistently > 5 seconds

---

### Weekly Tasks

#### Task 3: Database Statistics Update
**Frequency:** Weekly (Sunday 2 AM)
**Duration:** 30 minutes - 2 hours
**Owner:** Automated (cron job)

**Steps:**
1. **Run ANALYZE on all tables**
   ```sql
   -- PostgreSQL
   VACUUM ANALYZE;
   
   -- Or for specific large tables
   VACUUM ANALYZE users;
   VACUUM ANALYZE orders;
   ```

2. **Check for table bloat**
   ```sql
   SELECT
       schemaname,
       tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS external_size
   FROM pg_tables
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
   LIMIT 20;
   ```

3. **Reindex bloated indexes** (if needed)
   ```sql
   REINDEX INDEX CONCURRENTLY idx_users_email;
   ```

**Automation:**
```bash
#!/bin/bash
# /usr/local/bin/weekly_vacuum.sh
# Runs every Sunday at 2 AM via cron

LOG_FILE="/var/log/postgresql/vacuum_$(date +%Y%m%d).log"

echo "Starting weekly VACUUM ANALYZE at $(date)" >> $LOG_FILE

psql -U postgres -d production_db -c "VACUUM ANALYZE;" >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "VACUUM ANALYZE completed successfully at $(date)" >> $LOG_FILE
else
    echo "VACUUM ANALYZE failed at $(date)" >> $LOG_FILE
    /usr/local/bin/send-alert "Weekly VACUUM failed"
fi
```

**Success Criteria:**
- ✓ ANALYZE completed on all tables
- ✓ Table bloat identified
- ✓ Bloated indexes reindexed

---

#### Task 4: Backup Validation
**Frequency:** Weekly (Saturday)
**Duration:** 1 hour
**Owner:** On-Call DBA

**Steps:**
1. **Select random backup from last week**
   ```bash
   aws s3 ls s3://company-backups/database/full/ | tail -7 | shuf -n 1
   ```

2. **Download backup**
   ```bash
   aws s3 cp s3://company-backups/database/full/production_db_20240115_010000.dump /tmp/test_restore/
   ```

3. **Verify checksum**
   ```bash
   aws s3 cp s3://company-backups/database/full/production_db_20240115_010000.sha256 /tmp/test_restore/
   sha256sum -c production_db_20240115_010000.sha256
   ```

4. **Restore to test environment**
   ```bash
   createdb test_restore_db
   pg_restore -d test_restore_db -Fc /tmp/test_restore/production_db_20240115_010000.dump
   ```

5. **Validate data integrity**
   ```sql
   -- Connect to test_restore_db
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM orders;
   -- Compare to expected counts from backup date
   ```

6. **Document results**
   - Update backup validation log
   - Report any issues

7. **Cleanup**
   ```bash
   dropdb test_restore_db
   rm -rf /tmp/test_restore/
   ```

**Success Criteria:**
- ✓ Backup downloaded successfully
- ✓ Checksum validated
- ✓ Restore completed without errors
- ✓ Data integrity verified
- ✓ Results documented

---

### Monthly Tasks

#### Task 5: Index Maintenance
**Frequency:** Monthly (first Saturday, 2 AM)
**Duration:** 2-4 hours
**Owner:** On-Call DBA

**Steps:**
1. **Identify unused indexes**
   ```sql
   SELECT
       schemaname,
       tablename,
       indexname,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch,
       pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
   FROM pg_stat_user_indexes
   WHERE idx_scan = 0
   AND indexrelname NOT LIKE 'pk_%'
   ORDER BY pg_relation_size(indexrelid) DESC;
   ```

2. **Review with development team**
   - Confirm indexes are truly unused (not just in monitoring period)
   - Create tickets to remove unused indexes

3. **Identify missing indexes**
   ```sql
   -- Check for sequential scans on large tables
   SELECT
       schemaname,
       tablename,
       seq_scan,
       seq_tup_read,
       idx_scan,
       seq_tup_read / seq_scan AS avg_seq_tup_read,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS table_size
   FROM pg_stat_user_tables
   WHERE seq_scan > 0
   AND seq_tup_read / seq_scan > 10000
   ORDER BY seq_tup_read DESC
   LIMIT 20;
   ```

4. **Create tickets for index improvements**

5. **Rebuild fragmented indexes** (if needed)
   ```sql
   REINDEX INDEX CONCURRENTLY idx_large_table_column;
   ```

**Success Criteria:**
- ✓ Unused indexes identified
- ✓ Missing index opportunities identified
- ✓ Tickets created for improvements
- ✓ Critical indexes rebuilt

---

## Troubleshooting

### Scenario 1: Database Down

**Symptoms:**
- Application cannot connect to database
- `psql` connection refused
- Monitoring shows database as down

**Diagnosis:**
1. **Check if database process is running**
   ```bash
   sudo systemctl status postgresql
   # or
   ps aux | grep postgres
   ```

2. **Check for errors in logs**
   ```bash
   sudo tail -100 /var/log/postgresql/postgresql-14-main.log
   ```

3. **Check disk space**
   ```bash
   df -h /var/lib/postgresql
   ```

4. **Check for port conflicts**
   ```bash
   sudo netstat -tulpn | grep 5432
   ```

**Resolution:**

**Case 1: Database process not running**
```bash
# Try to start database
sudo systemctl start postgresql

# Check status
sudo systemctl status postgresql

# If it fails to start, check logs
sudo journalctl -u postgresql -n 100
```

**Case 2: Out of disk space**
```bash
# Emergency: Clear old logs
sudo find /var/log/postgresql -name "*.log" -mtime +7 -delete

# Emergency: Drop temp files (if safe)
# Connect to database and check
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname))
FROM pg_database;

# Expand disk (see Disk Space Full scenario)
```

**Case 3: Corrupted data directory**
```bash
# LAST RESORT - restore from backup
# See "Restore from Backup" section
```

**Escalation:**
- If not resolved in 15 minutes → Escalate to Database Manager
- If data corruption suspected → Escalate to Database Architect

---

### Scenario 2: High CPU Usage

**Symptoms:**
- CPU utilization > 80% sustained
- Slow query performance
- Monitoring alerts

**Diagnosis:**
1. **Check which queries are consuming CPU**
   ```sql
   SELECT
       pid,
       usename,
       application_name,
       client_addr,
       state,
       now() - query_start AS duration,
       query
   FROM pg_stat_activity
   WHERE state = 'active'
   ORDER BY (now() - query_start) DESC
   LIMIT 20;
   ```

2. **Check for long-running queries**
   ```sql
   SELECT
       pid,
       now() - pg_stat_activity.query_start AS duration,
       query,
       state
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
   ORDER BY duration DESC;
   ```

3. **Check system CPU with `top` or `htop`**
   ```bash
   top -u postgres
   ```

4. **Check for VACUUM or autovacuum activity**
   ```sql
   SELECT * FROM pg_stat_progress_vacuum;
   ```

**Resolution:**

**Case 1: Runaway query consuming CPU**
```sql
-- Kill the offending query
SELECT pg_cancel_backend(<pid>);

-- If it doesn't stop, force terminate
SELECT pg_terminate_backend(<pid>);

-- Log the query for analysis
```

**Case 2: Too many concurrent queries**
```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- If near max_connections, identify and close idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < NOW() - INTERVAL '10 minutes';
```

**Case 3: Inefficient query patterns**
- Review slow query log
- Add missing indexes (CONCURRENTLY to avoid locks)
- Optimize query (work with development team)

**Temporary Mitigation:**
```sql
-- Limit concurrent connections for specific users/applications
ALTER ROLE app_user CONNECTION LIMIT 50;
```

**Long-term Fix:**
- Optimize queries
- Add indexes
- Scale up hardware (more CPU cores)

---

### Scenario 3: Disk Space Full

**Symptoms:**
- Disk usage > 90%
- "No space left on device" errors
- Database refusing writes

**Diagnosis:**
1. **Check disk usage**
   ```bash
   df -h /var/lib/postgresql
   ```

2. **Identify largest files/directories**
   ```bash
   sudo du -h /var/lib/postgresql/14/main | sort -rh | head -20
   ```

3. **Check database sizes**
   ```sql
   SELECT
       pg_database.datname,
       pg_size_pretty(pg_database_size(pg_database.datname)) AS size
   FROM pg_database
   ORDER BY pg_database_size(pg_database.datname) DESC;
   ```

4. **Check table sizes**
   ```sql
   SELECT
       tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
       pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS external_size
   FROM pg_tables
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
   LIMIT 20;
   ```

**Resolution:**

**Immediate Actions:**
1. **Clear old logs**
   ```bash
   # PostgreSQL logs
   sudo find /var/log/postgresql -name "*.log" -mtime +7 -delete
   
   # Old WAL files (if not using archiving)
   # CAUTION: Only if you're sure they're archived/backed up
   sudo find /var/lib/postgresql/14/main/pg_wal -name "0*" -mtime +1 -delete
   ```

2. **Vacuum full on bloated tables** (requires table lock)
   ```sql
   -- During maintenance window only
   VACUUM FULL table_with_bloat;
   ```

3. **Drop temporary tables**
   ```sql
   SELECT 'DROP TABLE ' || tablename || ';'
   FROM pg_tables
   WHERE tablename LIKE 'temp_%'
   AND schemaname = 'public';
   ```

**Short-term Fix:**
1. **Expand disk volume**
   ```bash
   # AWS EBS example
   aws ec2 modify-volume --volume-id vol-xxxxx --size 1000
   
   # Resize filesystem
   sudo resize2fs /dev/xvdf
   
   # Verify
   df -h
   ```

**Long-term Fix:**
1. **Implement archival strategy**
   - Archive old data to separate "archive" database
   - Partition tables by date
   
2. **Implement data retention policy**
   ```sql
   -- Delete data older than retention period
   DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '90 days';
   ```

3. **Enable compression** (if supported)

---

### Scenario 4: Slow Queries

**Symptoms:**
- Query duration > normal baseline
- Application timeouts
- User complaints

**Diagnosis:**
1. **Identify slow queries**
   ```sql
   SELECT
       query,
       calls,
       total_exec_time,
       mean_exec_time,
       max_exec_time
   FROM pg_stat_statements
   WHERE mean_exec_time > 100
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

2. **Get execution plan**
   ```sql
   EXPLAIN ANALYZE <slow_query>;
   ```

3. **Check for missing indexes**
   ```sql
   -- Look for Sequential Scans in EXPLAIN output
   ```

4. **Check for table bloat**
   ```sql
   SELECT
       tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
       n_dead_tup,
       n_live_tup,
       n_dead_tup::float / NULLIF(n_live_tup, 0) AS dead_ratio
   FROM pg_stat_user_tables
   ORDER BY n_dead_tup DESC
   LIMIT 20;
   ```

5. **Check for lock waits**
   ```sql
   SELECT
       blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS blocking_statement
   FROM pg_catalog.pg_locks blocked_locks
   JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
   JOIN pg_catalog.pg_locks blocking_locks 
       ON blocking_locks.locktype = blocked_locks.locktype
       AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
       AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
       AND blocking_locks.pid != blocked_locks.pid
   JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
   WHERE NOT blocked_locks.granted;
   ```

**Resolution:**

**Case 1: Missing index**
```sql
-- Create index (CONCURRENTLY to avoid locking)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

**Case 2: Table bloat**
```sql
-- During maintenance window
VACUUM FULL table_name;

-- Or online (slower but no lock)
pg_repack -t table_name
```

**Case 3: Inefficient query**
- Rewrite query to use better join strategies
- Add WHERE clauses to filter earlier
- Use materialized views for complex aggregations

**Case 4: Lock contention**
```sql
-- Kill blocking query (if safe)
SELECT pg_terminate_backend(<blocking_pid>);
```

---

### Scenario 5: Replication Lag

**Symptoms:**
- Replica lag > threshold (e.g., 60 seconds)
- Stale data on read replicas
- Monitoring alerts

**Diagnosis:**
1. **Check replication lag** (on replica)
   ```sql
   SELECT
       now() - pg_last_xact_replay_timestamp() AS replication_lag;
   ```

2. **Check WAL sender status** (on primary)
   ```sql
   SELECT
       client_addr,
       state,
       sent_lsn,
       write_lsn,
       flush_lsn,
       replay_lsn,
       sync_state,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
   FROM pg_stat_replication;
   ```

3. **Check for network issues**
   ```bash
   ping <replica_ip>
   mtr <replica_ip>
   ```

4. **Check for high load on replica**
   ```bash
   # On replica
   top
   iostat -x 1 10
   ```

**Resolution:**

**Case 1: High load on primary**
- Reduce write load
- Optimize queries causing high WAL generation

**Case 2: Network issues**
- Check firewall rules
- Check network bandwidth
- Investigate network errors

**Case 3: Replica can't keep up**
- Reduce query load on replica (move reads to other replicas)
- Upgrade replica hardware
- Tune `max_wal_senders`, `wal_keep_size`, etc.

**Case 4: Replication slot issue**
```sql
-- On primary, check replication slots
SELECT * FROM pg_replication_slots;

-- If slot is inactive, drop and recreate
SELECT pg_drop_replication_slot('<slot_name>');
```

**Emergency Mitigation:**
- Redirect read traffic away from lagging replica
- Restart replication (if safe)

---

## Backup and Recovery

### Create Manual Backup

**When to use:**
- Before major schema changes
- Before risky maintenance
- Ad-hoc backup request

**Steps:**
1. **Create backup**
   ```bash
   # Full database backup
   pg_dump -h localhost -U postgres -Fc -f /backups/manual_$(date +%Y%m%d_%H%M%S).dump production_db
   ```

2. **Calculate checksum**
   ```bash
   sha256sum /backups/manual_$(date +%Y%m%d_%H%M%S).dump > /backups/manual_$(date +%Y%m%d_%H%M%S).sha256
   ```

3. **Upload to S3**
   ```bash
   aws s3 cp /backups/manual_$(date +%Y%m%d_%H%M%S).dump s3://company-backups/database/manual/
   aws s3 cp /backups/manual_$(date +%Y%m%d_%H%M%S).sha256 s3://company-backups/database/manual/
   ```

4. **Verify backup**
   ```bash
   pg_restore --list /backups/manual_$(date +%Y%m%d_%H%M%S).dump | head -20
   ```

5. **Document backup**
   - Update backup log
   - Note reason for manual backup

---

### Restore from Backup

**When to use:**
- Database corruption
- Accidental data deletion
- Disaster recovery

**Prerequisites:**
- [ ] Management approval (for production)
- [ ] Change ticket created
- [ ] Stakeholders notified
- [ ] Backup validated

**Steps:**

**Option 1: Full database restore (requires downtime)**
1. **Stop application connections**
   ```bash
   # Prevent new connections
   sudo systemctl stop application
   ```

2. **Terminate existing connections**
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE datname = 'production_db'
   AND pid <> pg_backend_pid();
   ```

3. **Drop and recreate database**
   ```sql
   DROP DATABASE production_db;
   CREATE DATABASE production_db;
   ```

4. **Restore backup**
   ```bash
   pg_restore -d production_db -Fc /backups/production_db_20240115_010000.dump
   ```

5. **Validate restore**
   ```sql
   -- Check row counts
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM orders;
   
   -- Check data integrity
   SELECT * FROM users LIMIT 10;
   ```

6. **Restart application**
   ```bash
   sudo systemctl start application
   ```

7. **Monitor for issues**

**Option 2: Point-in-time recovery (PITR)**
1. **Restore base backup**
2. **Apply WAL files up to target point**
3. **Promote to primary**

(See disaster recovery runbook for detailed PITR steps)

---

## Performance Optimization

### Add Index

**When to use:**
- Frequent sequential scans on large tables
- Slow queries identified in slow query log

**Steps:**
1. **Analyze query performance**
   ```sql
   EXPLAIN ANALYZE <slow_query>;
   ```

2. **Identify missing index**
   - Look for Sequential Scan or Bitmap Heap Scan in execution plan

3. **Test index in staging**
   ```sql
   -- In staging environment
   CREATE INDEX idx_users_email ON users(email);
   
   -- Re-run EXPLAIN ANALYZE
   EXPLAIN ANALYZE <slow_query>;
   
   -- Verify performance improvement
   ```

4. **Create index in production** (non-blocking)
   ```sql
   -- CONCURRENTLY prevents table locking
   CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
   ```

5. **Verify index created**
   ```sql
   SELECT
       tablename,
       indexname,
       indexdef
   FROM pg_indexes
   WHERE indexname = 'idx_users_email';
   ```

6. **Monitor query performance**
   - Check if slow query is now faster
   - Monitor index usage:
   ```sql
   SELECT
       indexrelname,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
   FROM pg_stat_user_indexes
   WHERE indexrelname = 'idx_users_email';
   ```

---

### Analyze Query Performance

**Steps:**
1. **Enable query logging** (if not already enabled)
   ```sql
   ALTER SYSTEM SET log_min_duration_statement = 1000; -- log queries > 1 second
   SELECT pg_reload_conf();
   ```

2. **Get execution plan**
   ```sql
   EXPLAIN ANALYZE <query>;
   ```

3. **Analyze execution plan**
   - Look for Sequential Scans (should use Index Scan if possible)
   - Look for high cost operations
   - Look for large row estimates vs. actual

4. **Common issues and fixes:**

   **Issue: Sequential Scan on large table**
   - **Fix:** Add index on filter column
   
   **Issue: Nested Loop with large outer relation**
   - **Fix:** Rewrite query to filter outer relation first
   
   **Issue: Sort operation**
   - **Fix:** Add index on ORDER BY columns
   
   **Issue: Hash Join instead of Index Join**
   - **Fix:** Update statistics (`ANALYZE`), consider increasing `random_page_cost`

5. **Test optimized query**
   ```sql
   EXPLAIN ANALYZE <optimized_query>;
   ```

---

## Emergency Procedures

### Database Failover (Primary to Replica)

**When to use:**
- Primary database unrecoverable
- Hardware failure on primary
- Disaster recovery scenario

**Prerequisites:**
- [ ] Incident Commander declared disaster
- [ ] Management approval obtained
- [ ] Stakeholders notified (expected downtime)
- [ ] Replica is available and replication lag < threshold

**Steps:**
1. **Verify replica health**
   ```sql
   -- On replica
   SELECT pg_is_in_recovery(); -- Should return true
   SELECT pg_last_wal_receive_lsn(); -- Should be recent
   ```

2. **Stop application writes**
   - Stop application servers
   - Or update load balancer to reject writes

3. **Promote replica to primary**
   ```bash
   # On replica
   /usr/lib/postgresql/14/bin/pg_ctl promote -D /var/lib/postgresql/14/main
   ```

4. **Verify promotion**
   ```sql
   SELECT pg_is_in_recovery(); -- Should now return false
   ```

5. **Update DNS/connection strings**
   - Point applications to new primary
   - Update monitoring

6. **Restart applications**
   - Start application servers
   - Monitor for errors

7. **Create new replica** (optional, for HA)
   - Set up new replica from new primary
   - Configure replication

8. **Post-failover verification**
   - Verify writes are working
   - Check application logs for errors
   - Monitor database performance

**Rollback:**
- If failover fails, attempt to restore original primary
- If both primary and replica are down, restore from backup

---

## Appendices

### Appendix A: Configuration Parameters

| Parameter | Current Value | Recommended | Notes |
|-----------|--------------|-------------|-------|
| max_connections | 200 | 200 | Based on application load |
| shared_buffers | 16 GB | 25% of RAM | 64 GB RAM total |
| effective_cache_size | 48 GB | 75% of RAM | |
| work_mem | 64 MB | 64 MB | For sorting/joins |
| maintenance_work_mem | 2 GB | 2 GB | For VACUUM, CREATE INDEX |
| checkpoint_timeout | 15 min | 15 min | |
| wal_buffers | 16 MB | -1 (auto) | |
| random_page_cost | 1.1 | 1.1 | SSD storage |

### Appendix B: Common SQL Queries

**Check active connections:**
```sql
SELECT
    count(*),
    state,
    usename
FROM pg_stat_activity
GROUP BY state, usename;
```

**Check database sizes:**
```sql
SELECT
    datname,
    pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;
```

**Check table sizes:**
```sql
SELECT
    schemaname || '.' || tablename AS table,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

**Check index usage:**
```sql
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

**Kill idle connections:**
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < NOW() - INTERVAL '30 minutes';
```

### Appendix C: Log File Locations

| Log Type | Location |
|----------|----------|
| PostgreSQL Error Log | `/var/log/postgresql/postgresql-14-main.log` |
| Slow Query Log | (via pg_stat_statements extension) |
| System Log | `/var/log/syslog` or `/var/log/messages` |
| Application Log | `/var/log/application/app.log` |

### Appendix D: Useful Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| `pg_top` | Monitor PostgreSQL activity (like `top`) | `sudo apt install ptop` |
| `pgBadger` | PostgreSQL log analyzer | `sudo apt install pgbadger` |
| `pg_stat_statements` | Track query statistics | (extension, enable in postgresql.conf) |
| `pg_repack` | Online table repack | `sudo apt install postgresql-14-repack` |

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | YYYY-MM-DD | [Name] | Initial runbook |
| | | | |
