# Test Data Specification

**Project:** [Project Name]
**Module:** [Module Name]
**Version:** [X.Y.Z]
**Data Architect:** [Name]
**Date:** [YYYY-MM-DD]

## Executive Summary

### Purpose
This document specifies the test data requirements for testing [Project Name]. It defines what data is needed, how it will be created, where it will be stored, and how it will be managed throughout the testing lifecycle.

### Test Data Strategy
**Approach:** [Production-like synthetic data / Anonymized production data / Generated data]

**Key Principles:**
1. Test data must be representative of production scenarios
2. Data must cover positive, negative, and edge cases
3. Sensitive data must be anonymized or masked
4. Data must be refreshable and repeatable
5. Data integrity must be maintained

### Data Volume Summary
| Data Entity | Volume | Source | Status |
|-------------|--------|--------|--------|
| Users | [10,000] | [Generated] | [Ready/In Progress] |
| Products | [50,000] | [Anonymized Prod] | [Ready/In Progress] |
| Orders | [100,000] | [Generated] | [Ready/In Progress] |
| Customers | [25,000] | [Anonymized Prod] | [Ready/In Progress] |
| Transactions | [500,000] | [Generated] | [Ready/In Progress] |

---

## Test Data Requirements

### Functional Test Data

#### User Accounts
**Purpose:** Test authentication, authorization, user management features

**Data Requirements:**
| Account Type | Quantity | Characteristics |
|--------------|----------|-----------------|
| Admin Users | 5 | Full system access, all permissions |
| Standard Users | 100 | Normal user permissions |
| Read-Only Users | 20 | View-only access |
| Locked Accounts | 10 | For testing unlock functionality |
| Expired Accounts | 10 | Past expiration date |
| First-Time Users | 50 | Never logged in |
| Active Users | 200 | Regular usage patterns |
| Inactive Users | 50 | No activity >90 days |

**Sample Data:**
```csv
username,email,role,status,created_date,last_login
admin001,admin001@test.com,admin,active,2023-01-01,2024-02-09
user001,user001@test.com,standard,active,2023-06-15,2024-02-08
user002,user002@test.com,standard,locked,2023-03-20,2024-01-15
readonly001,readonly001@test.com,readonly,active,2023-09-01,2024-02-07
```

**Credentials:**
- Standard password for test users: `Test@1234`
- Admin password: `Admin@5678`

---

#### Customer Data
**Purpose:** Test customer management, search, filtering, reporting

**Data Requirements:**
| Customer Type | Quantity | Characteristics |
|---------------|----------|-----------------|
| Individual | 15,000 | Personal customers |
| Business | 8,000 | Corporate accounts |
| VIP | 1,000 | High-value customers |
| New Customers | 2,000 | Created in last 30 days |
| Inactive | 3,000 | No activity >1 year |

**Data Fields:**
- Customer ID (unique)
- Name (First, Last for individuals; Company name for business)
- Email (valid format, unique)
- Phone (various formats: (555) 123-4567, 555-123-4567, 5551234567)
- Address (Street, City, State, ZIP, Country)
- Customer Type (Individual/Business/VIP)
- Account Status (Active/Inactive/Suspended)
- Created Date
- Last Purchase Date
- Total Lifetime Value
- Payment Terms
- Credit Limit (for business accounts)

