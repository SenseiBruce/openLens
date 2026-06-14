# Metadata Schema

## Schema Information
- **Schema Name:** [Schema name]
- **Version:** [Version number]
- **Last Updated:** [Date]
- **Author:** [Name]
- **Status:** [Draft/Active/Deprecated]

## Purpose
This document defines the metadata schema for [System/Dataset/Application name], including:
- Required and optional metadata fields
- Data types and formats
- Validation rules
- Usage guidelines
- Governance policies

## Schema Overview

### Scope
This schema applies to:
- [Content types/datasets/objects covered]
- [Systems or applications using this schema]
- [User roles responsible for metadata]

### Metadata Categories
1. **Descriptive Metadata:** What the resource is about
2. **Administrative Metadata:** How to manage the resource
3. **Structural Metadata:** How the resource is organized
4. **Technical Metadata:** How the resource was created
5. **Rights Metadata:** Who can access the resource

## Core Metadata Fields

### 1. Descriptive Metadata

#### Title
- **Field Name:** `title`
- **Description:** Primary name of the resource
- **Data Type:** String
- **Max Length:** 255 characters
- **Required:** Yes
- **Repeatable:** No
- **Example:** `"Q4 2023 Sales Report"`
- **Validation:** Must not be empty, no leading/trailing whitespace
- **Index:** Full-text searchable

#### Description
- **Field Name:** `description`
- **Description:** Summary or abstract of the resource content
- **Data Type:** Text
- **Max Length:** 5000 characters
- **Required:** Yes
- **Repeatable:** No
- **Example:** `"Comprehensive analysis of sales performance across all regions for Q4 2023, including trend analysis and forecasts."`
- **Validation:** Minimum 10 characters
- **Index:** Full-text searchable

#### Keywords/Tags
- **Field Name:** `keywords`
- **Description:** Terms describing the subject matter
- **Data Type:** Array of strings
- **Min Items:** 3
- **Max Items:** 20
- **Required:** Yes
- **Repeatable:** Yes
- **Example:** `["sales", "revenue", "quarterly-report", "2023", "analysis"]`
- **Validation:** 
  - Each keyword: 2-50 characters
  - Lowercase
  - Alphanumeric plus hyphens
  - No duplicates
- **Controlled:** Use approved taxonomy when available
- **Index:** Keyword searchable

#### Subject
- **Field Name:** `subject`
- **Description:** Topical classification from controlled vocabulary
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Repeatable:** Yes
- **Allowed Values:**
  - `Finance`
  - `Marketing`
  - `Operations`
  - `Human Resources`
  - `Technology`
  - `Legal`
  - `Sales`
- **Example:** `"Sales"`
- **Validation:** Must match allowed values
- **Index:** Faceted

#### Language
- **Field Name:** `language`
- **Description:** Primary language of the content
- **Data Type:** String (ISO 639-1 code)
- **Required:** Yes
- **Repeatable:** No
- **Example:** `"en"` (English)
- **Validation:** Must be valid ISO 639-1 code
- **Index:** Faceted

### 2. Administrative Metadata

#### Identifier
- **Field Name:** `id`
- **Description:** Unique identifier for the resource
- **Data Type:** String (UUID)
- **Required:** Yes (auto-generated)
- **Repeatable:** No
- **Example:** `"550e8400-e29b-41d4-a716-446655440000"`
- **Validation:** Must be valid UUID v4
- **Index:** Exact match

#### Creator
- **Field Name:** `creator`
- **Description:** Person or system that created the resource
- **Data Type:** Object
- **Required:** Yes
- **Repeatable:** No
- **Structure:**
  ```json
  {
    "id": "user-12345",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "department": "Sales"
  }
  ```
- **Validation:** Valid user ID, email format
- **Index:** Searchable by name and email

#### Contributors
- **Field Name:** `contributors`
- **Description:** Additional people who contributed
- **Data Type:** Array of objects
- **Required:** No
- **Repeatable:** Yes
- **Structure:** Same as creator
- **Example:**
  ```json
  [
    {"id": "user-67890", "name": "John Doe", "email": "john.doe@example.com"},
    {"id": "user-11111", "name": "Alice Johnson", "email": "alice.j@example.com"}
  ]
  ```
