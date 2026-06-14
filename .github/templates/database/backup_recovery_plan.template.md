# Backup and Recovery Plan

## Document Information
- **Project Name:** [Project Name]
- **Database/System Name:** [Database/System Name]
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
[Brief description of why this backup and recovery plan exists and what it protects]

### Scope
- **Systems Covered:** [List of databases, applications, systems]
- **Data Covered:** [Types of data protected]
- **Excluded:** [What is not covered and why]

### Recovery Objectives
- **Recovery Time Objective (RTO):** [Maximum acceptable downtime]
- **Recovery Point Objective (RPO):** [Maximum acceptable data loss]
- **Service Level Agreement (SLA):** [Uptime commitment - e.g., 99.9%]

### Critical Success Factors
- [ ] All backups complete successfully
- [ ] Backups tested and validated monthly
- [ ] Recovery procedures documented and practiced
- [ ] Recovery can be performed within RTO
- [ ] Data loss does not exceed RPO

---

## Recovery Objectives

### Service Classification
| System/Database | Tier | RTO | RPO | Business Impact |
|-----------------|------|-----|-----|-----------------|
| Production Database | Tier 1 (Critical) | 1 hour | 15 minutes | Revenue loss, customer impact |
| Reporting Database | Tier 2 (Important) | 4 hours | 1 hour | Delayed reports |
| Development Database | Tier 3 (Standard) | 24 hours | 24 hours | Development delay |
| [System] | [Tier] | [RTO] | [RPO] | [Impact] |

### Business Impact Analysis
| Outage Duration | Business Impact | Financial Impact | Reputational Impact |
|-----------------|-----------------|------------------|---------------------|
| 0-1 hour | Minimal | None | None |
| 1-4 hours | Moderate | [$ amount] | Minor customer complaints |
| 4-8 hours | Significant | [$ amount] | Customer churn begins |
| > 8 hours | Severe | [$ amount/hour] | Major reputational damage |

---

## Backup Strategy

### Backup Types
| Backup Type | Frequency | Retention | Size | Duration | Window | Method |
|-------------|-----------|-----------|------|----------|--------|--------|
| **Full Backup** | Daily (1 AM) | 30 days | ~500 GB | 2 hours | 1-3 AM | [Tool/Method] |
| **Differential** | Every 6 hours | 7 days | ~50 GB | 30 mins | N/A | [Tool/Method] |
| **Transaction Log** | Every 15 mins | 7 days | ~5 GB | 5 mins | N/A | [Tool/Method] |
| **Snapshot** | Hourly | 24 hours | N/A | Instant | N/A | Storage snapshot |

### Backup Schedule
```
Sunday    Monday    Tuesday   Wednesday Thursday  Friday    Saturday
  │         │         │          │         │         │         │
  ├─Full────┼─Full────┼─Full─────┼─Full────┼─Full────┼─Full────┼─Full───
  │         │         │          │         │         │         │
  ├─Diff────┼─Diff────┼─Diff─────┼─Diff────┼─Diff────┼─Diff────┼─Diff───
  │ (6hr)   │ (6hr)   │ (6hr)    │ (6hr)   │ (6hr)   │ (6hr)   │ (6hr)
  │         │         │          │         │         │         │
  └─TLog────└─TLog────└─TLog─────└─TLog────└─TLog────└─TLog────└─TLog───
    (15min)   (15min)   (15min)    (15min)   (15min)   (15min)   (15min)
```

### Retention Policy
| Backup Type | Retention Period | Storage Tier | Reason |
|-------------|------------------|--------------|--------|
| Daily backups | 30 days | Hot (fast restore) | Operational recovery |
| Weekly backups | 12 weeks | Warm (moderate cost) | Extended recovery window |
| Monthly backups | 12 months | Warm | Compliance, audits |
| Yearly backups | 7 years | Cold (archival) | Legal/regulatory requirements |
| Transaction logs | 7 days | Hot | Point-in-time recovery |

**Archival Strategy:**
- After 30 days: Move to warm storage (e.g., AWS S3 Infrequent Access)
- After 90 days: Move to cold storage (e.g., AWS Glacier)
- After 7 years: Secure deletion

