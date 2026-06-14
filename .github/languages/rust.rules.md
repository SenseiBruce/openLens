# Rust Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** Rust 1.75 (2023 Edition)
- **Recommended Version:** Latest stable
- **Philosophy:** Memory safety without garbage collection, zero-cost abstractions, fearless concurrency

### Core Principles
- Leverage ownership and borrowing system
- Use the type system to prevent errors at compile time
- Embrace Result and Option types for error handling
- Write idiomatic Rust code following community conventions
- Minimize unsafe code usage
- Use cargo clippy and rustfmt

## Naming Conventions

### Modules and Crates
```rust
// GOOD - snake_case for modules and crates
mod user_service;
mod database_connection;

use my_crate::utils::validation;

// BAD - camelCase or PascalCase
mod UserService;
mod DatabaseConnection;
```

### Types and Traits
```rust
// GOOD - PascalCase for types and traits
struct User {
    id: u64,
    username: String,
    email: String,
}

enum OrderStatus {
    Pending,
    Processing,
    Completed,
    Cancelled,
}

trait Repository {
    fn find_by_id(&self, id: u64) -> Result<User, Error>;
    fn save(&mut self, user: User) -> Result<(), Error>;
}

// BAD - snake_case or inconsistent
struct user {}
enum order_status {}
trait repository {}
```

### Functions and Variables
```rust
// GOOD - snake_case for functions and variables
fn calculate_total_price(items: &[Item]) -> f64 {
    let mut total_amount = 0.0;
    let item_count = items.len();
    
    for item in items {
        total_amount += item.price;
    }
    
    total_amount
}

// Private module function
fn validate_email(email: &str) -> Result<(), ValidationError> {
    // Implementation
}

// BAD - camelCase or PascalCase
fn CalculateTotalPrice(items: &[Item]) -> f64 {}
fn validateEmail(email: &str) -> Result<(), ValidationError> {}
```

### Constants and Statics
```rust
// GOOD - SCREAMING_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS: u32 = 3;
const DEFAULT_TIMEOUT_SECS: u64 = 30;
const API_BASE_URL: &str = "https://api.example.com";

static GLOBAL_CONFIG: Lazy<Config> = Lazy::new(|| {
    Config::load()
});

// BAD - camelCase or PascalCase
const maxRetryAttempts: u32 = 3;
const MaxRetryAttempts: u32 = 3;
```

## Code Structure

### Module Organization
```rust
// user.rs
use std::error::Error;
use std::fmt;

use serde::{Deserialize, Serialize};
use thiserror::Error;

// Public types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub email: String,
    #[serde(skip)]
    password_hash: String,
}

#[derive(Debug, Error)]
pub enum UserError {
    #[error("User not found: {0}")]
    NotFound(u64),
    
    #[error("Invalid email format: {0}")]
    InvalidEmail(String),
    
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
}

// Public trait
pub trait UserRepository {
    async fn find_by_id(&self, id: u64) -> Result<Option<User>, UserError>;
    async fn save(&self, user: &User) -> Result<(), UserError>;
}

// Public implementation
pub struct UserService<R: UserRepository> {
    repository: R,
}

impl<R: UserRepository> UserService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
    
    pub async fn create_user(
        &self,
        username: String,
        email: String,
    ) -> Result<User, UserError> {
        validate_email(&email)?;
        
        let user = User {
            id: 0, // Will be set by database
            username,
            email,
            password_hash: String::new(),
        };
        
        self.repository.save(&user).await?;
        Ok(user)
    }
}

// Private helper functions
fn validate_email(email: &str) -> Result<(), UserError> {
    if !email.contains('@') {
        return Err(UserError::InvalidEmail(email.to_string()));
    }
    Ok(())
}
```

## Ownership and Borrowing

### Ownership Patterns
```rust
// GOOD - Clear ownership semantics
fn process_user(user: User) -> User {
    // Takes ownership, returns ownership
    println!("Processing: {}", user.username);
    user
}

fn display_user(user: &User) {
    // Borrows immutably
    println!("User: {}", user.username);
}

fn update_user(user: &mut User) {
    // Borrows mutably
    user.username = user.username.to_uppercase();
}

// Using references appropriately
fn main() {
    let mut user = User {
        id: 1,
        username: "john".to_string(),
        email: "john@example.com".to_string(),
    };
    
    display_user(&user);       // Borrow
    update_user(&mut user);    // Mutable borrow
    let user = process_user(user); // Move ownership
}
```

