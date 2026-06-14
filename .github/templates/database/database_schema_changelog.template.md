# Database Schema Changelog

## Document Information
- **Project Name:** [Project Name]
- **Database Name:** [Database Name]
- **Version:** [Current Schema Version]
- **Date:** [Current Date]
- **Maintainer:** [Name/Team]

---

## Overview

This document tracks all schema changes applied to the `[Database Name]` database. Each change is assigned a unique version number and includes details about what was changed, why, and by whom.

### Schema Version History
| Version | Date Applied | Author | Type | Description | Rollback Available |
|---------|--------------|--------|------|-------------|-------------------|
| 1.0.0 | YYYY-MM-DD | [Name] | Initial | Initial database creation | No |
| 1.1.0 | YYYY-MM-DD | [Name] | Feature | Added user authentication tables | Yes |
| 1.1.1 | YYYY-MM-DD | [Name] | Hotfix | Fixed email column length | Yes |
| 1.2.0 | YYYY-MM-DD | [Name] | Feature | Added product catalog schema | Yes |

**Current Schema Version:** [X.Y.Z]
**Last Updated:** [YYYY-MM-DD]

---

## Versioning Strategy

### Version Number Format
**Major.Minor.Patch** (e.g., 2.5.3)

- **Major (X.0.0):** Breaking changes, major refactoring, data migration required
- **Minor (X.Y.0):** New tables, columns, indexes (backward compatible, optional data migration)
- **Patch (X.Y.Z):** Bug fixes, constraint changes, small optimizations (fully backward compatible)

### Change Types
| Type | Description | Examples |
|------|-------------|----------|
| **Feature** | New functionality, new tables/columns | Adding user_roles table |
| **Enhancement** | Improvements to existing schema | Adding index for performance |
| **Bugfix** | Correcting errors | Fixing incorrect data type |
| **Hotfix** | Urgent production fix | Emergency constraint fix |
| **Refactor** | Structural changes without functional changes | Renaming columns for consistency |
| **Deprecation** | Marking schema objects for future removal | Deprecating old_users table |
| **Migration** | Data migration without schema change | Backfilling data |

---

## Change Log

### Version 1.2.0 - [YYYY-MM-DD]
**Author:** [Author Name]
**Type:** Feature
**Status:** Applied
**Ticket:** [JIRA-123]

#### Summary
Added product catalog functionality with support for categories, tags, and inventory tracking.

#### Changes
- **New Tables:**
  - `products` - Product master data
  - `product_categories` - Product categorization
  - `product_tags` - Tagging system
  - `inventory` - Inventory tracking
  
- **New Columns:**
  - None
  
- **New Indexes:**
  - `idx_products_category_id` on `products(category_id)`
  - `idx_products_sku` on `products(sku)` (UNIQUE)
  - `idx_inventory_product_id` on `inventory(product_id)`
  
- **New Constraints:**
  - `products.sku` must be unique
  - `products.price` must be >= 0
  - `inventory.quantity` must be >= 0

#### Migration Scripts

**Forward Migration:**
```sql
-- Version: 1.2.0
-- Description: Add product catalog schema
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Create product_categories table
CREATE TABLE product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES product_categories(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id BIGINT NOT NULL REFERENCES product_categories(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);

-- Create product_tags table
CREATE TABLE product_tags (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id, tag)
);

CREATE INDEX idx_product_tags_tag ON product_tags(tag);

-- Create inventory table
CREATE TABLE inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id),
    warehouse_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);

-- Update schema version
INSERT INTO schema_version (version, description, applied_at, applied_by)
VALUES ('1.2.0', 'Add product catalog schema', CURRENT_TIMESTAMP, CURRENT_USER);

COMMIT;
```

**Rollback Script:**
```sql
-- Rollback Version: 1.2.0
-- Description: Remove product catalog schema
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;

-- Remove schema version entry
DELETE FROM schema_version WHERE version = '1.2.0';

COMMIT;
```

#### Validation
```sql
-- Validate version 1.2.0 deployment

-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'product_categories', 'product_tags', 'inventory');
-- Expected: 4 rows

-- Check indexes exist
SELECT indexname FROM pg_indexes
WHERE tablename = 'products'
AND indexname LIKE 'idx_products_%';
-- Expected: 3 rows (category_id, sku, name)

-- Check constraints
SELECT conname FROM pg_constraint
WHERE conname IN ('products_sku_key', 'products_price_check', 'inventory_quantity_check');
-- Expected: 3 rows
```

#### Impact Assessment
- **Downtime Required:** No
- **Data Migration:** No existing data to migrate
- **Application Changes Required:** Yes - new product catalog APIs
- **Performance Impact:** Minimal - new tables, no existing data
- **Rollback Risk:** Low - new tables only, no modifications to existing schema