---

## Backup Infrastructure

### Backup Systems
| Component | Technology | Version | Location | Purpose |
|-----------|------------|---------|----------|---------|
| Backup Software | [Veeam / Commvault / pgBackRest / Native] | [Version] | [Location] | Backup orchestration |
| Primary Storage | [AWS S3 / Azure Blob / NAS] | N/A | [Region/DC] | Hot backup storage |
| Archive Storage | [AWS Glacier / Azure Archive] | N/A | [Region/DC] | Long-term retention |
| Backup Server | [Hardware/VM specs] | [OS] | [Location] | Backup execution |

### Storage Locations
| Storage Type | Location | Purpose | Capacity | Encryption | Access Control |
|--------------|----------|---------|----------|------------|----------------|
| Primary | AWS S3 us-east-1 | Active backups | 10 TB | AES-256 | IAM + MFA |
| Secondary | AWS S3 us-west-2 | DR backups (replica) | 10 TB | AES-256 | IAM + MFA |
| Archive | AWS Glacier us-east-1 | Long-term retention | 50 TB | AES-256 | IAM + MFA |
| Off-site Tape | [Facility] | Air-gapped backup | 100 TB | Hardware encryption | Physical security |

### 3-2-1 Backup Rule
- **3 copies:** Production data + 2 backups
- **2 different media:** Disk (S3) + Tape (off-site)
- **1 off-site:** Geographic redundancy (different region + tape vault)

### Network Topology
```
Production Database
    │
    ├─► Backup Server (local)
    │       │
    │       ├─► Primary Storage (AWS S3 us-east-1)
    │       │       │
    │       │       └─► Archive Storage (Glacier)
    │       │
    │       └─► Secondary Storage (AWS S3 us-west-2)
    │
    └─► Off-site Tape Library
```

---

## Backup Procedures

### Full Database Backup (Daily)

**Frequency:** Daily at 1:00 AM
**Expected Duration:** 2 hours
**Expected Size:** ~500 GB

**Pre-Backup Checks:**
- [ ] Verify sufficient disk space (2x backup size)
- [ ] Check backup software health
- [ ] Verify network connectivity to storage
- [ ] Confirm no maintenance windows scheduled

**Execution Steps:**
```bash
#!/bin/bash
# Daily full backup script

# Variables
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/full"
DB_NAME="production_db"
S3_BUCKET="s3://company-backups/database/full"

# Pre-flight checks
echo "Starting backup pre-flight checks..."
df -h $BACKUP_DIR | grep -q '90%' && { echo "ERROR: Insufficient disk space"; exit 1; }

# Execute backup
echo "Starting full backup at $(date)"
pg_dump -h localhost -U backup_user -Fc -f ${BACKUP_DIR}/${DB_NAME}_${DATE}.dump $DB_NAME

# Verify backup
if [ $? -eq 0 ]; then
    echo "Backup completed successfully"
    # Calculate checksum
    sha256sum ${BACKUP_DIR}/${DB_NAME}_${DATE}.dump > ${BACKUP_DIR}/${DB_NAME}_${DATE}.sha256
    
    # Upload to S3
    aws s3 cp ${BACKUP_DIR}/${DB_NAME}_${DATE}.dump ${S3_BUCKET}/ --storage-class STANDARD
    aws s3 cp ${BACKUP_DIR}/${DB_NAME}_${DATE}.sha256 ${S3_BUCKET}/
    
    # Replicate to DR region
    aws s3 cp ${S3_BUCKET}/${DB_NAME}_${DATE}.dump s3://company-backups-dr/database/full/ --region us-west-2
    
    # Log success
    echo "Backup uploaded to S3 at $(date)"
else
    echo "ERROR: Backup failed"
    # Send alert
    /usr/local/bin/send-alert "Database backup failed"
    exit 1
fi

# Cleanup old local backups (keep 3 days locally)
find ${BACKUP_DIR} -name "*.dump" -mtime +3 -delete

echo "Backup process completed at $(date)"
```

