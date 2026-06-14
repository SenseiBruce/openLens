# Go Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** Go 1.21
- **Recommended Version:** Go 1.22+
- **Philosophy:** Simplicity, explicitness, and composition over inheritance

### Core Principles
- Write simple, idiomatic Go code
- Embrace explicit error handling
- Use interfaces for abstraction
- Leverage goroutines and channels for concurrency
- Follow standard library patterns
- Prioritize readability and maintainability

## Naming Conventions

### Packages
```go
// GOOD - lowercase, single word
package user
package database
package httputil

// BAD - camelCase, underscores, or multiple words
package userService
package user_service
package UserService
```

### Variables and Functions
```go
// GOOD - camelCase, exported names start with uppercase
package user

type User struct {
    ID       int64  // Exported
    Username string // Exported
    email    string // Unexported (private)
}

func NewUser(username, email string) *User {
    return &User{
        Username: username,
        email:    email,
    }
}

func (u *User) GetEmail() string {
    return u.email
}

// Private function
func validateEmail(email string) error {
    // Implementation
}

// BAD - snake_case or inconsistent casing
func new_user(username string) *User {}
func (u *User) get_Email() string {}
```

### Constants and Errors
```go
// GOOD - camelCase for constants, descriptive error names
const (
    MaxRetryAttempts = 3
    DefaultTimeout   = 30 * time.Second
    APIBaseURL       = "https://api.example.com"
)

var (
    ErrUserNotFound     = errors.New("user not found")
    ErrInvalidEmail     = errors.New("invalid email format")
    ErrUnauthorized     = errors.New("unauthorized access")
)

// BAD - Inconsistent naming
const MAX_RETRY_ATTEMPTS = 3
var ErrorUserNotFound = errors.New("user not found")
```

### Interfaces
```go
// GOOD - Single-method interfaces end with "er"
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type UserRepository interface {
    FindByID(id int64) (*User, error)
    Save(user *User) error
    Delete(id int64) error
}

// BAD - Redundant naming
type IUserRepository interface {}  // Don't prefix with I
type UserRepositoryInterface interface {}
```

## Code Structure

### Package Organization
```go
// user/user.go
package user

import (
    "context"
    "errors"
    "fmt"
    "time"
    
    "github.com/example/myapp/database"
)

var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidInput = errors.New("invalid input")
)

// User represents a user entity
type User struct {
    ID        int64
    Username  string
    Email     string
    CreatedAt time.Time
}

// Repository defines the interface for user storage
type Repository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Save(ctx context.Context, user *User) error
}

// Service handles user business logic
type Service struct {
    repo Repository
}

// NewService creates a new user service
func NewService(repo Repository) *Service {
    return &Service{repo: repo}
}

// CreateUser creates a new user
func (s *Service) CreateUser(ctx context.Context, username, email string) (*User, error) {
    if err := validateEmail(email); err != nil {
        return nil, fmt.Errorf("validation failed: %w", err)
    }
    
    user := &User{
        Username:  username,
        Email:     email,
        CreatedAt: time.Now(),
    }
    
    if err := s.repo.Save(ctx, user); err != nil {
        return nil, fmt.Errorf("failed to save user: %w", err)
    }
    
    return user, nil
}

// Helper functions (unexported)
func validateEmail(email string) error {
    // Implementation
    return nil
}
```

### File Naming
```go
// GOOD - descriptive names
user.go          // Main types
user_test.go     // Tests
user_service.go  // Service implementation
repository.go    // Repository interface

// BAD - unclear or inconsistent
usr.go
UserService.go
```

## Idiomatic Go Patterns

### Error Handling
```go
// GOOD - Explicit error handling
func GetUser(id int64) (*User, error) {
    user, err := repository.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("failed to get user %d: %w", id, err)
    }
    return user, nil
}

// Check specific errors
func ProcessUser(id int64) error {
    user, err := GetUser(id)
    if err != nil {
        if errors.Is(err, ErrUserNotFound) {
            return fmt.Errorf("user does not exist: %w", err)
        }
        return fmt.Errorf("unexpected error: %w", err)
    }
    
    // Process user
    return nil
}

// Custom error types
type ValidationError struct {
    Field string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// BAD - Ignoring errors
user, _ := GetUser(id)  // Never ignore errors!
```

### Context Usage
```go
// GOOD - Pass context as first parameter
func (s *Service) ProcessRequest(ctx context.Context, data string) error {
    // Check for cancellation
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
    }
    
    // Use context in downstream calls
    result, err := s.database.Query(ctx, "SELECT * FROM users")
    if err != nil {
        return err
    }
    
    return s.handleResult(ctx, result)
}

// Handle timeouts
func FetchDataWithTimeout(url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }
    
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    return io.ReadAll(resp.Body)
}
```