### Lifetime Annotations
```rust
// GOOD - Explicit lifetime annotations when needed
struct UserRef<'a> {
    username: &'a str,
    email: &'a str,
}

impl<'a> UserRef<'a> {
    fn new(username: &'a str, email: &'a str) -> Self {
        Self { username, email }
    }
}

// Multiple lifetimes
fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &'a str
where
    'b: 'a,
{
    if x.len() > y.len() {
        x
    } else {
        // This won't compile unless 'b: 'a
        x
    }
}

// Lifetime elision (compiler infers)
fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}
```

### Smart Pointers
```rust
use std::rc::Rc;
use std::sync::{Arc, Mutex};
use std::cell::RefCell;

// GOOD - Use appropriate smart pointers
// Box for heap allocation
let boxed_value = Box::new(ExpensiveData::new());

// Rc for shared ownership (single-threaded)
let shared = Rc::new(vec![1, 2, 3]);
let clone1 = Rc::clone(&shared);
let clone2 = Rc::clone(&shared);

// Arc for thread-safe shared ownership
let shared_data = Arc::new(Mutex::new(vec![1, 2, 3]));
let clone = Arc::clone(&shared_data);

std::thread::spawn(move || {
    let mut data = clone.lock().unwrap();
    data.push(4);
});

// RefCell for interior mutability (single-threaded)
let value = RefCell::new(5);
*value.borrow_mut() += 1;
```

## Error Handling

### Result and Option
```rust
// GOOD - Use Result for fallible operations
use thiserror::Error;

#[derive(Debug, Error)]
enum AppError {
    #[error("User not found: {0}")]
    UserNotFound(u64),
    
    #[error("Validation error: {0}")]
    Validation(String),
    
    #[error("Database error")]
    Database(#[from] sqlx::Error),
    
    #[error("I/O error")]
    Io(#[from] std::io::Error),
}

type Result<T> = std::result::Result<T, AppError>;

fn get_user(id: u64) -> Result<User> {
    repository
        .find_by_id(id)?
        .ok_or(AppError::UserNotFound(id))
}

// Option for values that may not exist
fn find_user_by_email(email: &str) -> Option<User> {
    users.iter().find(|u| u.email == email).cloned()
}

// Combining Result and Option
fn get_user_email(id: u64) -> Result<String> {
    let user = get_user(id)?;
    Ok(user.email)
}
```

### Error Propagation
```rust
// GOOD - Use ? operator for error propagation
async fn process_order(order_id: u64) -> Result<Order> {
    let order = fetch_order(order_id).await?;
    let payment = process_payment(&order).await?;
    
    order.status = OrderStatus::Completed;
    save_order(&order).await?;
    
    Ok(order)
}

// Custom error contexts
use anyhow::{Context, Result};

async fn load_config(path: &str) -> Result<Config> {
    let contents = tokio::fs::read_to_string(path)
        .await
        .context("Failed to read config file")?;
        
    serde_json::from_str(&contents)
        .context("Failed to parse config JSON")
}
```

## Pattern Matching and Enums
```rust
// GOOD - Exhaustive pattern matching
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(u8, u8, u8),
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => {
            println!("Quitting");
        }
        Message::Move { x, y } => {
            println!("Moving to ({}, {})", x, y);
        }
        Message::Write(text) => {
            println!("Writing: {}", text);
        }
        Message::ChangeColor(r, g, b) => {
            println!("Changing color to RGB({}, {}, {})", r, g, b);
        }
    }
}

// Pattern matching with guards
fn describe_number(n: i32) -> &'static str {
    match n {
        0 => "zero",
        n if n < 0 => "negative",
        1..=10 => "small positive",
        11..=100 => "medium positive",
        _ => "large positive",
    }
}

// Result pattern matching
match get_user(id) {
    Ok(user) => println!("Found user: {}", user.username),
    Err(AppError::UserNotFound(id)) => println!("User {} not found", id),
    Err(e) => eprintln!("Error: {}", e),
}

// if let for single pattern
if let Some(user) = find_user_by_email("test@example.com") {
    println!("Found: {}", user.username);
}
```

## Traits and Generics