- **Index:** Searchable by name and email

#### Owner
- **Field Name:** `owner`
- **Description:** Person or team responsible for the resource
- **Data Type:** Object
- **Required:** Yes
- **Repeatable:** No
- **Structure:** Same as creator
- **Validation:** Must be active user/team
- **Index:** Faceted

#### Creation Date
- **Field Name:** `created_at`
- **Description:** When the resource was created
- **Data Type:** DateTime (ISO 8601)
- **Required:** Yes (auto-generated)
- **Repeatable:** No
- **Example:** `"2024-01-15T14:30:00Z"`
- **Validation:** Valid ISO 8601 datetime, not in future
- **Index:** Range searchable, sortable

#### Modification Date
- **Field Name:** `modified_at`
- **Description:** When the resource was last updated
- **Data Type:** DateTime (ISO 8601)
- **Required:** Yes (auto-updated)
- **Repeatable:** No
- **Example:** `"2024-01-20T09:15:00Z"`
- **Validation:** >= created_at, valid ISO 8601
- **Index:** Range searchable, sortable

#### Publication Date
- **Field Name:** `published_at`
- **Description:** When the resource was published/released
- **Data Type:** DateTime (ISO 8601)
- **Required:** No
- **Repeatable:** No
- **Example:** `"2024-01-22T00:00:00Z"`
- **Validation:** Valid ISO 8601, can be future
- **Index:** Range searchable, sortable

#### Expiration Date
- **Field Name:** `expires_at`
- **Description:** When the resource becomes obsolete
- **Data Type:** DateTime (ISO 8601)
- **Required:** No
- **Repeatable:** No
- **Example:** `"2025-01-22T00:00:00Z"`
- **Validation:** > created_at
- **Index:** Range searchable

#### Status
- **Field Name:** `status`
- **Description:** Current lifecycle status
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Repeatable:** No
- **Allowed Values:**
  - `draft`: Work in progress
  - `review`: Pending approval
  - `approved`: Approved, not yet published
  - `published`: Live and accessible
  - `archived`: Retained but not active
  - `deprecated`: Obsolete, replaced
  - `deleted`: Marked for deletion
- **Example:** `"published"`
- **Validation:** Must match allowed values
- **Index:** Faceted

#### Version
- **Field Name:** `version`
- **Description:** Version number or identifier
- **Data Type:** String
- **Required:** Yes
- **Repeatable:** No
- **Format:** Semantic versioning (major.minor.patch)
- **Example:** `"2.1.0"`
- **Validation:** Must match pattern `^\d+\.\d+\.\d+$`
- **Index:** Exact match, sortable

### 3. Structural Metadata

#### Format
- **Field Name:** `format`
- **Description:** File format or MIME type
- **Data Type:** String
- **Required:** Yes
- **Repeatable:** No
- **Example:** `"application/pdf"` or `"PDF"`
- **Validation:** Valid MIME type or recognized format
- **Index:** Faceted

#### File Size
- **Field Name:** `file_size`
- **Description:** Size of the resource in bytes
- **Data Type:** Integer
- **Required:** Yes (for files)
- **Repeatable:** No
- **Example:** `2457600` (2.4 MB)
- **Validation:** > 0
- **Index:** Range searchable

#### Page Count
- **Field Name:** `page_count`
- **Description:** Number of pages (for documents)
- **Data Type:** Integer
- **Required:** No
- **Repeatable:** No
- **Example:** `42`
- **Validation:** > 0
- **Index:** Range searchable

#### Duration
- **Field Name:** `duration`
- **Description:** Length of audio/video in seconds
- **Data Type:** Integer
- **Required:** No (required for A/V)
- **Repeatable:** No
- **Example:** `3600` (1 hour)
- **Validation:** > 0
- **Index:** Range searchable

#### Related Resources
- **Field Name:** `related_resources`
- **Description:** Links to related content
- **Data Type:** Array of objects
- **Required:** No
- **Repeatable:** Yes
- **Structure:**
  ```json
  [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Q3 2023 Sales Report",
      "relationship": "previous_version"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Sales Methodology Guide",
      "relationship": "referenced_by"
    }
  ]
  ```
