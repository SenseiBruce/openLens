# Data Dictionary

**Project:** [Project Name]
**Database/Dataset:** [Name]
**Version:** [X.Y.Z]
**Last Updated:** [YYYY-MM-DD]

## Overview
[Brief description of the database/dataset purpose]

## Tables/Entities

### Table: [table_name]
**Purpose:** [Description of what this table stores]

**Relationships:**
- Foreign Key to [other_table.column]
- Referenced by [other_table.column]

| Column Name | Data Type | Nullable | Default | Description | Example | Constraints |
|-------------|-----------|----------|---------|-------------|---------|-------------|
| id | INTEGER | No | AUTO | Unique identifier | 12345 | PRIMARY KEY |
| user_email | VARCHAR(255) | No | - | User's email address | user@example.com | UNIQUE, INDEX |
| created_at | TIMESTAMP | No | NOW() | Record creation time | 2026-01-27 10:30:00 | INDEX |
| status | VARCHAR(20) | No | 'active' | Account status | active | CHECK IN ('active','inactive','suspended') |
| metadata | JSON | Yes | NULL | Additional user metadata | {"plan": "pro"} | - |

### Table: [second_table]
[Same structure as above]

## Enumerations

### Status Values
| Value | Description | Used In |
|-------|-------------|---------|
| active | Account is active | users.status |
| inactive | Account is inactive | users.status |
| suspended | Account suspended | users.status |

## Data Types Reference
- **TIMESTAMP:** UTC timezone, ISO 8601 format
- **JSON:** Stored as JSONB in PostgreSQL
- **VARCHAR(N):** Maximum N characters

## Naming Conventions
- **Tables:** Plural, snake_case (e.g., user_profiles)
- **Columns:** snake_case (e.g., created_at)
- **Indexes:** idx_{table}_{column(s)} (e.g., idx_users_email)
- **Foreign Keys:** fk_{table}_{referenced_table} (e.g., fk_orders_users)

## Business Rules
1. **User Email:** Must be unique across system
2. **Created At:** Immutable after record creation
3. **Status:** Can transition from active→inactive→suspended, but not backward without approval

## Data Retention
| Table | Retention Period | Archive Strategy |
|-------|-----------------|------------------|
| users | Indefinite | - |
| audit_logs | 7 years | Move to cold storage after 2 years |

## Access Control
| Table | Read Access | Write Access |
|-------|-------------|--------------|
| users | All authenticated users | Admin only |
| audit_logs | Admin only | System only |

## Change Log
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-01-27 | Initial version | [Name] |