**Post-Backup Validation:**
- [ ] Verify backup file exists and size is reasonable
- [ ] Verify checksum
- [ ] Verify upload to primary storage
- [ ] Verify replication to secondary storage
- [ ] Verify backup catalog updated
- [ ] Review logs for errors

### Transaction Log Backup (Continuous)

**Frequency:** Every 15 minutes
**Expected Duration:** 5 minutes
**Expected Size:** ~5 GB

```bash
#!/bin/bash
# Transaction log backup (runs every 15 minutes via cron)

DATE=$(date +%Y%m%d_%H%M%S)
LOG_BACKUP_DIR="/backups/logs"
S3_BUCKET="s3://company-backups/database/logs"

# PostgreSQL WAL archiving
# Configured in postgresql.conf:
# archive_mode = on
# archive_command = 'aws s3 cp %p s3://company-backups/database/logs/%f'

# For SQL Server
# sqlcmd -Q "BACKUP LOG production_db TO DISK='${LOG_BACKUP_DIR}/log_${DATE}.trn'"

# Upload to S3
aws s3 sync ${LOG_BACKUP_DIR}/ ${S3_BUCKET}/ --storage-class STANDARD

# Cleanup old logs (keep 7 days)
find ${LOG_BACKUP_DIR} -name "*.trn" -mtime +7 -delete
```

### Snapshot Backup (Hourly)

**For cloud databases with snapshot capability:**
```bash
#!/bin/bash
# Create EBS snapshot (AWS RDS/EC2)

INSTANCE_ID="i-1234567890abcdef"
DESCRIPTION="Hourly snapshot $(date +%Y-%m-%d_%H:%M)"

# Create snapshot
SNAPSHOT_ID=$(aws ec2 create-snapshot \
    --volume-id vol-1234567890abcdef \
    --description "$DESCRIPTION" \
    --tag-specifications "ResourceType=snapshot,Tags=[{Key=Name,Value=hourly-backup}]" \
    --query 'SnapshotId' \
    --output text)

echo "Snapshot created: $SNAPSHOT_ID"

# Cleanup old snapshots (keep 24 hours)
aws ec2 describe-snapshots --owner-ids self \
    --filters "Name=tag:Name,Values=hourly-backup" \
    --query "Snapshots[?StartTime<'$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)'].SnapshotId" \
    --output text | xargs -n 1 aws ec2 delete-snapshot --snapshot-id
```

---

## Backup Monitoring and Validation

### Automated Monitoring
| Check | Frequency | Alert Threshold | Action |
|-------|-----------|-----------------|--------|
| Backup completion | After each backup | Failure or > 10% duration increase | Page on-call DBA |
| Backup size | After each backup | > 20% variance from average | Investigate |
| Storage capacity | Daily | < 20% free space | Expand storage |
| Backup integrity | Daily | Checksum mismatch | Re-run backup |
| Replication lag | Hourly | > 1 hour delay | Check network/storage |

### Backup Validation Testing
**Monthly Validation:**
- **Date:** First Saturday of each month
- **Process:**
  1. Select random backup from previous month
  2. Restore to isolated test environment
  3. Verify data integrity (row counts, checksums)
  4. Run application smoke tests
  5. Document results

**Validation Checklist:**
- [ ] Backup file downloaded successfully
- [ ] Checksum validated
- [ ] Restore completed without errors
- [ ] Database online and accessible
- [ ] Row counts match source (at time of backup)
- [ ] Application can connect and query
- [ ] Performance is acceptable
- [ ] Restore time within RTO

**Validation Log:**
| Date | Backup Date | Restore Duration | Data Integrity | Application Tests | Result | Notes |
|------|-------------|------------------|----------------|-------------------|--------|-------|
| 2024-01-06 | 2023-12-15 | 45 mins | ✓ Pass | ✓ Pass | Success | |
| [Date] | [Backup] | [Duration] | [Pass/Fail] | [Pass/Fail] | [Result] | [Notes] |

### Backup Reporting
**Daily Report:**
- Backup jobs executed (success/fail)
- Duration and size of each backup
- Storage utilization
- Any errors or warnings

**Monthly Report:**
- Backup success rate
- Average backup duration
- Storage growth trends
- Validation test results
- Compliance status

---