### Defer Usage
```go
// GOOD - Use defer for cleanup
func ReadFile(filename string) ([]byte, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()  // Ensure file is closed
    
    return io.ReadAll(file)
}

// Multiple defers execute in LIFO order
func ProcessTransaction() error {
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    defer tx.Rollback()  // Rollback if commit doesn't happen
    
    // Do work...
    
    if err := tx.Commit(); err != nil {
        return err
    }
    
    return nil
}

// BAD - Manual cleanup (easy to forget)
func ReadFileBad(filename string) ([]byte, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    
    data, err := io.ReadAll(file)
    file.Close()  // What if ReadAll panics?
    return data, err
}
```

### Interface Composition
```go
// GOOD - Small, composable interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}

// Use interfaces for dependencies
type UserService struct {
    storage   UserStorage
    validator EmailValidator
    logger    Logger
}

type UserStorage interface {
    Save(user *User) error
    Find(id int64) (*User, error)
}

type EmailValidator interface {
    Validate(email string) bool
}

type Logger interface {
    Info(msg string)
    Error(msg string)
}
```

### Goroutines and Channels
```go
// GOOD - Proper goroutine management
func ProcessItems(items []Item) error {
    results := make(chan Result, len(items))
    errors := make(chan error, len(items))
    
    // Start workers
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            
            result, err := processItem(item)
            if err != nil {
                errors <- err
                return
            }
            results <- result
        }(item)  // Pass item as parameter to avoid closure issues
    }
    
    // Wait for completion
    go func() {
        wg.Wait()
        close(results)
        close(errors)
    }()
    
    // Collect results
    for range items {
        select {
        case err := <-errors:
            return fmt.Errorf("processing error: %w", err)
        case result := <-results:
            // Handle result
        }
    }
    
    return nil
}

// Worker pool pattern
func WorkerPool(jobs <-chan Job, results chan<- Result, workerCount int) {
    var wg sync.WaitGroup
    
    for i := 0; i < workerCount; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- processJob(job)
            }
        }()
    }
    
    wg.Wait()
    close(results)
}
```

## Security Patterns

### SQL Injection Prevention
```go
// GOOD - Use parameterized queries
import "database/sql"

func GetUserByEmail(db *sql.DB, email string) (*User, error) {
    query := "SELECT id, username, email FROM users WHERE email = $1"
    
    var user User
    err := db.QueryRow(query, email).Scan(&user.ID, &user.Username, &user.Email)
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, ErrUserNotFound
        }
        return nil, fmt.Errorf("query failed: %w", err)
    }
    
    return &user, nil
}

// BAD - String concatenation (SQL INJECTION RISK)
func GetUserByEmailUnsafe(db *sql.DB, email string) (*User, error) {
    query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
    // Attacker can inject: ' OR '1'='1
    rows, err := db.Query(query)
    // ...
}
```

### Input Validation
```go
// GOOD - Validate all inputs
import (
    "regexp"
    "unicode/utf8"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

type Validator struct{}

func (v *Validator) ValidateEmail(email string) error {
    if email == "" {
        return errors.New("email is required")
    }
    
    if utf8.RuneCountInString(email) > 254 {
        return errors.New("email too long")
    }
    
    if !emailRegex.MatchString(email) {
        return errors.New("invalid email format")
    }
    
    return nil
}

func (v *Validator) ValidateUsername(username string) error {
    if len := utf8.RuneCountInString(username); len < 3 || len > 50 {
        return errors.New("username must be 3-50 characters")
    }
    
    if !regexp.MustCompile(`^[a-zA-Z0-9_]+$`).MatchString(username) {
        return errors.New("username can only contain alphanumeric characters and underscores")
    }
    
    return nil
}

type CreateUserRequest struct {
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

func (r *CreateUserRequest) Validate() error {
    validator := &Validator{}
    
    if err := validator.ValidateUsername(r.Username); err != nil {
        return fmt.Errorf("invalid username: %w", err)
    }
    
    if err := validator.ValidateEmail(r.Email); err != nil {
        return fmt.Errorf("invalid email: %w", err)
    }
    
    if len(r.Password) < 8 {
        return errors.New("password must be at least 8 characters")
    }
    
    return nil
}
```