**Special Cases:**
- 100 customers with international addresses
- 50 customers with P.O. Box addresses
- 25 customers with very long names (>50 characters)
- 10 customers with special characters in names (O'Brien, José, François)
- 5 customers with empty optional fields
- 20 duplicate email addresses (for testing validation)

**Sample Data:**
```csv
customer_id,first_name,last_name,email,phone,city,state,country,type,status,created_date,lifetime_value
CUST001,John,Smith,john.smith@email.com,555-123-4567,New York,NY,USA,Individual,Active,2022-03-15,15420.50
CUST002,Jane,O'Brien,jane.obrien@email.com,555-234-5678,Los Angeles,CA,USA,VIP,Active,2021-08-20,45678.90
CUST003,,Acme Corp,contact@acmecorp.com,555-345-6789,Chicago,IL,USA,Business,Active,2020-01-10,125000.00
```

---

#### Product Data
**Purpose:** Test product catalog, search, inventory, pricing

**Data Requirements:**
| Product Type | Quantity | Characteristics |
|--------------|----------|-----------------|
| Active Products | 40,000 | Available for sale |
| Out of Stock | 5,000 | Zero inventory |
| Discontinued | 3,000 | No longer sold |
| New Products | 2,000 | Recently added |
| Sale Items | 5,000 | Discounted prices |

**Data Fields:**
- Product ID (SKU)
- Product Name
- Description (short and long)
- Category (3-level hierarchy)
- Brand
- Price (regular)
- Sale Price (if applicable)
- Cost
- Inventory Count
- Weight
- Dimensions (L x W x H)
- Status (Active/Discontinued/Out of Stock)
- Images (URLs)
- Rating (1-5 stars)
- Review Count
- Date Added
- Date Modified

**Special Cases:**
- Products with very long descriptions (>5000 characters)
- Products with special characters in names
- Products with $0.00 price (free items)
- Products with very high prices (>$10,000)
- Products with fractional quantities (e.g., 0.5 units)
- Products in multiple categories
- Products with no images
- Products with 100+ reviews
- Products with 1-star rating
- Products with 5-star rating

**Data Distribution:**
- Electronics: 30%
- Clothing: 25%
- Home & Garden: 20%
- Sports: 15%
- Books: 10%

**Sample Data:**
```csv
sku,name,category,price,sale_price,inventory,status,rating,review_count
PROD001,Laptop 15-inch,Electronics>Computers>Laptops,899.99,799.99,150,Active,4.5,234
PROD002,T-Shirt Blue Medium,Clothing>Men>Shirts,19.99,,500,Active,4.0,89
PROD003,Garden Hose 50ft,Home & Garden>Outdoor>Tools,29.99,24.99,0,Out of Stock,4.7,156
```

---

#### Order Data
**Purpose:** Test order management, fulfillment, reporting

**Data Requirements:**
| Order Type | Quantity | Characteristics |
|------------|----------|-----------------|
| Completed | 70,000 | Delivered orders |
| Pending | 5,000 | Awaiting fulfillment |
| Shipped | 10,000 | In transit |
| Cancelled | 8,000 | Cancelled by customer/system |
| Returned | 5,000 | Returned for refund |
| Back-ordered | 2,000 | Awaiting stock |

**Data Fields:**
- Order ID (unique)
- Customer ID (foreign key)
- Order Date
- Order Time
- Order Status
- Order Items (array: product_id, quantity, price)
- Subtotal
- Tax
- Shipping Cost
- Discount
- Total Amount
- Payment Method
- Payment Status
- Shipping Address
- Billing Address
- Shipping Method
- Tracking Number (if shipped)
- Estimated Delivery Date
- Actual Delivery Date
- Notes/Special Instructions

**Order Complexity:**
- Single item orders: 40%
- 2-5 items: 45%
- 6-10 items: 12%
- >10 items: 3%

**Special Cases:**
- Orders with $0 total (free shipping + 100% coupon)
- Orders >$10,000
- International orders
- Orders with gift wrapping
- Orders with multiple shipments
- Orders with partial fulfillment
- Orders with returns/refunds
- Orders with cancelled items
- Same-day delivery orders
- Orders from guest users (no account)

**Sample Data:**
```csv
order_id,customer_id,order_date,status,subtotal,tax,shipping,total,payment_method
ORD001,CUST001,2024-02-01 14:32:15,Completed,150.00,12.75,8.99,171.74,Credit Card
ORD002,CUST002,2024-02-05 09:15:42,Shipped,2450.00,208.25,0.00,2658.25,PayPal
ORD003,CUST003,2024-02-08 16:45:00,Pending,89.97,7.65,5.99,103.61,Credit Card
```

---

### Performance Test Data

#### High-Volume Data
**Purpose:** Test system performance under load

| Entity | Volume | Purpose |
|--------|--------|---------|
| Users | 100,000 | Simulate large user base |
| Products | 1,000,000 | Test catalog scalability |
| Orders | 5,000,000 | Historical data volume |
| Transactions | 10,000,000 | Payment history |
| Log Entries | 50,000,000 | System logs |

**Data Characteristics:**
- Realistic distributions (not uniform)
- Varied record sizes
- Indexes on key fields
- Foreign key relationships maintained
- Some data fragmentation (realistic)

---

### Security Test Data

#### Valid Credentials
```csv
username,password,role
security_admin,SecureP@ss123!,admin
security_user,UserP@ss456!,user
security_readonly,ReadP@ss789!,readonly
```

#### Invalid Credentials (for negative testing)
```csv
test_case,username,password,expected_result
SQL Injection,admin' OR '1'='1,password,Rejected
XSS Attempt,<script>alert('xss')</script>,password,Sanitized/Rejected
Long Password,validuser,{3000 character string},Rejected
Empty Password,validuser,,Rejected
Special Chars,validuser,P@$$w0rd!@#$%,Accepted
```

#### Test Credit Cards
| Card Type | Number | CVV | Exp Date | Expected Result |
|-----------|--------|-----|----------|-----------------|
| Visa | 4111 1111 1111 1111 | 123 | 12/25 | Approved |
| Mastercard | 5500 0000 0000 0004 | 456 | 12/25 | Approved |
| Amex | 3400 0000 0000 009 | 1234 | 12/25 | Approved |
| Visa | 4000 0000 0000 0002 | 123 | 12/25 | Declined |

---

### Edge Case Test Data

#### Boundary Values
| Field | Min Valid | Max Valid | Below Min | Above Max |
|-------|-----------|-----------|-----------|-----------|
| Price | $0.01 | $99,999.99 | $0.00 | $100,000.00 |
| Quantity | 1 | 9999 | 0 | 10000 |
| ZIP Code | 00001 | 99999 | 0 | 100000 |
| Age | 18 | 120 | 17 | 121 |

#### Special Characters
```
' " < > & / \ ; : , . ? ! @ # $ % ^ * ( ) [ ] { } | ~ `
Café, naïve, résumé (accented characters)
中文 (Chinese characters)
العربية (Arabic characters)
😀🎉🚀 (Emojis)
```

#### Extreme Values
- Very long text: 10,000+ character descriptions
- Very short text: Single character names
- Empty strings: ""
- Null values: NULL
- Zero values: 0, 0.00
- Negative values: -100, -50.00
- Large numbers: 999,999,999.99
- Dates: Past (1900-01-01), Future (2099-12-31), Today

---

## Data Generation

### Generation Methods

#### 1. Automated Generation
**Tools:** [Faker, Mockaroo, custom scripts]

**Generated Entities:**
- Users (usernames, emails, passwords)
- Customers (names, addresses, phones)
- Products (names, descriptions, SKUs)
- Orders (order details, items)

**Generation Script:**
```python
# Example: Python script using Faker
from faker import Faker
import csv

fake = Faker()

with open('customers.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['customer_id', 'name', 'email', 'phone', 'address'])
    
    for i in range(10000):
        writer.writerow([
            f'CUST{i+1:05d}',
            fake.name(),
            fake.email(),
            fake.phone_number(),
            fake.address().replace('\n', ', ')
        ])
```

---

#### 2. Anonymized Production Data
**Process:**
1. Extract subset from production
2. Anonymize PII (Personally Identifiable Information)
3. Mask sensitive data
4. Validate data integrity
5. Load to test environment

**Anonymization Rules:**
| Field | Method | Example |
|-------|--------|---------|
| Name | Fake name generator | John Smith → Jane Doe |
| Email | Pattern: user{id}@test.com | john@real.com → user123@test.com |
| Phone | Random numbers | 555-123-4567 → 555-{random} |
| SSN | Masked | 123-45-6789 → XXX-XX-6789 |
| Credit Card | Test numbers | Real card → 4111111111111111 |
| Address | Fake addresses | Keep city/state, fake street |

**Script:**
```sql
-- Example: SQL anonymization
UPDATE customers SET
    first_name = CONCAT('TestUser', customer_id),
    last_name = CONCAT('LastName', customer_id),
    email = CONCAT('user', customer_id, '@test.com'),
    phone = CONCAT('555-', LPAD(FLOOR(RAND() * 10000000), 7, '0')),
    ssn = 'XXX-XX-XXXX'
WHERE environment = 'test';
```

---

#### 3. Manual Data Creation
**Use Cases:**
- Specific edge cases
- Complex scenarios
- Regression test cases
- Demo data

**Example:**
Create specific customer for testing:
- Customer with 100+ orders
- Customer in every state
- Customer with returned items
- VIP customer with special pricing

---

### Data Refresh Strategy

**Full Refresh:**
- **Frequency:** Weekly or before major test cycles
- **Process:**
  1. Backup existing test data (if needed)
  2. Drop test database
  3. Restore from baseline
  4. Run generation scripts
  5. Validate data integrity
  6. Notify team

**Incremental Refresh:**
- **Frequency:** Daily
- **Process:**
  - Add new test records for that day's testing
  - Clean up corrupted data
  - Reset specific tables/records

**On-Demand Refresh:**
- User/tester requests refresh
- Specific scenario requires clean data
- Environment corrupted during testing

---

## Data Storage & Access

### Test Database
**Database:** [PostgreSQL / MySQL / MongoDB]
**Server:** [test-db.example.com]
**Schema:** [test_db]

**Access Credentials:**
- Read-Only User: `test_readonly` / `[password]`
- Test User: `test_user` / `[password]`
- Admin User: `test_admin` / `[password]`

### Data Files
**Location:** [AWS S3 / Network Share / Git LFS]
**Path:** `s3://test-data-bucket/project-name/`

**File Structure:**
```
/test-data/
  /baseline/
    customers.csv
    products.csv
    orders.csv
  /generated/
    users_10k.csv
    orders_100k.csv
  /edge-cases/
    special_characters.csv
    boundary_values.csv
  /scripts/
    generate_data.py
    anonymize_data.sql
    load_data.sh
```

---

## Data Management

### Data Ownership
| Data Set | Owner | Contact |
|----------|-------|---------|
| Customer Data | [Name] | [email] |
| Product Data | [Name] | [email] |
| Order Data | [Name] | [email] |
| User Accounts | [Name] | [email] |

### Data Quality Checks

**Validation Rules:**
```sql
-- Check for duplicate records
SELECT customer_id, COUNT(*) 
FROM customers 
GROUP BY customer_id 
HAVING COUNT(*) > 1;

-- Check for orphaned orders (customer doesn't exist)
SELECT o.order_id 
FROM orders o 
LEFT JOIN customers c ON o.customer_id = c.customer_id 
WHERE c.customer_id IS NULL;

-- Check for invalid email formats
SELECT * FROM customers 
WHERE email NOT LIKE '%@%.%';

-- Check for negative prices
SELECT * FROM products 
WHERE price < 0;
```

**Data Quality Metrics:**
- Completeness: [X]% of required fields populated
- Accuracy: [X]% of data passes validation
- Consistency: [X]% referential integrity maintained
- Uniqueness: [X]% of unique constraints satisfied

---

## Data Privacy & Compliance

### Compliance Requirements
- **GDPR:** No real EU citizen PII in test data
- **HIPAA:** No real patient health information
- **PCI DSS:** No real credit card numbers
- **SOX:** Anonymized financial data only

### Data Handling Rules
1. ✅ **DO:**
   - Use synthetic data whenever possible
   - Anonymize production data before use
   - Encrypt test data at rest and in transit
   - Delete test data after project completion
   - Document data lineage

2. ❌ **DO NOT:**
   - Use real customer data without anonymization
   - Store test data in unsecured locations
   - Share test credentials publicly
   - Use production data in development
   - Commit sensitive data to version control

### Data Retention
- Test data retained for: [duration after project]
- Deletion process: [automated script / manual]
- Archive policy: [long-term scenarios only]

---

## Test Data Catalog

### Available Data Sets

| Data Set Name | Description | Records | Last Updated | Location |
|---------------|-------------|---------|--------------|----------|
| customers_10k | Standard customer set | 10,000 | 2024-02-01 | s3://bucket/customers_10k.csv |
| products_50k | Full product catalog | 50,000 | 2024-01-28 | s3://bucket/products_50k.csv |
| orders_100k | Order history | 100,000 | 2024-02-05 | s3://bucket/orders_100k.csv |
| edge_cases | Special scenarios | 500 | 2024-01-15 | s3://bucket/edge_cases.csv |
| performance_1m | Large dataset for performance | 1,000,000 | 2024-01-20 | s3://bucket/perf_1m.csv |

---

## Appendices

### Appendix A: Data Generation Scripts
[Link to repository with all generation scripts]

### Appendix B: Sample Data Files
[Links to sample CSV files]

### Appendix C: Database Schema
[Entity-relationship diagram]

### Appendix D: Data Dictionary
[Complete field definitions]

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Test Lead | [Name] | [Date] | [Signature] |
| Data Architect | [Name] | [Date] | [Signature] |
| Security Lead | [Name] | [Date] | [Signature] |
| Compliance Officer | [Name] | [Date] | [Signature] |

---

## Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial test data specification |
| 1.1 | [Date] | [Author] | Added performance test data |
| 1.2 | [Date] | [Author] | Updated anonymization rules |