## Recovery Procedures

### Recovery Scenarios

#### Scenario 1: Complete Database Loss
**Situation:** Database server fails completely, data is unrecoverable
**RTO:** 1 hour
**RPO:** 15 minutes

**Recovery Steps:**
1. **Assess Situation** (5 minutes)
   - Confirm database is irrecoverable
   - Get management approval to initiate DR
   - Notify stakeholders of expected downtime

2. **Provision New Server** (15 minutes)
   - Deploy new database server (from template/image)
   - Configure network, storage, OS
   - Install database software (if not in image)

3. **Restore Latest Full Backup** (30 minutes)
   ```bash
   # Download backup from S3
   aws s3 cp s3://company-backups/database/full/production_db_20240115_010000.dump /restore/
   
   # Verify checksum
   sha256sum -c production_db_20240115_010000.sha256
   
   # Restore database
   pg_restore -h localhost -U postgres -d production_db -Fc /restore/production_db_20240115_010000.dump
   ```

4. **Apply Transaction Logs** (10 minutes)
   ```bash
   # Restore to point in time
   # Apply WAL files up to failure point
   pg_restore --recovery-target-time='2024-01-15 14:30:00' ...
   ```

5. **Validate and Verify** (5 minutes)
   - [ ] Database online
   - [ ] Run validation queries
   - [ ] Check row counts
   - [ ] Verify replication (if applicable)
   - [ ] Smoke test application

6. **Cutover** (5 minutes)
   - Update DNS or connection strings
   - Restart applications
   - Monitor error logs

**Total Estimated Time:** 60 minutes (within 1-hour RTO)

#### Scenario 2: Corrupted Table/Data
**Situation:** Single table corrupted, rest of database OK
**RTO:** 30 minutes
**RPO:** 15 minutes

**Recovery Steps:**
1. **Isolate Issue**
   - Identify affected table(s)
   - Stop application writes to affected table

2. **Restore to Parallel Database**
   - Restore latest backup to temporary database instance
   - Apply transaction logs to point before corruption

3. **Extract Table Data**
   ```bash
   pg_dump -h temp-db -U postgres -t corrupted_table production_db > table_dump.sql
   ```

4. **Restore Table to Production**
   ```sql
   BEGIN TRANSACTION;
   -- Backup current table (in case of issues)
   CREATE TABLE corrupted_table_backup AS SELECT * FROM corrupted_table;
   
   -- Truncate and restore
   TRUNCATE TABLE corrupted_table;
   \i table_dump.sql
   
   -- Validate
   SELECT COUNT(*) FROM corrupted_table;
   
   COMMIT;
   ```

5. **Verify and Resume**
   - Validate data integrity
   - Resume application writes
   - Monitor for issues

#### Scenario 3: Accidental Data Deletion
**Situation:** User accidentally deleted critical data
**RTO:** 15 minutes
**RPO:** Last backup (worst case 1 hour)

**Recovery Steps:**
1. **Determine Deletion Time**
   - Check audit logs
   - Identify what was deleted

2. **Point-in-Time Restore** (if transaction logs available)
   ```sql
   -- Restore to just before deletion
   pg_restore --recovery-target-time='2024-01-15 13:45:00' ...
   ```

3. **Selective Restore**
   - Restore deleted rows from backup to temporary table
   - Merge back into production table
   ```sql
   INSERT INTO production_table
   SELECT * FROM temp_restore_table
   WHERE id NOT IN (SELECT id FROM production_table);
   ```

#### Scenario 4: Ransomware Attack
**Situation:** Database encrypted by ransomware
**RTO:** 2 hours
**RPO:** Last clean backup

**Recovery Steps:**
1. **Isolate System**
   - Disconnect infected server from network
   - Prevent spread to backups
   - Notify security team

2. **Verify Backup Integrity**
   - Confirm backups are not encrypted
   - Test restore on isolated system

3. **Rebuild Server**
   - Wipe and rebuild database server
   - Patch all vulnerabilities
   - Harden security

4. **Restore from Clean Backup**
   - Restore from last verified clean backup
   - Apply transaction logs (if not infected)