### Password Security
```go
// GOOD - Use bcrypt for password hashing
import "golang.org/x/crypto/bcrypt"

const bcryptCost = 12

func HashPassword(password string) (string, error) {
    hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
    if err != nil {
        return "", fmt.Errorf("failed to hash password: %w", err)
    }
    return string(hashed), nil
}

func VerifyPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

// BAD - Weak hashing
import "crypto/md5"

func HashPasswordWeak(password string) string {
    hash := md5.Sum([]byte(password))
    return fmt.Sprintf("%x", hash)  // WEAK!
}
```

### Environment Variables
```go
// GOOD - Validate required environment variables at startup
import "os"

type Config struct {
    DatabaseURL string
    JWTSecret   string
    APIKey      string
    Port        string
}

func LoadConfig() (*Config, error) {
    config := &Config{
        DatabaseURL: os.Getenv("DATABASE_URL"),
        JWTSecret:   os.Getenv("JWT_SECRET"),
        APIKey:      os.Getenv("API_KEY"),
        Port:        os.Getenv("PORT"),
    }
    
    if err := config.Validate(); err != nil {
        return nil, err
    }
    
    return config, nil
}

func (c *Config) Validate() error {
    if c.DatabaseURL == "" {
        return errors.New("DATABASE_URL is required")
    }
    
    if len(c.JWTSecret) < 32 {
        return errors.New("JWT_SECRET must be at least 32 characters")
    }
    
    if c.APIKey == "" {
        return errors.New("API_KEY is required")
    }
    
    if c.Port == "" {
        c.Port = "8080"  // Default value
    }
    
    return nil
}

// BAD - Hardcoded secrets
const (
    JWTSecret = "my-secret-key"  // NEVER DO THIS!
    APIKey    = "sk-1234567890"
)
```

### Secure HTTP Handlers
```go
// GOOD - Secure HTTP handler patterns
import (
    "encoding/json"
    "net/http"
    "time"
)

func SecureHandler(w http.ResponseWriter, r *http.Request) {
    // Set security headers
    w.Header().Set("X-Content-Type-Options", "nosniff")
    w.Header().Set("X-Frame-Options", "DENY")
    w.Header().Set("X-XSS-Protection", "1; mode=block")
    w.Header().Set("Content-Security-Policy", "default-src 'self'")
    
    // Limit request body size
    r.Body = http.MaxBytesReader(w, r.Body, 1048576) // 1MB
    
    // Parse and validate input
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    
    if err := req.Validate(); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    // Process request...
}

// Timeout middleware
func TimeoutMiddleware(timeout time.Duration) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            ctx, cancel := context.WithTimeout(r.Context(), timeout)
            defer cancel()
            
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}
```

## Testing Standards

### Table-Driven Tests
```go
// GOOD - Table-driven tests
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {
            name:    "valid email",
            email:   "user@example.com",
            wantErr: false,
        },
        {
            name:    "invalid format",
            email:   "invalid-email",
            wantErr: true,
        },
        {
            name:    "missing domain",
            email:   "user@",
            wantErr: true,
        },
        {
            name:    "missing local part",
            email:   "@example.com",
            wantErr: true,
        },
        {
            name:    "empty email",
            email:   "",
            wantErr: true,
        },
    }
    
    validator := &Validator{}
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := validator.ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
```

### Mocking and Interfaces
```go
// user_service_test.go

// Mock implementation
type MockUserRepository struct {
    FindByIDFunc func(ctx context.Context, id int64) (*User, error)
    SaveFunc     func(ctx context.Context, user *User) error
}

func (m *MockUserRepository) FindByID(ctx context.Context, id int64) (*User, error) {
    if m.FindByIDFunc != nil {
        return m.FindByIDFunc(ctx, id)
    }
    return nil, errors.New("not implemented")
}

func (m *MockUserRepository) Save(ctx context.Context, user *User) error {
    if m.SaveFunc != nil {
        return m.SaveFunc(ctx, user)
    }
    return errors.New("not implemented")
}

func TestCreateUser(t *testing.T) {
    mockRepo := &MockUserRepository{
        SaveFunc: func(ctx context.Context, user *User) error {
            user.ID = 1
            return nil
        },
    }
    
    service := NewService(mockRepo)
    
    user, err := service.CreateUser(context.Background(), "testuser", "test@example.com")
    if err != nil {
        t.Fatalf("CreateUser() error = %v", err)
    }
    
    if user.ID != 1 {
        t.Errorf("Expected ID = 1, got %d", user.ID)
    }
    
    if user.Username != "testuser" {
        t.Errorf("Expected username = testuser, got %s", user.Username)
    }
}
```

### Benchmark Tests
```go
// Benchmark tests
func BenchmarkProcessItems(b *testing.B) {
    items := make([]Item, 1000)
    // Initialize items...
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        ProcessItems(items)
    }
}

func BenchmarkHashPassword(b *testing.B) {
    password := "SecurePassword123"
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        HashPassword(password)
    }
}
```