---

### Version 1.1.1 - [YYYY-MM-DD]
**Author:** [Author Name]
**Type:** Bugfix
**Status:** Applied
**Ticket:** [JIRA-456]

#### Summary
Fixed `users.email` column length - increased from VARCHAR(100) to VARCHAR(255) to support longer email addresses.

#### Changes
- **Modified Columns:**
  - `users.email` - Changed from VARCHAR(100) to VARCHAR(255)

#### Migration Scripts

**Forward Migration:**
```sql
-- Version: 1.1.1
-- Description: Fix users.email column length
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Increase email column length
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);

-- Update schema version
INSERT INTO schema_version (version, description, applied_at, applied_by)
VALUES ('1.1.1', 'Fix users.email column length', CURRENT_TIMESTAMP, CURRENT_USER);

COMMIT;
```

**Rollback Script:**
```sql
-- Rollback Version: 1.1.1
-- Description: Revert users.email column length
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Check for emails longer than 100 characters
SELECT COUNT(*) FROM users WHERE LENGTH(email) > 100;
-- If count > 0, rollback will fail data integrity

-- Revert email column length (only if no emails > 100 chars)
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(100);

-- Remove schema version entry
DELETE FROM schema_version WHERE version = '1.1.1';

COMMIT;
```

#### Validation
```sql
-- Validate version 1.1.1 deployment

-- Check column type
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'email';
-- Expected: email, character varying, 255
```

#### Impact Assessment
- **Downtime Required:** No
- **Data Migration:** No - compatible change
- **Application Changes Required:** No
- **Performance Impact:** None
- **Rollback Risk:** Low (unless emails > 100 chars exist)

---

### Version 1.1.0 - [YYYY-MM-DD]
**Author:** [Author Name]
**Type:** Feature
**Status:** Applied
**Ticket:** [JIRA-789]

#### Summary
Added user authentication and authorization tables supporting role-based access control.

#### Changes
- **New Tables:**
  - `user_roles` - User role assignments
  - `permissions` - Permission definitions
  - `role_permissions` - Role-permission mappings
  
- **Modified Tables:**
  - `users` - Added `password_hash`, `last_login`, `is_active` columns
  
- **New Indexes:**
  - `idx_user_roles_user_id` on `user_roles(user_id)`
  - `idx_user_roles_role_id` on `user_roles(role_id)`

#### Migration Scripts

**Forward Migration:**
```sql
-- Version: 1.1.0
-- Description: Add authentication and authorization tables
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Add authentication columns to users table
ALTER TABLE users
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN last_login TIMESTAMP,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0,
ADD COLUMN locked_until TIMESTAMP;

-- Create user_roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT REFERENCES users(id),
    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- Create permissions table
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(100),
    action VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions table
CREATE TABLE role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- Seed default roles and permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('users.read', 'Read user data', 'users', 'read'),
('users.write', 'Create and update users', 'users', 'write'),
('users.delete', 'Delete users', 'users', 'delete'),
('products.read', 'Read product data', 'products', 'read'),
('products.write', 'Create and update products', 'products', 'write');

INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
UNION ALL
SELECT 'user', id FROM permissions WHERE action = 'read';

-- Update schema version
INSERT INTO schema_version (version, description, applied_at, applied_by)
VALUES ('1.1.0', 'Add authentication and authorization', CURRENT_TIMESTAMP, CURRENT_USER);

COMMIT;
```

**Rollback Script:**
```sql
-- Rollback Version: 1.1.0
-- Description: Remove authentication and authorization tables
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Drop tables
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS user_roles;

-- Remove columns from users table
ALTER TABLE users
DROP COLUMN password_hash,
DROP COLUMN last_login,
DROP COLUMN is_active,
DROP COLUMN failed_login_attempts,
DROP COLUMN locked_until;

-- Remove schema version entry
DELETE FROM schema_version WHERE version = '1.1.0';

COMMIT;
```

#### Validation
```sql
-- Validate version 1.1.0 deployment

-- Check new tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_roles', 'permissions', 'role_permissions');
-- Expected: 3 rows

-- Check new columns on users table
SELECT column_name FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('password_hash', 'last_login', 'is_active');
-- Expected: 3 rows

-- Check seed data
SELECT COUNT(*) FROM permissions;
-- Expected: 5 rows

SELECT COUNT(*) FROM role_permissions;
-- Expected: 8 rows (admin: 5, user: 3)
```

#### Impact Assessment
- **Downtime Required:** No
- **Data Migration:** No - new tables only
- **Application Changes Required:** Yes - authentication system implementation
- **Performance Impact:** Minimal
- **Rollback Risk:** Low

