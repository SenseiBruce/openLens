# Entity Relationship Diagram (ERD)

## Database Information
- **Database Name:** [Name]
- **Schema Version:** [Version]
- **Last Updated:** [Date]
- **Database Type:** [PostgreSQL/MySQL/MongoDB/etc.]
- **Created By:** [Name, Role]
- **Status:** [Draft/Active/Deprecated]

## Document Purpose
This ERD documents the database schema, showing entities (tables), their attributes (columns), and relationships between entities.

## ERD Overview

### High-Level Summary
- **Total Entities:** [Number]
- **Total Relationships:** [Number]
- **Complexity Level:** [Simple/Moderate/Complex]
- **Primary Purpose:** [What this database supports]

### Schema Scope
**Included:**
- [Domain area 1 - e.g., User management]
- [Domain area 2 - e.g., Orders and transactions]
- [Domain area 3 - e.g., Product catalog]

**Not Included:**
- [Out of scope areas]

## ERD Diagram

### Conceptual ERD (High-Level)
```
[High-level diagram showing main entities and their relationships]

Example:
┌─────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────<│  Order  │>────────│  Product │
└─────────┘         └─────────┘         └──────────┘
     │                   │                     │
     │                   │                     │
     ▼                   ▼                     ▼
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Address │         │ Payment │         │ Category │
└─────────┘         └─────────┘         └──────────┘
```

### Logical ERD (Detailed)

```
Full ERD with all entities, attributes, and relationships

Notation:
─────  One-to-One
────>  One-to-Many  
<────> Many-to-Many
[PK]   Primary Key
[FK]   Foreign Key
[U]    Unique
[NN]   Not Null


┌───────────────────────────────────┐
│ users                             │
├───────────────────────────────────┤
│ [PK] id                BIGSERIAL  │
│ [U]  email             VARCHAR    │
│ [NN] password_hash     VARCHAR    │
│      first_name        VARCHAR    │
│      last_name         VARCHAR    │
│      phone             VARCHAR    │
│      created_at        TIMESTAMP  │
│      updated_at        TIMESTAMP  │
│      deleted_at        TIMESTAMP  │
│      status            VARCHAR    │
└───────────────────────────────────┘
         │
         │ 1:N
         ▼
┌───────────────────────────────────┐
│ addresses                         │
├───────────────────────────────────┤
│ [PK] id                BIGSERIAL  │
│ [FK] user_id           BIGINT     │
│      address_type      VARCHAR    │
│      street_1          VARCHAR    │
│      street_2          VARCHAR    │
│      city              VARCHAR    │
│      state             VARCHAR    │
│      postal_code       VARCHAR    │
│      country           VARCHAR    │
│      is_default        BOOLEAN    │
│      created_at        TIMESTAMP  │
│      updated_at        TIMESTAMP  │
└───────────────────────────────────┘

[Continue for all entities...]
```

### Physical ERD (Implementation)
[Link to database visualization tool output: dbdiagram.io, draw.io, etc.]

## Entity Definitions

### Format for Each Entity

#### [Entity Name]

**Purpose:** [What this entity represents]

**Table Name:** `entity_name`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique identifier |
| [column_name] | [TYPE] | [constraints] | [default] | [Description] |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | NULL | NULL | Soft delete timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `idx_entity_field` ON `field_name`
- UNIQUE INDEX: `idx_entity_unique` ON `unique_field`

**Relationships:**
- **Parent entities:** [Entities this references]
- **Child entities:** [Entities that reference this]
- **M:N relationships:** [Through junction tables]

**Business Rules:**
- [Business constraint 1]
- [Business constraint 2]

**Notes:**
- [Special considerations]
- [Edge cases]

---

### Core Entities

#### users

**Purpose:** Stores user account information

**Table Name:** `users`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique user identifier |
| email | VARCHAR(255) | NN, UNIQUE | - | User email address (login) |
| password_hash | VARCHAR(255) | NN | - | Bcrypt hashed password |
| first_name | VARCHAR(100) | NN | - | User's first name |
| last_name | VARCHAR(100) | NN | - | User's last name |
| phone | VARCHAR(20) | NULL | NULL | Phone number (optional) |
| email_verified | BOOLEAN | NN | FALSE | Email verification status |
| status | VARCHAR(20) | NN | 'active' | active, suspended, deleted |
| last_login_at | TIMESTAMP | NULL | NULL | Last successful login |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last profile update |
| deleted_at | TIMESTAMP | NULL | NULL | Soft delete (NULL = active) |