### Test Coverage
```bash
# Run tests with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Fail if coverage below threshold
go test -cover ./... | grep -E 'coverage: [0-9]+' | awk '{if ($2 < 90) exit 1}'
```

## Performance Optimization

### Efficient String Operations
```go
// GOOD - Use strings.Builder for concatenation
func BuildReport(items []string) string {
    var builder strings.Builder
    for _, item := range items {
        builder.WriteString(item)
        builder.WriteString("\n")
    }
    return builder.String()
}

// BAD - String concatenation in loop
func BuildReportBad(items []string) string {
    result := ""
    for _, item := range items {
        result += item + "\n"  // Creates new string each time
    }
    return result
}
```

### Slice Preallocation
```go
// GOOD - Preallocate slices when size is known
func FilterItems(items []Item, predicate func(Item) bool) []Item {
    result := make([]Item, 0, len(items))  // Preallocate capacity
    for _, item := range items {
        if predicate(item) {
            result = append(result, item)
        }
    }
    return result
}
```

### Efficient Map Usage
```go
// GOOD - Check map existence before use
func GetValue(cache map[string]string, key string) (string, bool) {
    value, exists := cache[key]
    return value, exists
}

// Use sync.Map for concurrent access
var cache sync.Map

func SetCacheValue(key, value string) {
    cache.Store(key, value)
}

func GetCacheValue(key string) (string, bool) {
    value, ok := cache.Load(key)
    if !ok {
        return "", false
    }
    return value.(string), true
}
```

## Documentation Standards

### Package Documentation
```go
// Package user provides user management functionality.
//
// This package handles user creation, authentication, and profile management.
// It includes validation, password hashing, and database operations.
//
// Example usage:
//
//	repo := NewRepository(db)
//	service := NewService(repo)
//	user, err := service.CreateUser(ctx, "john_doe", "john@example.com")
//	if err != nil {
//		log.Fatal(err)
//	}
package user
```

### Function Documentation
```go
// CreateUser creates a new user with the given credentials.
//
// The username must be 3-50 characters and contain only alphanumeric
// characters and underscores. The email must be in valid email format.
// The password will be hashed using bcrypt before storage.
//
// Returns the created user with generated ID or an error if validation
// or storage fails.
func (s *Service) CreateUser(ctx context.Context, username, email string) (*User, error) {
    // Implementation
}
```

## golint/staticcheck Configuration

### .golangci.yml
```yaml
linters:
  enable:
    - gofmt
    - golint
    - govet
    - errcheck
    - staticcheck
    - ineffassign
    - misspell
    - gosec
    - gocyclo
    - dupl
    - goconst
    
linters-settings:
  gocyclo:
    min-complexity: 15
  dupl:
    threshold: 100
  goconst:
    min-len: 3
    min-occurrences: 3
  misspell:
    locale: US
  gosec:
    excludes:
      - G304  # File path provided as argument
      
issues:
  exclude-use-default: false
  max-issues-per-linter: 0
  max-same-issues: 0
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Go Linting and Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.22'
    
    - name: Run golangci-lint
      uses: golangci/golangci-lint-action@v4
      with:
        version: latest
    
    - name: Run tests
      run: go test -v -race -coverprofile=coverage.out ./...
    
    - name: Check coverage
      run: |
        coverage=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
        if (( $(echo "$coverage < 90" | bc -l) )); then
          echo "Coverage $coverage% is below 90%"
          exit 1
        fi
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage.out
```

## Common Anti-Patterns

### Ignoring Errors
```go
// BAD
data, _ := ioutil.ReadFile("file.txt")

// GOOD
data, err := ioutil.ReadFile("file.txt")
if err != nil {
    return fmt.Errorf("failed to read file: %w", err)
}
```

### Not Using Context
```go
// BAD
func DoWork() error {
    // Long running operation
}

// GOOD
func DoWork(ctx context.Context) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
        // Work
    }
}
```

## Code Review Checklist

- [ ] Exported names have comments
- [ ] Errors are handled explicitly
- [ ] Context passed to all blocking operations
- [ ] defer used for cleanup
- [ ] Goroutines don't leak
- [ ] Input validation on all external data
- [ ] No hardcoded secrets
- [ ] Table-driven tests
- [ ] Test coverage >= 90%
- [ ] golangci-lint passes
- [ ] go vet passes
- [ ] gofmt applied

---

**Enforcement:** These rules are automatically enforced through golangci-lint, staticcheck, and CI/CD pipelines.
