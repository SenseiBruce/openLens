# Data Migration Plan

**Project:** [Project Name]
**Migration:** [Source] → [Target]
**Date:** [YYYY-MM-DD]
**Owner:** [Data Engineer Name]

## Migration Overview
[Brief description of the migration scope and purpose]

## Migration Scope
- **Data Volume:** [X TB / Y million records]
- **Tables/Collections:** [N tables]
- **Migration Window:** [Date range]
- **Downtime Required:** [Yes/No - duration if yes]

## Source System
- **Type:** [MySQL / MongoDB / Legacy System]
- **Version:** [X.Y.Z]
- **Location:** [Connection details]
- **Access:** [Credentials/certificates needed]

## Target System
- **Type:** [PostgreSQL / Snowflake / Cloud Storage]
- **Version:** [X.Y.Z]
- **Location:** [Connection details]
- **Provisioning Status:** [Provisioned / In Progress]

## Migration Strategy
- **Approach:** [Big Bang / Phased / Parallel Run]
- **Method:** [ETL Tool / Custom Scripts / Database Native Tools]
- **Rationale:** [Why this approach was chosen]

## Data Mapping

| Source Table | Target Table | Transformation Required | Notes |
|--------------|--------------|------------------------|-------|
| users | dim_users | Yes - add surrogate key | Split name field |
| orders | fact_orders | Yes - denormalize | Join with products |
| products | dim_products | No | Direct copy |

### Field Mapping: users → dim_users
| Source Field | Target Field | Transformation | Example |
|--------------|--------------|----------------|---------|
| id | user_id_natural | None | 12345 |
| - | user_id_surrogate | Generate UUID | a1b2c3... |
| name | first_name, last_name | SPLIT_NAME() | "John Doe" → "John", "Doe" |
| email | email | LOWER() | "User@Example.com" → "user@example.com" |
| created | created_at | TO_TIMESTAMP() | "2026-01-27" → 2026-01-27 00:00:00 |

## Migration Phases

### Phase 1: Preparation (Week 1-2)
- [ ] Provision target infrastructure
- [ ] Set up migration tooling
- [ ] Create test data subset (10% sample)
- [ ] Develop migration scripts
- [ ] Test migration with sample data
- [ ] Document any issues found

### Phase 2: Validation (Week 3)
- [ ] Run migration on full dataset in non-prod
- [ ] Validate row counts match
- [ ] Verify data types and constraints
- [ ] Check referential integrity
- [ ] Compare data samples (source vs target)
- [ ] Performance test target system

### Phase 3: Execution (Week 4)
- [ ] Freeze source system (if applicable)
- [ ] Take final backup of source
- [ ] Execute production migration
- [ ] Validate data completeness
- [ ] Smoke test critical queries
- [ ] Switch applications to target system

### Phase 4: Post-Migration (Week 5)
- [ ] Monitor target system performance
- [ ] Verify all dependent applications working
- [ ] Keep source system read-only for rollback
- [ ] Final reconciliation report
- [ ] Archive source system

## Data Validation

### Pre-Migration Validation
```sql
-- Record counts
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;

-- Data quality checks
SELECT COUNT(*) FROM users WHERE email IS NULL;
SELECT COUNT(DISTINCT id) FROM users; -- Check for duplicates
```

### Post-Migration Validation
```sql
-- Reconciliation query
SELECT 
    'Row Count Match' AS check_type,
    source.cnt AS source_count,
    target.cnt AS target_count,
    source.cnt - target.cnt AS difference
FROM 
    (SELECT COUNT(*) AS cnt FROM legacy.users) source,
    (SELECT COUNT(*) AS cnt FROM warehouse.dim_users) target;
```

### Validation Criteria
- [ ] Row counts match within tolerance (0.1%)
- [ ] No duplicates introduced
- [ ] All foreign keys valid
- [ ] Data types correct
- [ ] Required fields populated
- [ ] Sample data spot-check (100 random records)

## Rollback Plan

### Rollback Triggers
- Data loss detected (row count mismatch > 1%)
- Critical data corruption found
- Target system performance unacceptable
- Application integration failures

