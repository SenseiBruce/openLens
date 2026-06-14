# Exploratory Data Analysis (EDA) Report

**Project:** [Project Name]
**Dataset:** [Dataset Name]
**Date:** [YYYY-MM-DD]
**Analyst:** [Name]

## Executive Summary
[2-3 sentence summary of key findings]

## Dataset Overview

### Basic Information
- **Dataset Name:** [Name]
- **Source:** [Database/File/API]
- **Time Period:** [YYYY-MM-DD to YYYY-MM-DD]
- **Number of Records:** [X rows]
- **Number of Features:** [Y columns]
- **File Size:** [Z MB/GB]

### Schema
| Column | Data Type | Non-Null Count | Unique Values | Description |
|--------|-----------|----------------|---------------|-------------|
| user_id | int64 | 100% | 50,000 | Unique user identifier |
| age | int64 | 98% | 65 | User age in years |
| signup_date | datetime64 | 100% | 730 | Date user joined |
| revenue | float64 | 100% | 15,234 | Total revenue from user |

## Data Quality Assessment

### Completeness
| Column | Missing % | Observations |
|--------|-----------|--------------|
| age | 2% | Acceptable, impute with median |
| email | 0% | No missing values |
| last_purchase | 15% | Expected for inactive users |

**Overall Completeness:** 96%

### Data Types
- [x] All data types correct
- [ ] Conversion needed: [List any]

### Duplicates
- **Duplicate Rows:** [N duplicates found]
- **Action Taken:** [Removed / Kept with justification]

### Outliers
| Column | Outliers Detected | Method | Action |
|--------|-------------------|--------|--------|
| revenue | 12 (0.02%) | IQR method | Kept (legitimate high-value customers) |
| age | 5 (0.01%) | >100 years | Removed (data errors) |

## Univariate Analysis

### Numerical Variables

#### revenue
- **Mean:** $[X]
- **Median:** $[Y]
- **Std Dev:** $[Z]
- **Min:** $[A]
- **Max:** $[B]
- **Distribution:** Right-skewed
- **Percentiles:**
  - 25th: $[P25]
  - 50th: $[P50]
  - 75th: $[P75]
  - 95th: $[P95]

**Distribution:**
```
[Histogram description or ASCII art]
Most users (70%) generate $0-$100 revenue
Long tail of high-value customers
```

#### age
- **Mean:** [X] years
- **Median:** [Y] years
- **Mode:** [Z] years
- **Range:** [Min] to [Max]
- **Distribution:** Normal distribution centered around [X]

### Categorical Variables

#### country
| Value | Count | Percentage |
|-------|-------|------------|
| US | 30,000 | 60% |
| UK | 10,000 | 20% |
| CA | 5,000 | 10% |
| Other | 5,000 | 10% |

#### subscription_tier
| Tier | Count | % | Avg Revenue |
|------|-------|---|-------------|
| Free | 35,000 | 70% | $0 |
| Basic | 10,000 | 20% | $50 |
| Premium | 5,000 | 10% | $200 |

## Bivariate Analysis

### Correlation Matrix
```
              revenue    age    tenure  purchases
revenue        1.00     0.15    0.65      0.85
age            0.15     1.00    0.30      0.20
tenure         0.65     0.30    1.00      0.75
purchases      0.85     0.20    0.75      1.00
```

**Key Findings:**
- Strong positive correlation between purchases and revenue (0.85)
- Moderate correlation between tenure and revenue (0.65)
- Weak correlation between age and revenue (0.15)

### Revenue by Subscription Tier
| Tier | Mean Revenue | Median Revenue | Total Revenue |
|------|--------------|----------------|---------------|
| Free | $0 | $0 | $0 |
| Basic | $50 | $48 | $500K |
| Premium | $200 | $195 | $1M |

**Insight:** Premium tier generates 67% of total revenue despite being only 10% of users.

### Time Series Patterns

#### Signups Over Time
- **Trend:** Steady growth of ~1000 users/month
- **Seasonality:** Peak signups in January (New Year) and September (back-to-school)
- **Anomalies:** Drop in December 2025 (website outage)

#### Revenue Over Time
- **Trend:** Increasing, correlates with user growth
- **Seasonality:** Higher in Q4 (holiday shopping)

## Multivariate Analysis

### Segmentation
Using K-means clustering (k=3):

**Segment 1: High-Value Active Users (10%)**
- High revenue ($200+)
- Frequent purchases (>10/year)
- Long tenure (>2 years)

**Segment 2: Moderate Engaged Users (30%)**
- Medium revenue ($50-$200)
- Occasional purchases (3-10/year)
- Medium tenure (6-24 months)

**Segment 3: Inactive/Low-Value (60%)**
- Low/no revenue
- Rare purchases (0-2/year)
- Recent signups or churned users

## Key Insights

### Finding 1: Revenue Concentration
- Top 10% of users generate 80% of revenue (Pareto principle)
- Churn in top tier has outsized impact

### Finding 2: Tenure Effect
- Users who stay >1 year have 5x higher lifetime value
- First 90 days critical for retention

### Finding 3: Geographic Differences
- US users have 2x higher average revenue than international
- Opportunity to improve international pricing/offerings

### Finding 4: Age Patterns
- Peak revenue in 35-44 age group
- Under-representation in 18-24 segment

## Data Issues Found

### Critical Issues
1. **Missing Values:** 15% missing in `last_purchase_date`
   - **Impact:** Cannot accurately identify churned users
   - **Recommendation:** Backfill from transaction logs

### Non-Critical Issues
1. **Inconsistent Formatting:** Country names vary (US, USA, United States)
   - **Impact:** Segmentation by country requires cleaning
   - **Recommendation:** Standardize to ISO country codes

## Recommendations

### For Product Team
1. Focus retention efforts on first 90 days
2. Create tiered pricing for international markets
3. Develop features targeting 18-24 demographic

### For Analytics Team
1. Implement real-time revenue dashboard
2. Build churn prediction model
3. Set up automated data quality monitoring

### For Data Engineering
1. Fix missing `last_purchase_date` values
2. Standardize country field
3. Add data validation for age field

## Next Steps
1. [ ] Deep dive analysis on churned users
2. [ ] Build predictive model for customer lifetime value
3. [ ] A/B test pricing changes for international users
4. [ ] Set up automated monthly EDA reports

## Appendix

### Analysis Environment
- **Tool:** Python 3.9 / Jupyter Notebook
- **Libraries:** pandas 1.5.0, numpy 1.23.0, matplotlib 3.6.0, seaborn 0.12.0, scikit-learn 1.2.0
- **Data Version:** 2026-01-27 snapshot

### Code Repository
[Link to notebook]

### Visualizations
See attached PDF with detailed charts:
- Figure 1: Revenue distribution histogram
- Figure 2: Correlation heatmap
- Figure 3: Time series trends
- Figure 4: Segment profiles