5. **Security Validation**
   - Scan restored database for malware
   - Change all credentials
   - Review access logs

6. **Incident Report**
   - Document timeline
   - Identify entry point
   - Implement preventive measures

---

## Disaster Recovery

### DR Site Configuration
| Component | Primary Site | DR Site | Replication |
|-----------|--------------|---------|-------------|
| Database Server | us-east-1 (AWS) | us-west-2 (AWS) | Asynchronous |
| Storage | EBS | EBS | Snapshot replication |
| Backups | S3 us-east-1 | S3 us-west-2 | Cross-region replication |
| Application Servers | us-east-1 | us-west-2 (standby) | AMI replication |

### DR Scenarios

#### Full Site Failure
**Situation:** Primary data center or region unavailable
**RTO:** 4 hours
**RPO:** 15 minutes

**Failover Procedure:**
1. **Declare Disaster** (15 minutes)
   - Incident Commander decision
   - Notify stakeholders
   - Assemble DR team

2. **Verify DR Site** (30 minutes)
   - Confirm DR database is available
   - Check replication lag
   - Verify latest backup in DR region

3. **Promote DR Database** (30 minutes)
   - Stop replication (if active)
   - Promote read replica to primary
   - Verify database is read-write

4. **Update Application Configuration** (60 minutes)
   - Update DNS records (TTL dependent)
   - Update connection strings
   - Start application servers in DR region

5. **Validate** (30 minutes)
   - Test application functionality
   - Verify data integrity
   - Monitor performance

6. **Communicate** (ongoing)
   - Update stakeholders
   - Publish status page
   - Coordinate failback (when primary recovers)

### DR Testing
- **Frequency:** Quarterly
- **Test Type:** Full failover test (off-hours)
- **Scope:** Complete system failover and failback
- **Last Test:** [Date]
- **Next Test:** [Date]
- **Test Results:** [Pass/Fail - link to report]

---

## Roles and Responsibilities

### Backup and Recovery Team
| Role | Name | Responsibilities | Contact | Backup |
|------|------|------------------|---------|--------|
| Backup Administrator | [Name] | Daily backup operations, monitoring | [Email/Phone] | [Name] |
| Database Administrator | [Name] | Restore procedures, validation | [Email/Phone] | [Name] |
| Storage Administrator | [Name] | Backup storage management | [Email/Phone] | [Name] |
| Disaster Recovery Manager | [Name] | DR coordination, testing | [Email/Phone] | [Name] |
| On-Call DBA | [Rotation] | After-hours recovery | [Pager] | [Escalation] |

### RACI Matrix
| Task | Backup Admin | DBA | Storage Admin | DR Manager | IT Manager |
|------|--------------|-----|---------------|------------|------------|
| Daily backups | R | I | C | I | I |
| Backup validation | R | C | I | I | A |
| Restore procedures | C | R | C | I | A |
| DR planning | C | C | C | R | A |
| DR testing | C | R | C | R | A |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

---

## Backup Security

### Encryption
- **At Rest:** AES-256 encryption for all backups
- **In Transit:** TLS 1.2+ for all data transfers
- **Key Management:** AWS KMS with automatic key rotation

### Access Control
| Access Type | Authorized Users | MFA Required | Audit Logged |
|-------------|------------------|--------------|--------------|
| Create backup | Backup service account | No | Yes |
| Download backup | DBAs only | Yes | Yes |
| Restore database | DBAs + Incident Commander | Yes | Yes |
| Delete backup | DBAs (after retention period) | Yes | Yes |
| Access backup storage | Storage admins | Yes | Yes |

### Backup Immutability
- **Object Lock:** Enabled on S3 (governance mode)
- **Lock Duration:** Minimum retention period
- **Prevent Deletion:** Only root account can delete before retention
- **Ransomware Protection:** Backups protected from encryption/deletion

---

## Compliance and Auditing

### Audit Logging
All backup and restore operations are logged:
- Backup start/completion time
- Backup size and duration
- Success/failure status
- User who initiated restore
- Restore target and source
- Validation results

**Log Retention:** 7 years