**Indexes:**
- PRIMARY KEY: `users_pkey` ON `id`
- UNIQUE INDEX: `users_email_unique` ON `email` WHERE `deleted_at IS NULL`
- INDEX: `users_status_idx` ON `status`
- INDEX: `users_created_at_idx` ON `created_at`

**Relationships:**
- **Children:**
  - `addresses` (1:N) - User has many addresses
  - `orders` (1:N) - User has many orders
  - `user_roles` (1:N) - User has many roles (through junction)
  - `sessions` (1:N) - User has many active sessions

**Business Rules:**
- Email must be unique among active (non-deleted) users
- Password must be hashed before storage (never store plain text)
- Soft deletes: Set `deleted_at` instead of physically deleting
- Email verification required before certain actions

**Notes:**
- Consider partitioning if user count >10M
- PII - ensure encryption at rest and in transit
- GDPR: Support right to be forgotten (hard delete after soft delete period)

#### addresses

**Purpose:** Stores user shipping and billing addresses

**Table Name:** `addresses`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique address identifier |
| user_id | BIGINT | FK, NN | - | Foreign key to users.id |
| address_type | VARCHAR(20) | NN | 'shipping' | shipping, billing, both |
| street_1 | VARCHAR(255) | NN | - | Primary street address |
| street_2 | VARCHAR(255) | NULL | NULL | Apt, suite, etc. (optional) |
| city | VARCHAR(100) | NN | - | City name |
| state | VARCHAR(100) | NN | - | State/province |
| postal_code | VARCHAR(20) | NN | - | ZIP/postal code |
| country | VARCHAR(2) | NN | - | ISO 3166-1 alpha-2 country code |
| is_default | BOOLEAN | NN | FALSE | Default address for user |
| validated | BOOLEAN | NN | FALSE | Address validation status |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Address added time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `addresses_pkey` ON `id`
- FOREIGN KEY: `addresses_user_id_fkey` REFERENCES `users(id)` ON DELETE CASCADE
- INDEX: `addresses_user_id_idx` ON `user_id`
- INDEX: `addresses_is_default_idx` ON `user_id, is_default` WHERE `is_default = TRUE`

**Relationships:**
- **Parent:** `users` (N:1) - Many addresses belong to one user
- **Children:** `orders` (1:N) - Address used in many orders

**Business Rules:**
- User can have multiple addresses but only one default per type
- Use address validation API before setting `validated = TRUE`
- Country code must be valid ISO 3166-1 alpha-2

**Notes:**
- Consider denormalizing address into orders table for historical accuracy
- Address validation integration: Google Maps API, SmartyStreets, etc.

#### products

**Purpose:** Product catalog

**Table Name:** `products`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique product identifier |
| sku | VARCHAR(50) | NN, UNIQUE | - | Stock keeping unit |
| name | VARCHAR(255) | NN | - | Product name |
| description | TEXT | NULL | NULL | Product description |
| category_id | BIGINT | FK, NN | - | Foreign key to categories.id |
| price | DECIMAL(10,2) | NN | - | Current price |
| cost | DECIMAL(10,2) | NULL | NULL | Cost basis (for margin calc) |
| currency | VARCHAR(3) | NN | 'USD' | ISO 4217 currency code |
| stock_quantity | INTEGER | NN | 0 | Current inventory level |
| status | VARCHAR(20) | NN | 'draft' | draft, active, discontinued |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Product created time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last update time |
| published_at | TIMESTAMP | NULL | NULL | When product went live |

**Indexes:**
- PRIMARY KEY: `products_pkey` ON `id`
- UNIQUE INDEX: `products_sku_unique` ON `sku`
- FOREIGN KEY: `products_category_id_fkey` REFERENCES `categories(id)`
- INDEX: `products_category_id_idx` ON `category_id`
- INDEX: `products_status_idx` ON `status`
- FULLTEXT INDEX: `products_search_idx` ON `name, description`

**Relationships:**
- **Parent:** `categories` (N:1)
- **Children:** 
  - `order_items` (1:N) - Product in many order line items
  - `product_images` (1:N) - Product has many images
  - `reviews` (1:N) - Product has many reviews
- **M:N:** `tags` through `product_tags` junction

**Business Rules:**
- SKU must be unique and never reused
- Price must be positive
- Stock quantity cannot be negative
- Status = 'active' required for product to appear on site

#### orders

**Purpose:** Customer orders

