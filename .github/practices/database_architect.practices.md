# Database Architect Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Database Architect  
**Purpose:** Guidance for designing, implementing, and maintaining scalable, performant, and reliable database systems with focus on data modeling, optimization, and high availability

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Data Modeling](#data-modeling)
3. [Database Design Patterns](#database-design-patterns)
4. [Performance Optimization](#performance-optimization)
5. [Indexing Strategies](#indexing-strategies)
6. [Query Optimization](#query-optimization)
7. [High Availability & Disaster Recovery](#high-availability--disaster-recovery)
8. [Security & Compliance](#security--compliance)
9. [Scalability & Sharding](#scalability--sharding)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Technologies](#tools--technologies)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Design Philosophy
- **Normalization vs. Denormalization:** Balance data integrity with performance needs
- **ACID compliance:** Ensure atomicity, consistency, isolation, and durability
- **Scalability first:** Design for growth from day one
- **Performance awareness:** Consider query patterns during design
- **Data integrity:** Enforce constraints at the database level

### 1.2 Operational Excellence
- **Monitoring:** Continuous performance and health monitoring
- **Backup strategy:** Regular, tested backups with documented recovery procedures
- **Documentation:** Comprehensive schema documentation and data dictionaries
- **Version control:** Track all schema changes and migrations
- **Capacity planning:** Proactive resource allocation

### 1.3 Security & Compliance
- **Least privilege:** Grant minimum necessary permissions
- **Encryption:** Data at rest and in transit
- **Audit logging:** Track all data access and modifications
- **Compliance:** Meet regulatory requirements (GDPR, HIPAA, SOC 2)
- **Data masking:** Protect sensitive data in non-production environments

---

## Data Modeling

### 2.1 Entity-Relationship Design

**Conceptual Data Model:**
```
┌─────────────────┐
│     Customer    │
├─────────────────┤
│ customer_id (PK)│
│ email (UK)      │
│ first_name      │
│ last_name       │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴────────┐
│      Order      │
├─────────────────┤
│ order_id (PK)   │
│ customer_id (FK)│
│ order_date      │
│ total_amount    │
│ status          │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴────────┐
│   Order_Item    │
├─────────────────┤
│ item_id (PK)    │
│ order_id (FK)   │
│ product_id (FK) │
│ quantity        │
│ unit_price      │
└─────────────────┘
```

**Logical Data Model (PostgreSQL):**
```sql
-- Customer table with proper constraints
CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uk_customers_email UNIQUE (email),
    CONSTRAINT chk_customers_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
    CONSTRAINT chk_customers_dob CHECK (date_of_birth < CURRENT_DATE)
);

-- Addresses table (one-to-many with customers)
CREATE TABLE addresses (
    address_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    address_type VARCHAR(20) NOT NULL, -- 'billing' or 'shipping'
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(2) NOT NULL, -- ISO country code
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    CONSTRAINT fk_addresses_customer 
        FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id) 
        ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_addresses_type 
        CHECK (address_type IN ('billing', 'shipping')),
    CONSTRAINT chk_addresses_country 
        CHECK (country ~ '^[A-Z]{2}$')
);

-- Orders table
CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_address_id BIGINT,
    billing_address_id BIGINT,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_orders_customer 
        FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id),
    CONSTRAINT fk_orders_shipping_address 
        FOREIGN KEY (shipping_address_id) 
        REFERENCES addresses(address_id),
    CONSTRAINT fk_orders_billing_address 
        FOREIGN KEY (billing_address_id) 
        REFERENCES addresses(address_id),
    
    -- Constraints
    CONSTRAINT uk_orders_number UNIQUE (order_number),
    CONSTRAINT chk_orders_status 
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT chk_orders_amounts 
        CHECK (subtotal >= 0 AND tax_amount >= 0 AND shipping_amount >= 0 AND total_amount >= 0)
);

-- Order items table
CREATE TABLE order_items (
    item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(order_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(product_id),
    
    -- Constraints
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_prices 
        CHECK (unit_price >= 0 AND discount_amount >= 0 AND total_price >= 0)
);

-- Products table
CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    price DECIMAL(12, 2) NOT NULL,
    cost DECIMAL(12, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    weight_kg DECIMAL(8, 2),
    dimensions_cm VARCHAR(50), -- Format: "LxWxH"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uk_products_sku UNIQUE (sku),
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_stock CHECK (stock_quantity >= 0)
);

-- Audit trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 Temporal Data Modeling

**Historical Data Tracking:**
```sql
-- Product price history using temporal tables
CREATE TABLE product_price_history (
    history_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100),
    
    CONSTRAINT fk_price_history_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(product_id)
);

-- Function to track price changes
CREATE OR REPLACE FUNCTION track_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        -- Close previous price history
        UPDATE product_price_history
        SET valid_to = CURRENT_TIMESTAMP
        WHERE product_id = NEW.product_id
          AND valid_to IS NULL;
        
        -- Insert new price history
        INSERT INTO product_price_history (product_id, price, valid_from)
        VALUES (NEW.product_id, NEW.price, CURRENT_TIMESTAMP);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_price_change
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.price IS DISTINCT FROM NEW.price)
    EXECUTE FUNCTION track_price_change();

-- Query price at specific point in time
CREATE OR REPLACE FUNCTION get_price_at_date(
    p_product_id BIGINT,
    p_date TIMESTAMP WITH TIME ZONE
)
RETURNS DECIMAL(12, 2) AS $$
    SELECT price
    FROM product_price_history
    WHERE product_id = p_product_id
      AND valid_from <= p_date
      AND (valid_to IS NULL OR valid_to > p_date)
    ORDER BY valid_from DESC
    LIMIT 1;
$$ LANGUAGE SQL STABLE;
```

### 2.3 Document Storage Patterns

**JSON/JSONB Columns for Semi-Structured Data:**
```sql
-- Products with flexible attributes using JSONB
CREATE TABLE products_extended (
    product_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(12, 2) NOT NULL,
    
    -- Flexible attributes stored as JSONB
    attributes JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create GIN index for JSONB queries
CREATE INDEX idx_products_attributes ON products_extended USING GIN (attributes);

-- Create specific index on nested JSONB field
CREATE INDEX idx_products_attributes_brand 
    ON products_extended ((attributes->>'brand'));

-- Sample data
INSERT INTO products_extended (name, category, base_price, attributes) VALUES
('Laptop Pro', 'electronics', 1299.99, '{
    "brand": "TechCorp",
    "specs": {
        "cpu": "Intel i7",
        "ram": "16GB",
        "storage": "512GB SSD"
    },
    "features": ["backlit keyboard", "fingerprint reader"],
    "warranty_years": 3
}'),
('Running Shoes', 'footwear', 89.99, '{
    "brand": "SportFit",
    "size": "10",
    "color": "blue",
    "material": "mesh",
    "features": ["cushioned sole", "breathable"]
}');

-- Query examples
-- Find products by brand
SELECT name, attributes->>'brand' as brand
FROM products_extended
WHERE attributes->>'brand' = 'TechCorp';

-- Find electronics with specific specs
SELECT name, attributes->'specs'->>'cpu' as cpu
FROM products_extended
WHERE category = 'electronics'
  AND attributes->'specs'->>'ram' = '16GB';

-- Find products with specific feature
SELECT name
FROM products_extended
WHERE attributes->'features' @> '["backlit keyboard"]';

-- Update nested JSONB field
UPDATE products_extended
SET attributes = jsonb_set(
    attributes,
    '{specs,ram}',
    '"32GB"'
)
WHERE name = 'Laptop Pro';
```

---

## Database Design Patterns

### 3.1 Denormalization for Performance

**Materialized Views for Complex Aggregations:**
```sql
-- Create materialized view for order statistics
CREATE MATERIALIZED VIEW mv_customer_order_stats AS
SELECT 
    c.customer_id,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as lifetime_value,
    AVG(o.total_amount) as average_order_value,
    MAX(o.order_date) as last_order_date,
    MIN(o.order_date) as first_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status != 'cancelled'
GROUP BY c.customer_id, c.email;

-- Create index on materialized view
CREATE INDEX idx_mv_customer_stats_email 
    ON mv_customer_order_stats(email);
CREATE INDEX idx_mv_customer_stats_ltv 
    ON mv_customer_order_stats(lifetime_value DESC);

-- Refresh strategy (can be scheduled)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_order_stats;

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_customer_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_order_stats;
END;
$$ LANGUAGE plpgsql;
```

### 3.2 Soft Deletes Pattern

**Implement Soft Deletes:**
```sql
-- Add deleted_at column to tables
ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create view for active records only
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE deleted_at IS NULL;

CREATE VIEW active_products AS
SELECT * FROM products WHERE deleted_at IS NULL;

-- Soft delete function
CREATE OR REPLACE FUNCTION soft_delete_customer(p_customer_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE customers
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE customer_id = p_customer_id
      AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Customer % not found or already deleted', p_customer_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Restore function
CREATE OR REPLACE FUNCTION restore_customer(p_customer_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE customers
    SET deleted_at = NULL
    WHERE customer_id = p_customer_id
      AND deleted_at IS NOT NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Customer % not found or not deleted', p_customer_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Event Sourcing Pattern

**Append-Only Event Log:**
```sql
-- Event store table
CREATE TABLE event_store (
    event_id BIGSERIAL PRIMARY KEY,
    aggregate_id VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    metadata JSONB,
    event_version INTEGER NOT NULL DEFAULT 1,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Partition by aggregate type
    CONSTRAINT chk_aggregate_type 
        CHECK (aggregate_type IN ('order', 'customer', 'product'))
) PARTITION BY LIST (aggregate_type);

-- Create partitions
CREATE TABLE event_store_orders PARTITION OF event_store
    FOR VALUES IN ('order');

CREATE TABLE event_store_customers PARTITION OF event_store
    FOR VALUES IN ('customer');

CREATE TABLE event_store_products PARTITION OF event_store
    FOR VALUES IN ('product');

-- Indexes
CREATE INDEX idx_event_store_aggregate 
    ON event_store(aggregate_type, aggregate_id);
CREATE INDEX idx_event_store_occurred 
    ON event_store(occurred_at);

-- Function to add event
CREATE OR REPLACE FUNCTION add_event(
    p_aggregate_id VARCHAR(100),
    p_aggregate_type VARCHAR(50),
    p_event_type VARCHAR(100),
    p_event_data JSONB,
    p_metadata JSONB DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_event_id BIGINT;
BEGIN
    INSERT INTO event_store (
        aggregate_id,
        aggregate_type,
        event_type,
        event_data,
        metadata
    ) VALUES (
        p_aggregate_id,
        p_aggregate_type,
        p_event_type,
        p_event_data,
        p_metadata
    ) RETURNING event_id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Rebuild aggregate state from events
CREATE OR REPLACE FUNCTION rebuild_order_state(p_order_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    v_state JSONB := '{}'::JSONB;
    v_event RECORD;
BEGIN
    FOR v_event IN
        SELECT event_type, event_data
        FROM event_store
        WHERE aggregate_id = p_order_id
          AND aggregate_type = 'order'
        ORDER BY event_id ASC
    LOOP
        -- Apply each event to rebuild state
        CASE v_event.event_type
            WHEN 'OrderCreated' THEN
                v_state := v_event.event_data;
            WHEN 'ItemAdded' THEN
                v_state := jsonb_set(
                    v_state,
                    '{items}',
                    COALESCE(v_state->'items', '[]'::jsonb) || v_event.event_data
                );
            WHEN 'OrderStatusChanged' THEN
                v_state := jsonb_set(
                    v_state,
                    '{status}',
                    v_event.event_data->'new_status'
                );
        END CASE;
    END LOOP;
    
    RETURN v_state;
END;
$$ LANGUAGE plpgsql;
```

---

## Performance Optimization

### 4.1 Query Plan Analysis

**EXPLAIN ANALYZE Best Practices:**
```sql
-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON)
SELECT 
    c.customer_id,
    c.email,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.created_at >= '2025-01-01'
GROUP BY c.customer_id, c.email
HAVING SUM(o.total_amount) > 1000
ORDER BY total_spent DESC
LIMIT 100;

-- Identify slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time,
    stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100 -- queries taking more than 100ms on average
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Find missing indexes
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    seq_tup_read / seq_scan as avg_seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;

-- Unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 4.2 Connection Pooling

**PgBouncer Configuration:**
```ini
[databases]
mydb = host=localhost port=5432 dbname=production_db

[pgbouncer]
listen_addr = *
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

# Pool mode
pool_mode = transaction

# Connection limits
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3

# Server settings
server_reset_query = DISCARD ALL
server_check_delay = 30
server_check_query = SELECT 1

# Timeouts
query_timeout = 30
query_wait_timeout = 120
client_idle_timeout = 0
idle_transaction_timeout = 0

# Logging
admin_users = postgres, admin
stats_users = stats, postgres
log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
```

### 4.3 Partitioning Strategy

**Time-Based Partitioning:**
```sql
-- Create partitioned table for order history
CREATE TABLE orders_partitioned (
    order_id BIGSERIAL,
    customer_id BIGINT NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_orders_partitioned PRIMARY KEY (order_id, order_date)
) PARTITION BY RANGE (order_date);

-- Create partitions for each month
CREATE TABLE orders_2025_01 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE orders_2025_02 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE orders_2025_03 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Create default partition for future data
CREATE TABLE orders_default PARTITION OF orders_partitioned DEFAULT;

-- Function to automatically create future partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(
    p_table_name TEXT,
    p_start_date DATE
)
RETURNS void AS $$
DECLARE
    v_partition_name TEXT;
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    v_start_date := date_trunc('month', p_start_date);
    v_end_date := v_start_date + INTERVAL '1 month';
    v_partition_name := p_table_name || '_' || to_char(v_start_date, 'YYYY_MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
        v_partition_name,
        p_table_name,
        v_start_date,
        v_end_date
    );
    
    RAISE NOTICE 'Created partition: %', v_partition_name;
END;
$$ LANGUAGE plpgsql;

-- Create indexes on partitions
CREATE INDEX idx_orders_2025_01_customer 
    ON orders_2025_01(customer_id);
CREATE INDEX idx_orders_2025_02_customer 
    ON orders_2025_02(customer_id);
```

---

## Indexing Strategies

### 5.1 Index Types and Usage

**B-Tree Indexes (Default):**
```sql
-- Single column index
CREATE INDEX idx_customers_email ON customers(email);

-- Composite index (order matters)
CREATE INDEX idx_orders_customer_date 
    ON orders(customer_id, order_date DESC);

-- Partial index
CREATE INDEX idx_orders_pending 
    ON orders(customer_id) 
    WHERE status = 'pending';

-- Expression index
CREATE INDEX idx_customers_email_lower 
    ON customers(LOWER(email));

-- Covering index (includes additional columns)
CREATE INDEX idx_orders_customer_covering 
    ON orders(customer_id) 
    INCLUDE (order_date, total_amount, status);
```

**GIN Indexes for Full-Text Search:**
```sql
-- Add tsvector column for full-text search
ALTER TABLE products 
ADD COLUMN search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.sku, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trg_products_search_vector
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION products_search_vector_update();

-- Create GIN index
CREATE INDEX idx_products_search 
    ON products USING GIN(search_vector);

-- Full-text search query
SELECT 
    product_id,
    name,
    ts_rank(search_vector, query) AS rank
FROM products, 
     to_tsquery('english', 'laptop & powerful') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

**GiST Indexes for Geometric Data:**
```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table with location data
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create GiST index for spatial queries
CREATE INDEX idx_stores_location 
    ON stores USING GIST(location);

-- Find stores within radius
SELECT 
    store_id,
    name,
    ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)
    ) / 1609.34 AS distance_miles
FROM stores
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326),
    16093.4 -- 10 miles in meters
)
ORDER BY distance_miles
LIMIT 10;
```

### 5.2 Index Maintenance

**Index Health Monitoring:**
```sql
-- Check index bloat
CREATE OR REPLACE VIEW v_index_bloat AS
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_tup_read = 0 THEN 'NEVER READ'
        ELSE 'ACTIVE'
    END as status
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- Reindex specific table
REINDEX TABLE CONCURRENTLY orders;

-- Reindex entire database
REINDEX DATABASE CONCURRENTLY production_db;

-- Scheduled maintenance job
CREATE OR REPLACE FUNCTION maintain_indexes()
RETURNS void AS $$
DECLARE
    v_table RECORD;
BEGIN
    FOR v_table IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('REINDEX TABLE CONCURRENTLY %I.%I', 
            v_table.schemaname, v_table.tablename);
        RAISE NOTICE 'Reindexed table: %.%', 
            v_table.schemaname, v_table.tablename;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## Query Optimization

### 6.1 Complex Query Optimization

**Optimized Aggregation Query:**
```sql
-- Before: Slow query with multiple subqueries
SELECT 
    c.customer_id,
    c.email,
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) as order_count,
    (SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) as total_spent,
    (SELECT MAX(order_date) FROM orders o WHERE o.customer_id = c.customer_id) as last_order_date
FROM customers c
WHERE c.created_at >= '2025-01-01';

-- After: Optimized with single JOIN
SELECT 
    c.customer_id,
    c.email,
    COALESCE(COUNT(o.order_id), 0) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.created_at >= '2025-01-01'
GROUP BY c.customer_id, c.email;

-- Even better: Use CTE for readability
WITH customer_stats AS (
    SELECT 
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent,
        MAX(order_date) as last_order_date
    FROM orders
    GROUP BY customer_id
)
SELECT 
    c.customer_id,
    c.email,
    COALESCE(cs.order_count, 0) as order_count,
    COALESCE(cs.total_spent, 0) as total_spent,
    cs.last_order_date
FROM customers c
LEFT JOIN customer_stats cs ON c.customer_id = cs.customer_id
WHERE c.created_at >= '2025-01-01';
```

### 6.2 Window Functions

**Advanced Analytics with Window Functions:**
```sql
-- Running totals and rankings
SELECT 
    order_id,
    customer_id,
    order_date,
    total_amount,
    
    -- Running total per customer
    SUM(total_amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) as running_total,
    
    -- Order rank per customer
    ROW_NUMBER() OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) as order_number,
    
    -- Moving average (last 3 orders)
    AVG(total_amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_3_orders,
    
    -- Previous order amount
    LAG(total_amount) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) as previous_order_amount,
    
    -- Days since last order
    order_date - LAG(order_date) OVER (
        PARTITION BY customer_id 
        ORDER BY order_date
    ) as days_since_last_order
    
FROM orders
ORDER BY customer_id, order_date;

-- Find top 3 products per category
WITH ranked_products AS (
    SELECT 
        product_id,
        name,
        category_id,
        price,
        ROW_NUMBER() OVER (
            PARTITION BY category_id 
            ORDER BY price DESC
        ) as price_rank
    FROM products
    WHERE is_active = TRUE
)
SELECT *
FROM ranked_products
WHERE price_rank <= 3;
```

---

## High Availability & Disaster Recovery

### 7.1 Replication Setup

**PostgreSQL Streaming Replication:**
```sql
-- Primary server configuration (postgresql.conf)
```
```conf
# Replication settings
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
wal_keep_size = 1GB

# Archive settings
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'

# Hot standby
hot_standby = on
hot_standby_feedback = on
```

**Standby Server Setup:**
```sql
-- Create replication slot on primary
SELECT pg_create_physical_replication_slot('standby_1');

-- recovery.conf on standby (PostgreSQL 12+: postgresql.auto.conf)
```
```conf
primary_conninfo = 'host=primary_host port=5432 user=replicator password=secret'
primary_slot_name = 'standby_1'
```

**Monitoring Replication Lag:**
```sql
-- On primary: Check replication status
SELECT 
    client_addr,
    state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    sync_state,
    pg_wal_lsn_diff(sent_lsn, replay_lsn) AS replication_lag_bytes
FROM pg_stat_replication;

-- On standby: Check lag time
SELECT 
    now() - pg_last_xact_replay_timestamp() AS replication_lag_time;

-- Create monitoring function
CREATE OR REPLACE FUNCTION check_replication_health()
RETURNS TABLE (
    standby_name TEXT,
    lag_bytes BIGINT,
    lag_seconds NUMERIC,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        application_name::TEXT,
        pg_wal_lsn_diff(sent_lsn, replay_lsn),
        EXTRACT(EPOCH FROM (now() - replay_time)),
        CASE 
            WHEN state = 'streaming' AND sync_state = 'sync' THEN 'HEALTHY'
            WHEN state = 'streaming' AND sync_state = 'async' THEN 'ASYNC'
            ELSE 'UNHEALTHY'
        END::TEXT
    FROM pg_stat_replication;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Backup Strategy

**Automated Backup Script:**
```bash
#!/bin/bash
# PostgreSQL backup script with retention

# Configuration
DB_NAME="production_db"
DB_USER="postgres"
BACKUP_DIR="/backups/postgresql"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"

# Create backup directory if not exists
mkdir -p ${BACKUP_DIR}

# Perform backup with compression
pg_dump -U ${DB_USER} -Fc ${DB_NAME} | gzip > ${BACKUP_FILE}

# Check backup success
if [ $? -eq 0 ]; then
    echo "Backup successful: ${BACKUP_FILE}"
    
    # Calculate backup size
    SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo "Backup size: ${SIZE}"
    
    # Remove old backups
    find ${BACKUP_DIR} -name "${DB_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    echo "Removed backups older than ${RETENTION_DAYS} days"
else
    echo "Backup failed!"
    exit 1
fi

# Upload to S3 (optional)
# aws s3 cp ${BACKUP_FILE} s3://my-backups/postgresql/

# Test backup restore (weekly)
if [ $(date +%u) -eq 7 ]; then
    echo "Running weekly backup restore test..."
    createdb -U ${DB_USER} ${DB_NAME}_restore_test
    gunzip -c ${BACKUP_FILE} | pg_restore -U ${DB_USER} -d ${DB_NAME}_restore_test
    
    if [ $? -eq 0 ]; then
        echo "Backup restore test successful"
        dropdb -U ${DB_USER} ${DB_NAME}_restore_test
    else
        echo "Backup restore test FAILED!"
        exit 1
    fi
fi
```

**Point-in-Time Recovery (PITR):**
```sql
-- Enable PITR on primary
-- postgresql.conf
```
```conf
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /archive/%f && cp %p /archive/%f'
max_wal_senders = 3
```

```bash
# Create base backup
pg_basebackup -h primary_host -D /var/lib/postgresql/backup -U replicator -P -X stream

# Restore to specific point in time
# recovery.conf
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2026-02-09 14:30:00'
recovery_target_action = 'promote'
```

---

## Security & Compliance

### 8.1 Row-Level Security

**Implement Multi-Tenant RLS:**
```sql
-- Enable RLS on table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation ON orders
    USING (tenant_id = current_setting('app.current_tenant_id')::INTEGER);

-- Create policy for admin access
CREATE POLICY admin_all_access ON orders
    USING (current_user = 'admin')
    WITH CHECK (current_user = 'admin');

-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_id(p_tenant_id INTEGER)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage in application
SELECT set_tenant_id(123);
SELECT * FROM orders; -- Only sees orders for tenant 123
```

### 8.2 Encryption

**Column-Level Encryption:**
```sql
-- Install pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table with encrypted columns
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ssn_encrypted BYTEA,
    credit_card_encrypted BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to encrypt data
CREATE OR REPLACE FUNCTION encrypt_data(
    p_plain_text TEXT,
    p_key TEXT
)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(p_plain_text, p_key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt data
CREATE OR REPLACE FUNCTION decrypt_data(
    p_encrypted_data BYTEA,
    p_key TEXT
)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(p_encrypted_data, p_key);
END;
$$ LANGUAGE plpgsql;

-- Insert encrypted data
INSERT INTO sensitive_data (user_id, ssn_encrypted, credit_card_encrypted)
VALUES (
    123,
    encrypt_data('123-45-6789', 'encryption_key'),
    encrypt_data('4111-1111-1111-1111', 'encryption_key')
);

-- Query decrypted data
SELECT 
    id,
    user_id,
    decrypt_data(ssn_encrypted, 'encryption_key') as ssn,
    decrypt_data(credit_card_encrypted, 'encryption_key') as credit_card
FROM sensitive_data
WHERE user_id = 123;
```

### 8.3 Audit Logging

**Comprehensive Audit Trail:**
```sql
-- Create audit log table
CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    row_id BIGINT,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    client_ip INET,
    application_name VARCHAR(100)
);

-- Create partition for audit log
CREATE TABLE audit_log_2026_02 PARTITION OF audit_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name,
            operation,
            row_id,
            old_data,
            changed_by,
            client_ip,
            application_name
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            OLD.id,
            row_to_json(OLD)::JSONB,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name,
            operation,
            row_id,
            new_data,
            changed_by,
            client_ip,
            application_name
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            NEW.id,
            row_to_json(NEW)::JSONB,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            table_name,
            operation,
            row_id,
            old_data,
            new_data,
            changed_by,
            client_ip,
            application_name
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            NEW.id,
            row_to_json(OLD)::JSONB,
            row_to_json(NEW)::JSONB,
            current_user,
            inet_client_addr(),
            current_setting('application_name', true)
        );
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to tables
CREATE TRIGGER audit_customers
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

---

## Scalability & Sharding

### 9.1 Horizontal Sharding

**PostgreSQL Foreign Data Wrapper (FDW) for Sharding:**
```sql
-- Install postgres_fdw extension
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Create foreign server definitions
CREATE SERVER shard_1
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'shard1.example.com', port '5432', dbname 'shard_db');

CREATE SERVER shard_2
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'shard2.example.com', port '5432', dbname 'shard_db');

-- Create user mapping
CREATE USER MAPPING FOR postgres
    SERVER shard_1
    OPTIONS (user 'shard_user', password 'password');

CREATE USER MAPPING FOR postgres
    SERVER shard_2
    OPTIONS (user 'shard_user', password 'password');

-- Create foreign tables
CREATE FOREIGN TABLE customers_shard_1 (
    customer_id BIGINT,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) SERVER shard_1;

CREATE FOREIGN TABLE customers_shard_2 (
    customer_id BIGINT,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) SERVER shard_2;

-- Create view to union all shards
CREATE VIEW customers_all AS
SELECT * FROM customers_shard_1
UNION ALL
SELECT * FROM customers_shard_2;

-- Sharding logic function
CREATE OR REPLACE FUNCTION get_shard_for_customer(p_customer_id BIGINT)
RETURNS TEXT AS $$
BEGIN
    RETURN CASE 
        WHEN p_customer_id % 2 = 0 THEN 'shard_1'
        ELSE 'shard_2'
    END;
END;
$$ LANGUAGE plpgsql;
```

### 9.2 Read Replicas Load Balancing

**pgpool-II Configuration:**
```conf
# pgpool.conf

# Load balancing
load_balance_mode = on
statement_level_load_balance = on

# Backend servers
backend_hostname0 = 'primary.example.com'
backend_port0 = 5432
backend_weight0 = 0
backend_flag0 = 'ALWAYS_PRIMARY'

backend_hostname1 = 'replica1.example.com'
backend_port1 = 5432
backend_weight1 = 1
backend_flag1 = 'DISALLOW_TO_FAILOVER'

backend_hostname2 = 'replica2.example.com'
backend_port2 = 5432
backend_weight2 = 1
backend_flag2 = 'DISALLOW_TO_FAILOVER'

# Connection pooling
num_init_children = 32
max_pool = 4

# Health check
health_check_period = 10
health_check_timeout = 20
```

---

## Quality Standards

### 10.1 Database Metrics

**Key Performance Indicators:**
- Query response time: < 100ms for OLTP, < 5s for analytics
- Connection pool utilization: < 80%
- Cache hit ratio: > 95%
- Replication lag: < 1 second
- Index bloat: < 20%
- Table bloat: < 30%
- Backup success rate: 100%
- Recovery time objective (RTO): < 4 hours
- Recovery point objective (RPO): < 15 minutes

### 10.2 Code Review Checklist

- [ ] All foreign keys have indexes
- [ ] Queries use appropriate indexes
- [ ] No SELECT * in application queries
- [ ] Proper use of transactions
- [ ] Connection pooling configured
- [ ] Backup strategy documented
- [ ] Migration scripts tested
- [ ] Security policies implemented
- [ ] Monitoring configured
- [ ] Documentation updated

---

## Integration Points

### 11.1 With Backend Developer
- **Schema changes:** Coordinate database migrations
- **Query optimization:** Review slow queries
- **Connection management:** Configure pooling
- **Transaction boundaries:** Define ACID requirements

### 11.2 With DevOps Engineer
- **Infrastructure:** Provision database servers
- **Monitoring:** Set up alerts and dashboards
- **Backup automation:** Configure backup jobs
- **Disaster recovery:** Test failover procedures

### 11.3 With Security Engineer
- **Access control:** Implement RBAC
- **Encryption:** Enable TLS and column encryption
- **Compliance:** Ensure regulatory adherence
- **Audit logging:** Track data access

---

## Tools & Technologies

### 12.1 Database Systems
- PostgreSQL 15+
- MySQL 8.0+
- MongoDB 6.0+
- Redis 7.0+
- Cassandra 4.0+

### 12.2 Management Tools
- pgAdmin / DBeaver
- DataGrip / TablePlus
- Liquibase / Flyway
- pg_stat_statements
- pg_top / pgBadger

### 12.3 Monitoring
- Prometheus + Grafana
- Datadog / New Relic
- pgMonitor
- CloudWatch (AWS)
- Azure Monitor

---

## Project Type Adaptations

### 13.1 E-Commerce
- High transaction volume
- Product catalog with variants
- Inventory management
- Order processing
- Payment processing

### 13.2 SaaS Multi-Tenant
- Tenant isolation (RLS)
- Schema-per-tenant or shared schema
- Usage metering
- Feature flags per tenant
- Billing and subscriptions

### 13.3 Analytics Platform
- Star/snowflake schema
- Columnar storage (Parquet)
- Data warehousing patterns
- ETL pipelines
- OLAP cubes

### 13.4 Real-Time Applications
- Event sourcing
- CQRS pattern
- Change data capture (CDC)
- Streaming replication
- Low-latency reads

---

## Self-Assessment Checklist

### 14.1 Design Skills
- [ ] Create normalized data models
- [ ] Design for scalability
- [ ] Choose appropriate indexes
- [ ] Implement security controls
- [ ] Plan for disaster recovery

### 14.2 Performance
- [ ] Analyze query plans
- [ ] Optimize slow queries
- [ ] Configure connection pooling
- [ ] Implement caching strategies
- [ ] Monitor database health

### 14.3 Operations
- [ ] Set up replication
- [ ] Configure automated backups
- [ ] Test disaster recovery
- [ ] Implement monitoring
- [ ] Document procedures

### 14.4 Security
- [ ] Implement access controls
- [ ] Enable encryption
- [ ] Configure audit logging
- [ ] Meet compliance requirements
- [ ] Regular security reviews

---

**Document Control:**
- Review quarterly
- Update with new patterns
- Incorporate production learnings
- Align with team standards

---

*Living document - contribute improvements through team's standard process.*