### Trait Implementation
```rust
// GOOD - Implement common traits
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq)]
struct User {
    id: u64,
    username: String,
}

// Custom Display implementation
impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "User(id={}, username={})", self.id, self.username)
    }
}

// Define custom traits
trait Validate {
    fn validate(&self) -> Result<(), ValidationError>;
}

impl Validate for User {
    fn validate(&self) -> Result<(), ValidationError> {
        if self.username.is_empty() {
            return Err(ValidationError::EmptyField("username"));
        }
        Ok(())
    }
}
```

### Generic Functions and Types
```rust
// GOOD - Use generics with trait bounds
fn find_by_predicate<T, F>(items: &[T], predicate: F) -> Option<&T>
where
    F: Fn(&T) -> bool,
{
    items.iter().find(|item| predicate(item))
}

// Generic struct
struct Repository<T> {
    items: Vec<T>,
}

impl<T: Clone> Repository<T> {
    fn new() -> Self {
        Self { items: Vec::new() }
    }
    
    fn add(&mut self, item: T) {
        self.items.push(item);
    }
    
    fn get(&self, index: usize) -> Option<T> {
        self.items.get(index).cloned()
    }
}

// Associated types in traits
trait Iterator {
    type Item;
    
    fn next(&mut self) -> Option<Self::Item>;
}
```

## Async/Await (Tokio)

### Async Functions
```rust
use tokio;

// GOOD - Async function patterns
async fn fetch_user(id: u64) -> Result<User> {
    let response = reqwest::get(format!("https://api.example.com/users/{}", id))
        .await?;
        
    let user = response.json::<User>().await?;
    Ok(user)
}

// Parallel async operations
async fn fetch_user_profile(user_id: u64) -> Result<UserProfile> {
    let (user, posts, comments) = tokio::try_join!(
        fetch_user(user_id),
        fetch_user_posts(user_id),
        fetch_user_comments(user_id)
    )?;
    
    Ok(UserProfile { user, posts, comments })
}

// Timeout
use tokio::time::{timeout, Duration};

async fn fetch_with_timeout(url: &str) -> Result<String> {
    let result = timeout(
        Duration::from_secs(30),
        reqwest::get(url)
    ).await??;
    
    Ok(result.text().await?)
}

// Select between futures
use tokio::select;

async fn race_requests(url1: &str, url2: &str) -> Result<String> {
    select! {
        result = reqwest::get(url1) => Ok(result?.text().await?),
        result = reqwest::get(url2) => Ok(result?.text().await?),
    }
}
```

## Security Patterns

### Input Validation
```rust
use regex::Regex;
use once_cell::sync::Lazy;

static EMAIL_REGEX: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap()
});

#[derive(Debug, Error)]
pub enum ValidationError {
    #[error("Invalid email format")]
    InvalidEmail,
    
    #[error("Username too short (minimum 3 characters)")]
    UsernameTooShort,
    
    #[error("Password too weak")]
    WeakPassword,
}

pub fn validate_email(email: &str) -> Result<(), ValidationError> {
    if !EMAIL_REGEX.is_match(email) {
        return Err(ValidationError::InvalidEmail);
    }
    Ok(())
}

pub fn validate_username(username: &str) -> Result<(), ValidationError> {
    if username.len() < 3 {
        return Err(ValidationError::UsernameTooShort);
    }
    Ok(())
}
```

### SQL Injection Prevention
```rust
use sqlx::{PgPool, FromRow};

// GOOD - Use parameterized queries with sqlx
#[derive(FromRow)]
struct User {
    id: i64,
    username: String,
    email: String,
}

async fn get_user_by_email(pool: &PgPool, email: &str) -> Result<Option<User>> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, username, email FROM users WHERE email = $1"
    )
    .bind(email)
    .fetch_optional(pool)
    .await?;
    
    Ok(user)
}

// With query! macro for compile-time verification
async fn get_user_verified(pool: &PgPool, email: &str) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        "SELECT id, username, email FROM users WHERE email = $1",
        email
    )
    .fetch_optional(pool)
    .await?;
    
    Ok(user)
}
```

### Password Hashing
```rust
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::SaltString;
use rand_core::OsRng;

pub fn hash_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| anyhow!("Failed to hash password: {}", e))?
        .to_string();
        
    Ok(password_hash)
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| anyhow!("Invalid password hash: {}", e))?;
        
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}
```