---

### Version 1.0.0 - [YYYY-MM-DD]
**Author:** [Author Name]
**Type:** Initial
**Status:** Applied
**Ticket:** [JIRA-001]

#### Summary
Initial database schema creation with core tables for user management.

#### Changes
- **New Tables:**
  - `users` - User accounts
  - `schema_version` - Track schema changes
  
#### Migration Scripts

**Forward Migration:**
```sql
-- Version: 1.0.0
-- Description: Initial database schema
-- Author: [Author Name]
-- Date: YYYY-MM-DD

BEGIN TRANSACTION;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Create schema_version tracking table
CREATE TABLE schema_version (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100) NOT NULL
);

-- Record initial version
INSERT INTO schema_version (version, description, applied_by)
VALUES ('1.0.0', 'Initial database schema', CURRENT_USER);

COMMIT;
```

**Rollback Script:**
```sql
-- Rollback Version: 1.0.0
-- Description: Drop initial schema
-- Author: [Author Name]
-- Date: YYYY-MM-DD

-- WARNING: This will delete all data!

BEGIN TRANSACTION;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schema_version;

COMMIT;
```

#### Validation
```sql
-- Validate version 1.0.0 deployment

-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'schema_version');
-- Expected: 2 rows

-- Check schema version recorded
SELECT * FROM schema_version WHERE version = '1.0.0';
-- Expected: 1 row
```

---

## Pending Changes

### Version 1.3.0 - [Planned for YYYY-MM-DD]
**Author:** [Author Name]
**Type:** Feature
**Status:** In Development
**Ticket:** [JIRA-999]

#### Summary
Add audit logging for all table changes.

#### Planned Changes
- **New Tables:**
  - `audit_log` - Comprehensive audit trail
  
- **New Triggers:**
  - Audit triggers on `users`, `products`, `orders` tables
  
#### Estimated Impact
- **Downtime Required:** No
- **Performance Impact:** Minimal (<5% write overhead)
- **Storage Impact:** ~10 GB per month

---

## Deprecation Log

### Deprecated Objects
| Object Type | Object Name | Deprecated In | Reason | Replacement | Removal Planned |
|-------------|-------------|---------------|--------|-------------|-----------------|
| Table | `old_users` | 1.1.0 | Restructured | `users` table | 2.0.0 |
| Column | `users.username` | 1.1.0 | Using email instead | `users.email` | 2.0.0 |
| Index | `idx_old_users_id` | 1.1.0 | Table deprecated | N/A | 2.0.0 |

### Deprecation Policy
- Deprecated objects marked with `_deprecated` suffix
- Minimum 2 major versions before removal
- Application warnings logged when deprecated objects are accessed
- Migration guide provided in release notes

---

## Schema Diagram

### Current Schema (Version 1.2.0)
```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ first_name      │
│ last_name       │
│ password_hash   │
│ last_login      │
│ is_active       │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  user_roles     │
├─────────────────┤
│ user_id (FK)    │
│ role            │
│ assigned_at     │
│ assigned_by (FK)│
└─────────────────┘

┌──────────────────┐        ┌──────────────────┐
│ product_         │   1:N  │    products      │
│ categories       │◄───────┤                  │
├──────────────────┤        ├──────────────────┤
│ id (PK)          │        │ id (PK)          │
│ name             │        │ sku (UNIQUE)     │
│ description      │        │ name             │
│ parent_id (FK)   │        │ description      │
│ created_at       │        │ price            │
│ updated_at       │        │ category_id (FK) │
└──────────────────┘        │ is_active        │
                            │ created_at       │
                            │ updated_at       │
                            └────────┬─────────┘
                                     │
                                     │ 1:N
                                     ▼
                            ┌──────────────────┐
                            │  product_tags    │
                            ├──────────────────┤
                            │ product_id (FK)  │
                            │ tag              │
                            └──────────────────┘
                                     
                            ┌──────────────────┐
                            │   inventory      │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ product_id (FK)  │
                            │ warehouse_id     │
                            │ quantity         │
                            │ reserved_qty     │
                            │ last_updated     │
                            └──────────────────┘
```

---

## Migration Process

### Development Environment
1. Developer creates migration script (up and down)
2. Developer tests migration locally
3. Code review (SQL review + impact assessment)
4. Merge to main branch

### Staging Environment
1. Automated deployment via CI/CD
2. Migration runs during deployment
3. Validation queries executed
4. Smoke tests run

### Production Environment
1. Change management approval required
2. Maintenance window scheduled (if downtime required)
3. Pre-migration backup
4. Migration executed
5. Validation queries executed
6. Rollback script ready (tested in staging)
7. Monitor for 24 hours