**Table Name:** `orders`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique order identifier |
| order_number | VARCHAR(50) | NN, UNIQUE | - | Human-readable order number |
| user_id | BIGINT | FK, NN | - | Foreign key to users.id |
| shipping_address_id | BIGINT | FK, NULL | NULL | Snapshot or FK to addresses |
| billing_address_id | BIGINT | FK, NULL | NULL | Snapshot or FK to addresses |
| subtotal | DECIMAL(10,2) | NN | 0 | Sum of line items |
| tax | DECIMAL(10,2) | NN | 0 | Tax amount |
| shipping | DECIMAL(10,2) | NN | 0 | Shipping cost |
| discount | DECIMAL(10,2) | NN | 0 | Discount applied |
| total | DECIMAL(10,2) | NN | 0 | Final total (subtotal + tax + shipping - discount) |
| currency | VARCHAR(3) | NN | 'USD' | ISO 4217 currency code |
| status | VARCHAR(20) | NN | 'pending' | pending, paid, shipped, delivered, cancelled |
| payment_status | VARCHAR(20) | NN | 'unpaid' | unpaid, paid, refunded, failed |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Order created time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last update time |
| paid_at | TIMESTAMP | NULL | NULL | Payment completion time |
| shipped_at | TIMESTAMP | NULL | NULL | Shipment time |
| delivered_at | TIMESTAMP | NULL | NULL | Delivery time |

**Indexes:**
- PRIMARY KEY: `orders_pkey` ON `id`
- UNIQUE INDEX: `orders_number_unique` ON `order_number`
- FOREIGN KEY: `orders_user_id_fkey` REFERENCES `users(id)`
- INDEX: `orders_user_id_idx` ON `user_id`
- INDEX: `orders_status_idx` ON `status`
- INDEX: `orders_created_at_idx` ON `created_at DESC`

**Relationships:**
- **Parent:** `users` (N:1)
- **Parent:** `addresses` (N:1) for shipping and billing
- **Children:**
  - `order_items` (1:N) - Order has many line items
  - `payments` (1:N) - Order has payment records
  - `shipments` (1:N) - Order has shipment tracking

**Business Rules:**
- Total = subtotal + tax + shipping - discount
- Order number generated as: ORD-{YEAR}{MONTH}{COUNTER}
- Status transitions: pending → paid → shipped → delivered (or cancelled at any point)
- Cannot modify order after status = 'paid' (except cancel/refund)

#### order_items

**Purpose:** Line items in an order

**Table Name:** `order_items`

**Attributes:**

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | BIGSERIAL | PK, NN | AUTO | Unique line item identifier |
| order_id | BIGINT | FK, NN | - | Foreign key to orders.id |
| product_id | BIGINT | FK, NN | - | Foreign key to products.id |
| product_name | VARCHAR(255) | NN | - | Snapshot of product name |
| sku | VARCHAR(50) | NN | - | Snapshot of SKU |
| quantity | INTEGER | NN | 1 | Quantity ordered |
| unit_price | DECIMAL(10,2) | NN | - | Price per unit at time of order |
| total_price | DECIMAL(10,2) | NN | - | unit_price × quantity |
| created_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Line item added time |
| updated_at | TIMESTAMP | NN | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `order_items_pkey` ON `id`
- FOREIGN KEY: `order_items_order_id_fkey` REFERENCES `orders(id)` ON DELETE CASCADE
- FOREIGN KEY: `order_items_product_id_fkey` REFERENCES `products(id)`
- INDEX: `order_items_order_id_idx` ON `order_id`
- INDEX: `order_items_product_id_idx` ON `product_id`

**Relationships:**
- **Parent:** `orders` (N:1) - Many items belong to one order
- **Parent:** `products` (N:1) - Many order items reference one product

**Business Rules:**
- Quantity must be positive
- Snapshot product data (name, SKU, price) to preserve historical accuracy
- total_price = unit_price × quantity

**Notes:**
- Denormalization: Store product snapshot to handle price changes and product deletions

[Continue for all entities: categories, payments, shipments, reviews, sessions, user_roles, roles, product_tags, tags, etc.]

## Relationships

### Relationship Types

**One-to-One (1:1):**
- Example: `users` ↔ `user_profiles` (if separated)
- Implementation: Foreign key with UNIQUE constraint

**One-to-Many (1:N):**
- Example: `users` → `orders` (One user has many orders)
- Implementation: Foreign key in "many" table

**Many-to-Many (M:N):**
- Example: `products` ↔ `tags` (Products have many tags; tags apply to many products)
- Implementation: Junction table `product_tags` with FKs to both

### Relationship Details