## Testing Standards

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_validate_email_valid() {
        let result = validate_email("user@example.com");
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_validate_email_invalid() {
        let result = validate_email("invalid-email");
        assert!(result.is_err());
    }
    
    #[test]
    #[should_panic(expected = "Username too short")]
    fn test_short_username_panics() {
        validate_username("ab").unwrap();
    }
    
    // Async tests
    #[tokio::test]
    async fn test_fetch_user() {
        let user = fetch_user(1).await;
        assert!(user.is_ok());
    }
    
    // Parameterized tests with rstest
    use rstest::rstest;
    
    #[rstest]
    #[case("user@example.com", true)]
    #[case("invalid", false)]
    #[case("@example.com", false)]
    fn test_email_validation(#[case] email: &str, #[case] expected: bool) {
        assert_eq!(validate_email(email).is_ok(), expected);
    }
}
```

### Integration Tests
```rust
// tests/integration_test.rs
use my_crate::*;

#[tokio::test]
async fn test_user_creation_flow() {
    let pool = setup_test_database().await;
    let service = UserService::new(pool);
    
    let user = service
        .create_user("testuser", "test@example.com")
        .await
        .expect("Failed to create user");
        
    assert_eq!(user.username, "testuser");
    assert_eq!(user.email, "test@example.com");
}
```

### Mock and Trait Objects
```rust
// Using trait objects for testing
#[cfg(test)]
mod tests {
    struct MockRepository {
        users: Vec<User>,
    }
    
    #[async_trait]
    impl UserRepository for MockRepository {
        async fn find_by_id(&self, id: u64) -> Result<Option<User>> {
            Ok(self.users.iter().find(|u| u.id == id).cloned())
        }
        
        async fn save(&self, user: &User) -> Result<()> {
            Ok(())
        }
    }
    
    #[tokio::test]
    async fn test_with_mock() {
        let mock_repo = MockRepository {
            users: vec![
                User {
                    id: 1,
                    username: "test".to_string(),
                    email: "test@example.com".to_string(),
                }
            ],
        };
        
        let service = UserService::new(mock_repo);
        let user = service.get_user(1).await.unwrap();
        assert_eq!(user.username, "test");
    }
}
```

## Clippy Configuration

### clippy.toml
```toml
# Clippy configuration
cognitive-complexity-threshold = 15
```

### Cargo.toml
```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.35", features = ["full"] }
sqlx = { version = "0.7", features = ["postgres", "runtime-tokio-native-tls"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
thiserror = "1.0"
anyhow = "1.0"
regex = "1.10"
argon2 = "0.5"

[dev-dependencies]
rstest = "0.18"

[profile.release]
lto = true
codegen-units = 1
panic = 'abort'
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Rust Linting and Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Rust
      uses: dtolnay/rust-toolchain@stable
      with:
        components: rustfmt, clippy
    
    - name: Cache cargo
      uses: actions/cache@v3
      with:
        path: |
          ~/.cargo/bin/
          ~/.cargo/registry/index/
          ~/.cargo/registry/cache/
          ~/.cargo/git/db/
          target/
        key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
    
    - name: Run rustfmt
      run: cargo fmt -- --check
    
    - name: Run clippy
      run: cargo clippy -- -D warnings
    
    - name: Build
      run: cargo build --verbose
    
    - name: Run tests
      run: cargo test --verbose
    
    - name: Generate coverage
      run: |
        cargo install cargo-tarpaulin
        cargo tarpaulin --out Xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./cobertura.xml
```

## Common Anti-Patterns

### Unnecessary Cloning
```rust
// BAD
fn process_data(data: &Vec<String>) {
    let cloned = data.clone();
    // Use cloned...
}

// GOOD
fn process_data(data: &[String]) {
    // Use data directly
}
```

### Ignoring Results
```rust
// BAD
let _ = risky_operation();

// GOOD
risky_operation().expect("Operation failed");
// or
if let Err(e) = risky_operation() {
    eprintln!("Error: {}", e);
}
```

## Code Review Checklist

- [ ] No unnecessary `clone()` or `copy()`
- [ ] All `Result` types handled (no ignored errors)
- [ ] Minimal use of `unwrap()` and `expect()`
- [ ] Proper lifetime annotations
- [ ] No unsafe code without justification
- [ ] clippy passes with no warnings
- [ ] rustfmt applied
- [ ] Test coverage >= 85%
- [ ] Documentation comments on public items
- [ ] No compiler warnings

---

**Enforcement:** These rules are automatically enforced through Clippy, rustfmt, and CI/CD pipelines.