### Rollback Procedure
1. Stop all writes to target system
2. Redirect applications back to source system
3. Document what went wrong
4. Analyze root cause
5. Fix issues and reschedule migration

### Rollback Testing
- [ ] Test rollback procedure in non-prod
- [ ] Verify applications can switch back seamlessly
- [ ] Document rollback time estimate: [X hours]

## Risk Management

| Risk | Probability | Impact | Mitigation | Contingency |
|------|-------------|--------|------------|-------------|
| Data loss during transfer | Low | High | Checksums, transaction logs | Restore from backup |
| Extended downtime | Medium | High | Rehearse migration, parallel run | Fallback to source |
| Performance degradation | Medium | Medium | Load testing, indexing | Scale target resources |
| Schema incompatibility | Low | High | Thorough testing | Schema conversion tool |

## Performance Optimization

### Migration Performance
- **Batch Size:** [10,000 records per batch]
- **Parallelization:** [4 parallel threads]
- **Network:** [Direct connection / VPN / Internet]
- **Expected Duration:** [X hours for full migration]

### Target System Optimization
- [ ] Create indexes after data load (not before)
- [ ] Disable triggers during migration
- [ ] Bulk insert mode enabled
- [ ] Analyze tables after load

## Monitoring

### Migration Monitoring
- **Progress Tracking:** [Dashboard / Log files]
- **Metrics:**
  - Records migrated per minute
  - Current table being processed
  - Estimated time remaining
  - Error count
- **Alerts:**
  - Error rate > 0.1%
  - Migration stalled (no progress for 15 min)
  - Target storage > 80%

## Communication Plan

### Stakeholders
| Stakeholder | Role | Communication Method | Frequency |
|-------------|------|---------------------|-----------|
| Engineering Team | Migration execution | Slack channel | Real-time |
| Product Team | Business impact | Email updates | Daily |
| Executives | Strategic oversight | Status report | Weekly |
| End Users | System availability | Status page | As needed |

### Communication Schedule
- **T-7 days:** Migration announcement
- **T-3 days:** Reminder + preparation checklist
- **T-1 day:** Final confirmation
- **T-0 (Migration Day):** Start notification
- **T+0 (Completion):** Success notification + summary
- **T+7 days:** Post-migration report

## Testing Strategy

### Test Migration (Non-Prod)
- [ ] Migrate 10% sample data
- [ ] Verify transformations correct
- [ ] Test application functionality
- [ ] Measure performance
- [ ] Identify and fix issues

### Full Dress Rehearsal
- [ ] Complete migration in staging environment
- [ ] Full validation suite
- [ ] Application testing by QA team
- [ ] Performance testing
- [ ] Document lessons learned

## Post-Migration Tasks

### Immediate (Day 1-3)
- [ ] Monitor application logs for errors
- [ ] Verify batch jobs running successfully
- [ ] Check system performance metrics
- [ ] Respond to user-reported issues

### Short-term (Week 1-2)
- [ ] Reconciliation report comparing source vs target
- [ ] Archive source system data
- [ ] Remove migration scripts and staging data
- [ ] Update documentation with new connection details

### Long-term (Month 1-3)
- [ ] Decommission source system (after approval)
- [ ] Final audit of migrated data
- [ ] Retrospective meeting
- [ ] Document lessons learned

## Success Criteria
- [ ] 100% of in-scope data migrated successfully
- [ ] Zero critical data quality issues
- [ ] All applications functioning correctly
- [ ] Downtime within agreed window
- [ ] No rollback required

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Engineering Lead | [Name] | | |
| Application Owner | [Name] | | |
| QA Lead | [Name] | | |
| IT Operations | [Name] | | |

## Appendix

### Migration Scripts
- Script location: [Repository/path]
- Version control: [Git commit hash]
- Backup location: [Path]

### Runbook
See: [Link to detailed runbook]

### Contact List
- **Migration Lead:** [Name] - [Phone] - [Email]
- **DBA:** [Name] - [Phone] - [Email]
- **On-Call:** [Rotation schedule]