| Relationship | Type | From | To | FK Column | Cascading |
|--------------|------|------|----|-----------| ----------|
| User-Orders | 1:N | users | orders | orders.user_id | ON DELETE RESTRICT |
| User-Addresses | 1:N | users | addresses | addresses.user_id | ON DELETE CASCADE |
| Order-OrderItems | 1:N | orders | order_items | order_items.order_id | ON DELETE CASCADE |
| Product-OrderItems | 1:N | products | order_items | order_items.product_id | ON DELETE RESTRICT |
| Category-Products | 1:N | categories | products | products.category_id | ON DELETE RESTRICT |
| Product-Tags | M:N | products | tags | product_tags.product_id, product_tags.tag_id | ON DELETE CASCADE |

### Cardinality Explanations

**users → orders (1:N):**
- One user can place many orders
- Each order belongs to exactly one user
- FK: `orders.user_id` → `users.id`
- Cascade: RESTRICT (don't allow user deletion if orders exist)

**products ↔ tags (M:N):**
- One product can have many tags
- One tag can apply to many products
- Junction: `product_tags (product_id, tag_id)`
- Cascade: CASCADE on both (deleting product or tag removes association)

## Constraints and Rules

### Primary Keys
- All tables use `BIGSERIAL` auto-incrementing PKs
- Named pattern: `{table}_pkey`

### Foreign Keys
- All relationships enforced via FK constraints
- Named pattern: `{table}_{column}_fkey`
- Cascading rules defined based on business logic

### Unique Constraints
- `users.email` (unique among active users)
- `products.sku`
- `orders.order_number`
- Named pattern: `{table}_{column}_unique`

### Check Constraints
- `products.price > 0`
- `products.stock_quantity >= 0`
- `order_items.quantity > 0`
- `orders.total >= 0`

### Indexes
**Performance indexes:**
- Foreign keys: Auto-index for join performance
- Frequently queried columns: `status`, `created_at`
- Search columns: Fulltext on `products.name, description`

**Naming pattern:** `{table}_{columns}_idx`

### Default Values
- `created_at`: `CURRENT_TIMESTAMP`
- `updated_at`: `CURRENT_TIMESTAMP`
- `status`: Appropriate default for entity
- Booleans: Usually `FALSE`

## Data Dictionary

[Link to complete data dictionary with all column definitions]

**Format:**
| Table | Column | Type | Null | Default | Description |
|-------|--------|------|------|---------|-------------|
| users | id | BIGSERIAL | NO | AUTO | Primary key |
| users | email | VARCHAR(255) | NO | - | User email |
[...]

## Schema Evolution

### Version History

| Version | Date | Changes | Migration Script |
|---------|------|---------|------------------|
| 1.0.0 | 2024-01-15 | Initial schema | [migration-001.sql] |
| 1.1.0 | 2024-03-10 | Added product reviews | [migration-002.sql] |
| 1.2.0 | 2024-06-20 | Added soft deletes to users | [migration-003.sql] |
| 2.0.0 | 2025-01-05 | Major refactor: separated addresses | [migration-004.sql] |
| 2.1.0 | 2026-02-01 | Added email verification | [migration-005.sql] |

### Migration Strategy
- **Tool:** [Flyway/Liquibase/Alembic/Custom]
- **Process:** 
  1. Write migration script
  2. Test on development
  3. Review and approve
  4. Apply to staging
  5. Validate
  6. Apply to production during maintenance window
  7. Rollback plan ready

### Deprecation Policy
- Mark as deprecated in version N
- Remove in version N+2
- Provide migration path and docs

## Database Metadata

### Statistics
- **Total tables:** [Number]
- **Total columns:** [Number]
- **Total indexes:** [Number]
- **Total constraints:** [Number]
- **Estimated size:** [GB]
- **Growth rate:** [GB/month]

### Performance Considerations
- **Partitioning:** [Table if partitioned, strategy]
- **Replication:** [Read replicas configuration]
- **Caching:** [Redis cache for frequent queries]
- **Archive strategy:** [Move old orders to archive table after 2 years]

## Appendix

### Tools Used
- **Design:** [dbdiagram.io, draw.io, Lucidchart]
- **Database:** [PostgreSQL 14]
- **Migrations:** [Flyway]
- **ORM:** [SQLAlchemy, Django ORM, Entity Framework]

### Notation Legend
```
[PK] - Primary Key
[FK] - Foreign Key
[U]  - Unique constraint
[NN] - NOT NULL
[CK] - Check constraint
[IX] - Index

Relationships:
────  One-to-One
───>  One-to-Many
<──>  Many-to-Many (via junction table)
```

### References
- Database normalization: 3NF applied
- Naming conventions: [Link to standards doc]
- ER modeling best practices: [Link]

### Approval
- [ ] **Database Architect:** [Name] _________________ Date: _______
- [ ] **Lead Developer:** [Name] _________________ Date: _______
- [ ] **DBA:** [Name] _________________ Date: _______