### Compliance Requirements
| Regulation | Requirement | Implementation | Evidence |
|------------|-------------|----------------|----------|
| SOC 2 | Regular backups | Daily full + continuous logs | Backup logs |
| SOC 2 | Backup testing | Monthly validation | Test reports |
| GDPR | Data recovery capability | Backup and restore procedures | This document |
| [Regulation] | [Requirement] | [How we meet it] | [Proof] |

### Regular Reviews
- **Backup Policy Review:** Annually
- **Procedure Review:** Quarterly
- **DR Plan Review:** Bi-annually
- **Access Review:** Quarterly

---

## Maintenance Windows

### Scheduled Maintenance
| Activity | Frequency | Window | Impact |
|----------|-----------|--------|--------|
| Backup software updates | Quarterly | Sunday 2-4 AM | No impact (backup redundancy) |
| DR testing | Quarterly | Saturday 8 PM - Sunday 8 AM | No production impact |
| Backup validation | Monthly | Any time | No production impact |
| Storage maintenance | As needed | Coordinated with vendors | No impact (replicated storage) |

---

## Escalation Procedures

### Backup Failure Escalation
| Time Since Failure | Action | Notify |
|--------------------|--------|--------|
| Immediate | Automated retry | Backup Admin (alert) |
| 1 hour | Manual intervention | Backup Admin (page) |
| 2 hours | Escalation | DBA, IT Manager |
| 4 hours | Executive notification | CTO |

### Recovery Escalation
| Scenario | Notify Immediately | Escalate After |
|----------|-------------------|----------------|
| Single table restore | DBA | 1 hour (if not resolved) |
| Full database restore | DBA, IT Manager | N/A |
| DR failover | Incident Commander, CTO, All stakeholders | N/A |

---

## Key Performance Indicators (KPIs)

### Backup KPIs
| Metric | Target | Current | Trend | Status |
|--------|--------|---------|-------|--------|
| Backup success rate | 100% | [%] | [↑/↓/→] | [🟢/🟡/🔴] |
| Average backup duration | < 2 hours | [duration] | [↑/↓/→] | [🟢/🟡/🔴] |
| Backup validation success | 100% | [%] | [↑/↓/→] | [🟢/🟡/🔴] |
| Storage utilization | < 80% | [%] | [↑/↓/→] | [🟢/🟡/🔴] |
| Mean Time to Restore (MTTR) | < RTO | [duration] | [↑/↓/→] | [🟢/🟡/🔴] |

### Recovery KPIs
| Metric | Target | Actual (Last Incident) |
|--------|--------|------------------------|
| Recovery Time Objective (RTO) | 1 hour | [actual time] |
| Recovery Point Objective (RPO) | 15 minutes | [actual data loss] |
| DR test success rate | 100% | [%] |

---

## Continuous Improvement

### Lessons Learned
| Date | Incident/Test | Finding | Action Item | Owner | Status |
|------|---------------|---------|-------------|-------|--------|
| [Date] | [Event] | [What we learned] | [Improvement] | [Name] | [Status] |

### Improvement Roadmap
| Improvement | Priority | Timeline | Expected Benefit |
|-------------|----------|----------|------------------|
| Implement automated DR failover | High | Q2 2024 | Reduce RTO from 4h to 30min |
| Add cross-region read replicas | Medium | Q3 2024 | Zero RPO for reads |
| [Improvement] | [Priority] | [Timeline] | [Benefit] |

---

## Appendices

### Appendix A: Backup Scripts
[Location of all backup scripts in source control]

### Appendix B: Restore Runbooks
[Detailed step-by-step procedures for each recovery scenario]

### Appendix C: DR Contact List
[Complete contact information for DR team]

### Appendix D: Vendor Contacts
[Backup software vendors, cloud providers, support contacts]

### Appendix E: Backup Catalog
[Inventory of all backups, locations, and metadata]

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Backup Administrator | | | |
| Database Administrator | | | |
| DR Manager | | | |
| IT Director | | | |
| Security Officer | | | |

---

## Revision History

| Version | Date | Author | Description | Approver |
|---------|------|--------|-------------|----------|
| 1.0 | YYYY-MM-DD | [Name] | Initial version | [Name] |
| | | | | |