- **Relationship Types:**
  - `previous_version`
  - `next_version`
  - `part_of`
  - `has_part`
  - `referenced_by`
  - `references`
  - `replaced_by`
  - `replaces`
- **Index:** Related item IDs searchable

### 4. Technical Metadata

#### Source System
- **Field Name:** `source_system`
- **Description:** System that created or ingested the resource
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Repeatable:** No
- **Allowed Values:**
  - `CRM`
  - `ERP`
  - `CMS`
  - `DMS`
  - `Manual Upload`
  - `API Import`
  - `Email Integration`
- **Example:** `"CRM"`
- **Index:** Faceted

#### Source ID
- **Field Name:** `source_id`
- **Description:** Identifier in the source system
- **Data Type:** String
- **Required:** No
- **Repeatable:** No
- **Example:** `"CRM-12345"`
- **Index:** Exact match

#### Checksum
- **Field Name:** `checksum`
- **Description:** Hash for integrity verification
- **Data Type:** String
- **Required:** Yes (for files)
- **Repeatable:** No
- **Format:** `"algorithm:hash"`
- **Example:** `"sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"`
- **Validation:** Valid hash format
- **Index:** Exact match

#### Encoding
- **Field Name:** `encoding`
- **Description:** Character encoding (for text) or codec (for A/V)
- **Data Type:** String
- **Required:** No
- **Repeatable:** No
- **Example:** `"UTF-8"` or `"H.264"`
- **Index:** Faceted

#### Resolution
- **Field Name:** `resolution`
- **Description:** Image/video resolution
- **Data Type:** String
- **Required:** No (required for images/video)
- **Repeatable:** No
- **Format:** `"width×height"`
- **Example:** `"1920×1080"`
- **Validation:** Pattern `^\d+×\d+$`
- **Index:** Faceted

#### Color Space
- **Field Name:** `color_space`
- **Description:** Color model for images/video
- **Data Type:** String (enumerated)
- **Required:** No
- **Repeatable:** No
- **Allowed Values:** `RGB`, `CMYK`, `Grayscale`, `YUV`
- **Example:** `"RGB"`
- **Index:** Faceted

### 5. Rights Metadata

#### License
- **Field Name:** `license`
- **Description:** Usage license or terms
- **Data Type:** String (enumerated or URL)
- **Required:** Yes
- **Repeatable:** No
- **Allowed Values:**
  - `Proprietary`
  - `CC-BY-4.0`
  - `CC-BY-SA-4.0`
  - `CC-BY-NC-4.0`
  - `MIT`
  - `Apache-2.0`
  - `GPL-3.0`
  - Custom: `[URL to license]`
- **Example:** `"Proprietary"` or `"https://creativecommons.org/licenses/by/4.0/"`
- **Index:** Faceted

#### Access Level
- **Field Name:** `access_level`
- **Description:** Who can access the resource
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Repeatable:** No
- **Allowed Values:**
  - `public`: Anyone
  - `internal`: Any authenticated user
  - `restricted`: Specific users/groups
  - `confidential`: Highly restricted
  - `secret`: Maximum restriction
- **Example:** `"internal"`
- **Validation:** Must match allowed values
- **Index:** Faceted

#### Access Control
- **Field Name:** `access_control`
- **Description:** Users/groups with access
- **Data Type:** Object
- **Required:** If access_level is "restricted"
- **Repeatable:** No
- **Structure:**
  ```json
  {
    "users": ["user-123", "user-456"],
    "groups": ["sales-team", "executives"],
    "roles": ["admin", "manager"]
  }
  ```
- **Index:** User/group IDs searchable

#### Copyright
- **Field Name:** `copyright`
- **Description:** Copyright statement
- **Data Type:** String
- **Required:** No
- **Repeatable:** No
- **Example:** `"© 2024 Example Corporation. All rights reserved."`
- **Max Length:** 500 characters
- **Index:** Full-text searchable

#### Rights Holder
- **Field Name:** `rights_holder`
- **Description:** Entity that owns the rights
- **Data Type:** String
- **Required:** No
- **Repeatable:** No
- **Example:** `"Example Corporation"`
- **Index:** Exact match

### 6. Domain-Specific Metadata

#### Business Metadata (Examples)

##### Department
- **Field Name:** `department`
- **Description:** Business unit or department
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Allowed Values:** [List of departments]
- **Index:** Faceted

