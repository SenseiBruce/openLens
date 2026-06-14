# Data Quality Plan

**Project:** [Project Name]
**Dataset:** [Dataset Name]
**Date:** [YYYY-MM-DD]
**Owner:** [Data Engineer Name]

## Data Quality Dimensions

### 1. Accuracy
- **Definition:** Data correctly represents real-world values
- **Metrics:** [Accuracy rate target: X%]
- **Validation Rules:**
  - [Rule 1]
  - [Rule 2]

### 2. Completeness
- **Definition:** All required data is present
- **Metrics:** [Completeness target: X%]
- **Required Fields:**
  - [Field 1] - cannot be null
  - [Field 2] - cannot be null

### 3. Consistency
- **Definition:** Data is consistent across systems
- **Metrics:** [Consistency rate target: X%]
- **Cross-System Checks:**
  - [Check 1]

### 4. Timeliness
- **Definition:** Data is available when needed
- **Metrics:** [Freshness SLA: X hours]
- **Monitoring:** [How freshness is tracked]

### 5. Validity
- **Definition:** Data conforms to defined formats
- **Metrics:** [Validity rate target: X%]
- **Format Rules:**
  - Email: RFC 5322 compliant
  - Phone: E.164 format
  - [Custom rules]

### 6. Uniqueness
- **Definition:** No duplicate records exist
- **Metrics:** [Duplicate rate target: <X%]
- **Unique Keys:** [List of unique identifiers]

## Data Quality Rules

| Rule ID | Description | Dimension | Severity | Action on Failure |
|---------|-------------|-----------|----------|-------------------|
| DQ001 | [Rule description] | Completeness | Critical | Block pipeline |
| DQ002 | [Rule description] | Accuracy | High | Alert + Continue |

## Monitoring & Reporting
- **Dashboard:** [Link to monitoring dashboard]
- **Reports:** [Daily/Weekly data quality report]
- **Alerting:** [Email/Slack on threshold violations]

## Data Profiling
- **Frequency:** [Weekly/Monthly]
- **Metrics Tracked:**
  - Null percentage by column
  - Unique value counts
  - Min/max/average values
  - Distribution statistics

## Remediation Process
1. **Detection:** Automated quality checks identify issues
2. **Triage:** Data owner reviews and classifies issue
3. **Remediation:** [Process to fix data]
4. **Validation:** Re-run quality checks
5. **Documentation:** Record root cause and fix

## Ownership
| Dataset/Table | Data Owner | Quality Reviewer |
|---------------|------------|------------------|
| [Table 1] | [Name] | [Name] |

## Quality Metrics Dashboard
- **Target:** [X%] overall quality score
- **Current:** [Y%]
- **Trend:** [Improving/Declining/Stable]