### Migration Tools
- **Tool:** [Flyway | Liquibase | Alembic | Custom scripts]
- **Version Control:** Git repository
- **Location:** `/database/migrations/`

---

## Testing Requirements

### Pre-Deployment Testing
- [ ] Migration script syntax validated
- [ ] Rollback script tested in staging
- [ ] Validation queries executed successfully
- [ ] Performance impact assessed (EXPLAIN ANALYZE on large tables)
- [ ] Application compatibility verified
- [ ] Backup and restore tested

### Post-Deployment Validation
- [ ] Schema version updated correctly
- [ ] All tables, columns, indexes created/modified
- [ ] Constraints enforced correctly
- [ ] Application tests pass
- [ ] Performance benchmarks meet thresholds
- [ ] No errors in database logs

---

## Rollback Procedures

### When to Rollback
- Migration fails mid-execution
- Validation queries fail
- Critical application errors after deployment
- Performance degradation > 20%
- Data integrity issues detected

### Rollback Steps
1. **Stop Application** (if writes would cause data inconsistency)
2. **Execute Rollback Script** (pre-tested in staging)
3. **Validate Rollback** (run validation queries)
4. **Restore Application** (restart or redeploy)
5. **Post-Mortem** (analyze what went wrong)

### Rollback Risks
- Rollback may not be possible if data has been modified in incompatible ways
- Always test rollback in staging with production-like data
- Some changes (e.g., dropping columns) may result in data loss

---

## Best Practices

### Migration Script Guidelines
1. **Always use transactions** (BEGIN...COMMIT)
2. **Include version number and description** in comments
3. **Make migrations idempotent** where possible
4. **Use IF EXISTS/IF NOT EXISTS** for drops and creates
5. **Add indexes CONCURRENTLY** to avoid locking (PostgreSQL)
6. **Test with production-sized data** in staging
7. **Avoid long-running migrations** during peak hours

### Naming Conventions
- Migration files: `V{version}__{description}.sql` (e.g., `V1.2.0__add_product_catalog.sql`)
- Tables: `snake_case` (e.g., `user_roles`)
- Columns: `snake_case` (e.g., `created_at`)
- Indexes: `idx_{table}_{columns}` (e.g., `idx_users_email`)
- Foreign Keys: `fk_{table}_{referenced_table}` (e.g., `fk_orders_users`)
- Constraints: `chk_{table}_{constraint}` (e.g., `chk_products_price`)

### Performance Considerations
- **Large table alterations:** Consider table locks, use non-locking methods when available
- **Index creation:** Use `CREATE INDEX CONCURRENTLY` (PostgreSQL)
- **Data backfill:** Batch in chunks to avoid long transactions
- **Maintenance window:** Schedule large changes during low-traffic periods

---

## Contacts

### Schema Change Approvers
| Role | Name | Email | Approval Required For |
|------|------|-------|----------------------|
| Database Architect | [Name] | [Email] | Major versions, breaking changes |
| Lead DBA | [Name] | [Email] | All production changes |
| Security Engineer | [Name] | [Email] | Changes affecting security/audit |
| Application Lead | [Name] | [Email] | Changes affecting application compatibility |

### Emergency Contacts
| Role | Name | Phone | Escalation |
|------|------|-------|------------|
| On-Call DBA | [Rotation] | [Phone] | Primary |
| Database Manager | [Name] | [Phone] | Secondary |

---

## Appendices

### Appendix A: Migration Script Template
```sql
-- Version: X.Y.Z
-- Description: [Brief description]
-- Author: [Author Name]
-- Date: YYYY-MM-DD
-- Ticket: [JIRA-###]

BEGIN TRANSACTION;

-- ============================================
-- MIGRATION SCRIPT
-- ============================================

-- [Your migration SQL here]

-- ============================================
-- UPDATE SCHEMA VERSION
-- ============================================
INSERT INTO schema_version (version, description, applied_at, applied_by)
VALUES ('X.Y.Z', '[Description]', CURRENT_TIMESTAMP, CURRENT_USER);

COMMIT;

-- ============================================
-- VALIDATION QUERIES
-- ============================================
-- [Queries to validate migration success]

-- ============================================
-- ROLLBACK SCRIPT (keep in separate file)
-- ============================================
-- See: rollback_vX.Y.Z.sql
```

### Appendix B: Schema Version Query
```sql
-- Get current schema version
SELECT version, description, applied_at, applied_by
FROM schema_version
ORDER BY applied_at DESC
LIMIT 1;

-- Get all schema versions
SELECT * FROM schema_version ORDER BY applied_at;
```

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | YYYY-MM-DD | [Name] | Initial changelog document |
| | | | |