##### Cost Center
- **Field Name:** `cost_center`
- **Description:** Financial cost center
- **Data Type:** String
- **Required:** No
- **Format:** `CC-NNNN`
- **Example:** `"CC-1234"`
- **Index:** Exact match

##### Project
- **Field Name:** `project`
- **Description:** Associated project
- **Data Type:** String or Object
- **Required:** No
- **Structure:**
  ```json
  {
    "id": "proj-789",
    "name": "Digital Transformation Initiative",
    "code": "DTI-2024"
  }
  ```
- **Index:** Project ID and name searchable

##### Customer
- **Field Name:** `customer`
- **Description:** Related customer (if applicable)
- **Data Type:** Object
- **Required:** No
- **Structure:**
  ```json
  {
    "id": "cust-456",
    "name": "Acme Corporation",
    "type": "Enterprise"
  }
  ```
- **Index:** Customer ID and name searchable

##### Classification
- **Field Name:** `classification`
- **Description:** Data classification level
- **Data Type:** String (enumerated)
- **Required:** Yes
- **Allowed Values:**
  - `Public`
  - `Internal`
  - `Confidential`
  - `Restricted`
- **Example:** `"Internal"`
- **Index:** Faceted

#### Retention
- **Field Name:** `retention`
- **Description:** Retention policy and period
- **Data Type:** Object
- **Required:** No
- **Structure:**
  ```json
  {
    "policy_id": "RET-001",
    "period_years": 7,
    "destroy_after": "2031-01-15T00:00:00Z",
    "legal_hold": false
  }
  ```
- **Index:** Policy ID, dates searchable

## Custom Metadata

### Extension Mechanism
Allow custom fields while maintaining schema integrity:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Sales Report",
  // ... standard fields ...
  "custom": {
    "region": "North America",
    "sales_manager": "Bob Wilson",
    "quarterly_target": 1000000,
    "custom_metric": "value"
  }
}
```

### Custom Field Guidelines
- Use `custom` namespace for non-standard fields
- Document custom fields in project-specific addendum
- Follow naming conventions: lowercase, underscores
- Limit custom fields to 20 per record
- Do not replicate standard fields in custom namespace

## Complete Schema Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Q4 2023 Sales Performance Report",
  "description": "Comprehensive analysis of sales performance across all regions for Q4 2023, including trend analysis, forecasts, and recommendations.",
  "keywords": ["sales", "revenue", "quarterly-report", "2023", "analysis", "forecast"],
  "subject": "Sales",
  "language": "en",
  
  "creator": {
    "id": "user-12345",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "department": "Sales"
  },
  "contributors": [
    {"id": "user-67890", "name": "John Doe", "email": "john.doe@example.com"}
  ],
  "owner": {
    "id": "user-12345",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "department": "Sales"
  },
  
  "created_at": "2024-01-15T14:30:00Z",
  "modified_at": "2024-01-20T09:15:00Z",
  "published_at": "2024-01-22T00:00:00Z",
  "expires_at": "2025-01-22T00:00:00Z",
  
  "status": "published",
  "version": "2.1.0",
  
  "format": "application/pdf",
  "file_size": 2457600,
  "page_count": 42,
  
  "related_resources": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Q3 2023 Sales Report",
      "relationship": "previous_version"
    }
  ],
  
  "source_system": "CRM",
  "source_id": "CRM-REPORT-2024-001",
  "checksum": "sha256:a3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  
  "license": "Proprietary",
  "access_level": "internal",
  "copyright": "© 2024 Example Corporation. All rights reserved.",
  
  "department": "Sales",
  "cost_center": "CC-1234",
  "project": {
    "id": "proj-789",
    "name": "Q4 Performance Review",
    "code": "QPR-Q4-2023"
  },
  "classification": "Internal",
  "retention": {
    "policy_id": "RET-001",
    "period_years": 7,
    "destroy_after": "2031-01-15T00:00:00Z",
    "legal_hold": false
  },
  
  "custom": {
    "region": "North America",
    "sales_manager": "Bob Wilson",
    "quarterly_target": 1000000
  }
}
```

## Schema Validation

### JSON Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "description", "keywords", "subject", "language", "creator", "owner", "created_at", "modified_at", "status", "version", "format", "license", "access_level", "classification"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255
    },
    "description": {
      "type": "string",
      "minLength": 10,
      "maxLength": 5000
    },
    "keywords": {
      "type": "array",
      "minItems": 3,
      "maxItems": 20,
      "items": {
        "type": "string",
        "pattern": "^[a-z0-9-]{2,50}$"
      },
      "uniqueItems": true
    },
    "subject": {
      "type": "string",
      "enum": ["Finance", "Marketing", "Operations", "Human Resources", "Technology", "Legal", "Sales"]
    },
    "language": {
      "type": "string",
      "pattern": "^[a-z]{2}$"
    },
    "status": {
      "type": "string",
      "enum": ["draft", "review", "approved", "published", "archived", "deprecated", "deleted"]
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "access_level": {
      "type": "string",
      "enum": ["public", "internal", "restricted", "confidential", "secret"]
    }
  }
}
```

### Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, 1-255 chars | "Title is required and must be 1-255 characters" |
| description | Required, 10-5000 chars | "Description must be 10-5000 characters" |
| keywords | 3-20 items, unique | "Provide 3-20 unique keywords" |
| created_at | Valid ISO 8601, not future | "Invalid or future creation date" |
| modified_at | >= created_at | "Modified date cannot be before created date" |
| version | Semantic versioning | "Version must follow format: major.minor.patch" |
| file_size | > 0 | "File size must be positive" |

## Implementation Guidelines

### Metadata Entry
- Use forms with validation
- Provide dropdowns for enumerated fields
- Auto-complete for taxonomy terms
- Auto-generate technical metadata where possible
- Save drafts automatically

### Metadata Quality
- **Completeness:** Track percentage of required fields filled
- **Accuracy:** Periodic review of metadata values
- **Consistency:** Use controlled vocabularies
- **Timeliness:** Update metadata when resource changes

### Metadata Governance
- **Ownership:** Each field has a responsible party
- **Review:** Quarterly metadata quality audits
- **Updates:** Process for schema evolution
- **Training:** Onboarding for content creators

## Schema Versioning

### Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2023-01-01 | Initial schema | Data Team |
| 1.1.0 | 2023-06-15 | Added retention metadata | Legal Team |
| 2.0.0 | 2024-01-15 | Restructured rights metadata (breaking) | Data Team |

### Versioning Policy
- **Major (X.0.0):** Breaking changes, incompatible with previous version
- **Minor (0.X.0):** New fields, backward compatible
- **Patch (0.0.X):** Bug fixes, clarifications, no new fields

### Backward Compatibility
- Maintain compatibility within major version
- Provide migration scripts for major version updates
- Deprecate fields before removal (one major version notice)

## Changelog
| Date | Change | Impact | Author |
|------|--------|--------|--------|
| 2024-01-15 | Added `retention` field | New optional field | Legal |
| 2024-01-10 | Deprecated `legacy_id` | Will be removed in v3.0.0 | Data Team |
| 2023-12-01 | Updated `access_level` enum | Added "secret" value | Security |

## Appendix

### Field Index
Quick reference of all fields:

**Required Fields (25):**
id, title, description, keywords, subject, language, creator, owner, created_at, modified_at, status, version, format, license, access_level, classification

**Optional Fields (35):**
contributors, published_at, expires_at, file_size, page_count, duration, related_resources, source_system, source_id, checksum, encoding, resolution, color_space, access_control, copyright, rights_holder, department, cost_center, project, customer, retention, custom

### Data Type Reference
- **String:** Text (UTF-8)
- **Text:** Long-form text
- **Integer:** Whole number
- **DateTime:** ISO 8601 format
- **UUID:** Universally unique identifier (v4)
- **Array:** Ordered collection
- **Object:** Structured data
- **Enumerated:** Specific allowed values

### External Standards
- **ISO 639-1:** Language codes
- **ISO 8601:** Date and time format
- **MIME types:** Internet media types
- **UUID v4:** Unique identifiers
- **Semantic Versioning:** Version numbering

### Contact
- **Schema Owner:** [Data Governance Team]
- **Email:** data-governance@example.com
- **Wiki:** [https://wiki.example.com/metadata-schema]
- **Support:** [Slack #metadata-help]
