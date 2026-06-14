# C++ Coding Rules (C++17/20)

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** C++17
- **Recommended Version:** C++20 or C++23
- **Compilers:** GCC 11+, Clang 14+, MSVC 19.30+
- **Philosophy:** Zero-cost abstractions, RAII, deterministic resource management

### Core Principles
- Use RAII for resource management
- Prefer stack allocation over heap allocation
- Leverage modern C++ features (auto, smart pointers, lambdas)
- Follow "Rule of Zero/Five"
- Minimize raw pointers and manual memory management
- Use const correctness throughout
- Embrace value semantics

## Naming Conventions

### Classes and Structs
```cpp
// GOOD - PascalCase for classes and structs
class UserService {
public:
    void processUser(const User& user);
};

struct Point {
    double x;
    double y;
};

template<typename T>
class Container {
    // Implementation
};

// BAD - snake_case or camelCase
class user_service {};
class userService {};
```

### Functions and Variables
```cpp
// GOOD - snake_case for functions and variables
void calculate_total_price(const std::vector<Item>& items) {
    double total_amount = 0.0;
    int item_count = items.size();
    
    for (const auto& item : items) {
        total_amount += item.price;
    }
}

// Private members with trailing underscore
class Account {
private:
    double balance_;
    std::string owner_;
    
public:
    double get_balance() const { return balance_; }
};

// BAD - camelCase
void calculateTotalPrice(const std::vector<Item>& items) {
    double totalAmount = 0.0;
}
```

### Constants and Macros
```cpp
// GOOD - UPPER_SNAKE_CASE for constants and macros
constexpr int MAX_BUFFER_SIZE = 1024;
constexpr double PI = 3.14159265358979323846;

#define LOG_ERROR(msg) std::cerr << "ERROR: " << msg << std::endl

// Prefer constexpr over #define
namespace constants {
    constexpr int max_retry_attempts = 3;
    constexpr auto default_timeout = std::chrono::seconds(30);
}

// BAD - Mixed case
const int maxBufferSize = 1024;
#define logError(msg) std::cerr << msg << std::endl
```

### Namespaces
```cpp
// GOOD - lowercase with underscores
namespace myapp {
namespace utils {
    void helper_function();
}
}

// C++17 nested namespaces
namespace myapp::utils::crypto {
    std::string hash_password(const std::string& password);
}

// BAD - PascalCase or camelCase
namespace MyApp {
namespace Utils {
    void helperFunction();
}
}
```

## Code Structure

### File Organization
```cpp
// user_service.h
#pragma once

#include <memory>
#include <optional>
#include <string>
#include <vector>

// Forward declarations
class User;
class UserRepository;

namespace myapp {

/**
 * @brief Service for user management operations
 * 
 * Handles user creation, authentication, and profile management.
 */
class UserService {
public:
    // Constructor
    explicit UserService(std::shared_ptr<UserRepository> repository);
    
    // Destructor (if needed)
    ~UserService() = default;
    
    // Delete copy operations (non-copyable)
    UserService(const UserService&) = delete;
    UserService& operator=(const UserService&) = delete;
    
    // Default move operations
    UserService(UserService&&) = default;
    UserService& operator=(UserService&&) = default;
    
    // Public interface
    std::optional<User> find_by_id(int64_t id) const;
    User create_user(const std::string& username, const std::string& email);
    bool authenticate(const std::string& email, const std::string& password);
    
private:
    // Private methods
    void validate_email(const std::string& email) const;
    
    // Member variables
    std::shared_ptr<UserRepository> repository_;
};

} // namespace myapp
```

```cpp
// user_service.cpp
#include "user_service.h"
#include "user.h"
#include "user_repository.h"
#include "validation_exception.h"

#include <regex>

namespace myapp {

UserService::UserService(std::shared_ptr<UserRepository> repository)
    : repository_(std::move(repository)) {
    if (!repository_) {
        throw std::invalid_argument("Repository cannot be null");
    }
}

std::optional<User> UserService::find_by_id(int64_t id) const {
    return repository_->find_by_id(id);
}

User UserService::create_user(const std::string& username, const std::string& email) {
    validate_email(email);
    
    User user{username, email};
    return repository_->save(user);
}

void UserService::validate_email(const std::string& email) const {
    static const std::regex pattern(R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)");
    
    if (!std::regex_match(email, pattern)) {
        throw ValidationException("Invalid email format");
    }
}

} // namespace myapp
```

## RAII and Resource Management

### Smart Pointers
```cpp
// GOOD - Use smart pointers for ownership
#include <memory>

class ResourceManager {
public:
    // Unique ownership
    std::unique_ptr<Database> create_database() {
        return std::make_unique<Database>("connection_string");
    }
    
    // Shared ownership
    std::shared_ptr<Cache> get_cache() {
        if (!cache_) {
            cache_ = std::make_shared<Cache>();
        }
        return cache_;
    }
    
    // Non-owning reference
    void process_data(std::weak_ptr<DataProcessor> processor) {
        if (auto p = processor.lock()) {
            p->process();
        }
    }
    
private:
    std::shared_ptr<Cache> cache_;
};

// BAD - Raw pointers with manual memory management
class BadResourceManager {
public:
    Database* create_database() {
        return new Database("connection_string"); // Memory leak risk!
    }
    
    ~BadResourceManager() {
        delete cache_; // Easy to forget
    }
    
private:
    Cache* cache_;
};
```

### RAII Wrappers
```cpp
// GOOD - RAII for resource cleanup
class FileHandle {
public:
    explicit FileHandle(const std::string& filename)
        : file_(std::fopen(filename.c_str(), "r")) {
        if (!file_) {
            throw std::runtime_error("Failed to open file: " + filename);
        }
    }
    
    ~FileHandle() {
        if (file_) {
            std::fclose(file_);
        }
    }
    
    // Delete copy operations
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
    
    // Move operations
    FileHandle(FileHandle&& other) noexcept : file_(other.file_) {
        other.file_ = nullptr;
    }
    
    FileHandle& operator=(FileHandle&& other) noexcept {
        if (this != &other) {
            if (file_) {
                std::fclose(file_);
            }
            file_ = other.file_;
            other.file_ = nullptr;
        }
        return *this;
    }
    
    FILE* get() const { return file_; }
    
private:
    FILE* file_;
};

// Usage
void read_file(const std::string& filename) {
    FileHandle file(filename);
    // File automatically closed when scope exits
    
    char buffer[1024];
    while (std::fgets(buffer, sizeof(buffer), file.get())) {
        std::cout << buffer;
    }
}
```

### Lock Guards
```cpp
// GOOD - Use lock guards for mutex management
#include <mutex>
#include <shared_mutex>

class ThreadSafeCounter {
public:
    void increment() {
        std::lock_guard<std::mutex> lock(mutex_);
        ++count_;
    }
    
    int get_count() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return count_;
    }
    
    // C++17 - scoped_lock for multiple mutexes
    void transfer(ThreadSafeCounter& other, int amount) {
        std::scoped_lock lock(mutex_, other.mutex_);
        count_ -= amount;
        other.count_ += amount;
    }
    
private:
    mutable std::mutex mutex_;
    int count_ = 0;
};

// Reader-writer lock
class DataCache {
public:
    std::string read(const std::string& key) const {
        std::shared_lock lock(mutex_);
        auto it = cache_.find(key);
        return it != cache_.end() ? it->second : "";
    }
    
    void write(const std::string& key, const std::string& value) {
        std::unique_lock lock(mutex_);
        cache_[key] = value;
    }
    
private:
    mutable std::shared_mutex mutex_;
    std::unordered_map<std::string, std::string> cache_;
};
```

## Modern C++ Features

### Auto and Type Deduction
```cpp
// GOOD - Use auto for complex types
auto users = repository.find_all();  // std::vector<User>
auto it = users.begin();             // std::vector<User>::iterator

// Structured bindings (C++17)
for (const auto& [key, value] : user_map) {
    std::cout << key << ": " << value << std::endl;
}

// Range-based for loops
for (const auto& user : users) {
    process_user(user);
}

// BAD - Verbose type declarations
std::vector<User>::iterator it = users.begin();
std::unordered_map<std::string, User>::const_iterator map_it = user_map.cbegin();
```

### Lambda Expressions
```cpp
// GOOD - Use lambdas for callbacks and algorithms
#include <algorithm>

void process_users(std::vector<User>& users) {
    // Sort by age
    std::sort(users.begin(), users.end(), 
        [](const User& a, const User& b) { return a.age < b.age; });
    
    // Filter active users
    users.erase(
        std::remove_if(users.begin(), users.end(),
            [](const User& u) { return !u.is_active; }),
        users.end()
    );
    
    // Transform
    std::vector<std::string> names;
    std::transform(users.begin(), users.end(), std::back_inserter(names),
        [](const User& u) { return u.username; });
}

// Generic lambda (C++14)
auto printer = [](const auto& value) {
    std::cout << value << std::endl;
};

// Capture by value and reference
int multiplier = 10;
auto multiply = [multiplier](int x) { return x * multiplier; };  // Capture by value
auto increment = [&multiplier]() { ++multiplier; };              // Capture by reference
```

### std::optional (C++17)
```cpp
// GOOD - Use std::optional for optional values
#include <optional>

class UserRepository {
public:
    std::optional<User> find_by_email(const std::string& email) const {
        auto it = users_.find(email);
        if (it != users_.end()) {
            return it->second;
        }
        return std::nullopt;
    }
    
    User get_or_default(const std::string& email) const {
        return find_by_email(email).value_or(create_default_user());
    }
    
private:
    std::unordered_map<std::string, User> users_;
    
    User create_default_user() const {
        return User{"guest", "guest@example.com"};
    }
};

// Usage
if (auto user = repository.find_by_email("test@example.com")) {
    std::cout << "Found: " << user->username << std::endl;
} else {
    std::cout << "User not found" << std::endl;
}
```

### std::variant and std::visit (C++17)
```cpp
// GOOD - Use variant for type-safe unions
#include <variant>
#include <string>

using Result = std::variant<int, double, std::string>;

Result compute(const std::string& operation) {
    if (operation == "int") return 42;
    if (operation == "double") return 3.14;
    return std::string("result");
}

// Visitor pattern
struct ResultPrinter {
    void operator()(int i) const { std::cout << "Int: " << i << std::endl; }
    void operator()(double d) const { std::cout << "Double: " << d << std::endl; }
    void operator()(const std::string& s) const { std::cout << "String: " << s << std::endl; }
};

void print_result(const Result& result) {
    std::visit(ResultPrinter{}, result);
}

// Generic lambda visitor
void print_result_generic(const Result& result) {
    std::visit([](const auto& value) {
        std::cout << "Value: " << value << std::endl;
    }, result);
}
```

### Concepts (C++20)
```cpp
// GOOD - Use concepts for type constraints
#include <concepts>

template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T>
T add(T a, T b) {
    return a + b;
}

// Custom concepts
template<typename T>
concept Serializable = requires(T t) {
    { t.serialize() } -> std::convertible_to<std::string>;
};

template<Serializable T>
void save_to_file(const T& obj, const std::string& filename) {
    std::string data = obj.serialize();
    // Write to file
}
```

### Ranges (C++20)
```cpp
// GOOD - Use ranges for functional-style programming
#include <ranges>
#include <vector>

void process_numbers(const std::vector<int>& numbers) {
    namespace views = std::ranges::views;
    
    // Filter, transform, take
    auto result = numbers
        | views::filter([](int n) { return n % 2 == 0; })
        | views::transform([](int n) { return n * 2; })
        | views::take(5);
    
    for (int n : result) {
        std::cout << n << " ";
    }
}
```

## Security Patterns

### Buffer Overflow Prevention
```cpp
// GOOD - Use STL containers and bounds checking
#include <array>
#include <vector>
#include <string>

void safe_buffer_operations() {
    std::array<char, 100> buffer;
    std::string input = get_user_input();
    
    // Bounds-checked copy
    size_t copy_size = std::min(input.size(), buffer.size() - 1);
    std::copy_n(input.begin(), copy_size, buffer.begin());
    buffer[copy_size] = '\0';
    
    // Or use std::string directly
    std::string safe_buffer = input.substr(0, 99);
}

// BAD - C-style arrays with potential overflow
void unsafe_buffer() {
    char buffer[100];
    char* input = get_input();
    strcpy(buffer, input);  // BUFFER OVERFLOW RISK!
}
```

### Input Validation
```cpp
// GOOD - Validate and sanitize inputs
#include <regex>
#include <stdexcept>

class InputValidator {
public:
    static void validate_email(const std::string& email) {
        static const std::regex pattern(
            R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)"
        );
        
        if (!std::regex_match(email, pattern)) {
            throw std::invalid_argument("Invalid email format");
        }
        
        if (email.length() > 254) {
            throw std::invalid_argument("Email too long");
        }
    }
    
    static int validate_positive_int(const std::string& str) {
        try {
            size_t pos;
            int value = std::stoi(str, &pos);
            
            if (pos != str.length()) {
                throw std::invalid_argument("Invalid integer");
            }
            
            if (value < 0) {
                throw std::invalid_argument("Value must be positive");
            }
            
            return value;
        } catch (const std::exception& e) {
            throw std::invalid_argument("Invalid integer: " + str);
        }
    }
};
```

### Secure String Handling
```cpp
// GOOD - Use std::string and avoid C-style strings
#include <string>
#include <string_view>

class SecureStringHandler {
public:
    // Use string_view for non-owning references
    static bool validate_password(std::string_view password) {
        if (password.length() < 8) return false;
        
        bool has_letter = false;
        bool has_digit = false;
        
        for (char c : password) {
            if (std::isalpha(c)) has_letter = true;
            if (std::isdigit(c)) has_digit = true;
        }
        
        return has_letter && has_digit;
    }
    
    // Secure string comparison (constant-time to prevent timing attacks)
    static bool constant_time_compare(std::string_view a, std::string_view b) {
        if (a.size() != b.size()) return false;
        
        volatile char result = 0;
        for (size_t i = 0; i < a.size(); ++i) {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }
};
```

### Memory Safety
```cpp
// GOOD - Prevent use-after-free and double-free
class SafeMemoryManager {
public:
    void safe_deletion() {
        auto ptr = std::make_unique<Data>();
        process(ptr.get());
        // ptr automatically deleted, no double-free possible
    }
    
    void safe_shared_ownership() {
        auto shared = std::make_shared<Data>();
        std::weak_ptr<Data> weak = shared;
        
        // Later...
        if (auto locked = weak.lock()) {
            // Safe to use locked
            process(locked.get());
        } else {
            // Object was deleted
        }
    }
};

// BAD - Manual memory management
void unsafe_memory() {
    Data* ptr = new Data();
    process(ptr);
    delete ptr;
    // Potential use-after-free if process stores ptr
    delete ptr; // Double-free!
}
```

## Error Handling

### Exceptions
```cpp
// GOOD - Use exception hierarchy
#include <exception>
#include <stdexcept>
#include <string>

class ApplicationException : public std::runtime_error {
public:
    explicit ApplicationException(const std::string& message)
        : std::runtime_error(message) {}
};

class ValidationException : public ApplicationException {
public:
    explicit ValidationException(const std::string& message)
        : ApplicationException("Validation Error: " + message) {}
};

class NotFoundException : public ApplicationException {
public:
    NotFoundException(const std::string& resource, int64_t id)
        : ApplicationException(
            resource + " not found with id: " + std::to_string(id)) {}
};

// Function that throws
User UserService::get_user(int64_t id) const {
    auto user = repository_->find_by_id(id);
    if (!user) {
        throw NotFoundException("User", id);
    }
    return *user;
}

// Catching exceptions
void process_user(int64_t id) {
    try {
        User user = service.get_user(id);
        // Process user
    } catch (const NotFoundException& e) {
        std::cerr << "Not found: " << e.what() << std::endl;
    } catch (const ValidationException& e) {
        std::cerr << "Validation failed: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}
```

### std::expected (C++23) or Result Type
```cpp
// GOOD - Result type for explicit error handling
#include <expected>  // C++23
#include <string>

template<typename T, typename E = std::string>
using Result = std::expected<T, E>;

Result<User, std::string> find_user(int64_t id) {
    if (auto user = repository.find_by_id(id)) {
        return *user;
    }
    return std::unexpected("User not found");
}

// Usage
void process() {
    auto result = find_user(123);
    
    if (result) {
        std::cout << "Found: " << result->username << std::endl;
    } else {
        std::cerr << "Error: " << result.error() << std::endl;
    }
}

// Pre-C++23 alternative
template<typename T>
class Result {
public:
    static Result success(T value) {
        return Result(std::move(value), true);
    }
    
    static Result error(std::string message) {
        return Result(std::move(message), false);
    }
    
    bool is_ok() const { return ok_; }
    const T& value() const { return value_; }
    const std::string& error() const { return error_; }
    
private:
    Result(T value, bool ok) : value_(std::move(value)), ok_(ok) {}
    Result(std::string error, bool ok) : error_(std::move(error)), ok_(ok) {}
    
    T value_;
    std::string error_;
    bool ok_;
};
```

## Testing Standards

### Google Test
```cpp
// user_service_test.cpp
#include "user_service.h"
#include "user_repository_mock.h"
#include <gtest/gtest.h>
#include <gmock/gmock.h>

using ::testing::Return;
using ::testing::_;

class UserServiceTest : public ::testing::Test {
protected:
    void SetUp() override {
        repository = std::make_shared<MockUserRepository>();
        service = std::make_unique<UserService>(repository);
    }
    
    void TearDown() override {
        service.reset();
        repository.reset();
    }
    
    std::shared_ptr<MockUserRepository> repository;
    std::unique_ptr<UserService> service;
};

TEST_F(UserServiceTest, FindByIdReturnsUserWhenFound) {
    // Arrange
    User expected_user{"testuser", "test@example.com"};
    expected_user.id = 1;
    
    EXPECT_CALL(*repository, find_by_id(1))
        .WillOnce(Return(std::make_optional(expected_user)));
    
    // Act
    auto result = service->find_by_id(1);
    
    // Assert
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(result->username, "testuser");
    EXPECT_EQ(result->email, "test@example.com");
}

TEST_F(UserServiceTest, FindByIdReturnsNulloptWhenNotFound) {
    // Arrange
    EXPECT_CALL(*repository, find_by_id(999))
        .WillOnce(Return(std::nullopt));
    
    // Act
    auto result = service->find_by_id(999);
    
    // Assert
    EXPECT_FALSE(result.has_value());
}

TEST_F(UserServiceTest, CreateUserThrowsOnInvalidEmail) {
    // Act & Assert
    EXPECT_THROW(
        service->create_user("testuser", "invalid-email"),
        ValidationException
    );
}

// Parameterized tests
class EmailValidationTest : public ::testing::TestWithParam<std::string> {};

TEST_P(EmailValidationTest, InvalidEmailsThrowException) {
    auto repository = std::make_shared<MockUserRepository>();
    UserService service(repository);
    
    EXPECT_THROW(
        service.create_user("testuser", GetParam()),
        ValidationException
    );
}

INSTANTIATE_TEST_SUITE_P(
    InvalidEmails,
    EmailValidationTest,
    ::testing::Values(
        "invalid",
        "@example.com",
        "user@",
        "user @example.com"
    )
);
```

## Documentation Standards

### Doxygen Comments
```cpp
/**
 * @file user_service.h
 * @brief User management service
 * @author John Doe
 * @date 2026-02-09
 */

/**
 * @brief Service class for user operations
 * 
 * Provides functionality for creating, updating, and authenticating users.
 * Thread-safe for read operations, write operations require external synchronization.
 * 
 * @note All methods may throw exceptions on error
 */
class UserService {
public:
    /**
     * @brief Construct a UserService
     * @param repository Shared pointer to user repository
     * @throws std::invalid_argument if repository is null
     */
    explicit UserService(std::shared_ptr<UserRepository> repository);
    
    /**
     * @brief Find a user by ID
     * @param id User identifier
     * @return Optional containing user if found, nullopt otherwise
     * @note Thread-safe
     */
    std::optional<User> find_by_id(int64_t id) const;
    
    /**
     * @brief Create a new user
     * @param username User's username (3-50 characters)
     * @param email User's email address (valid email format)
     * @return Created user with generated ID
     * @throws ValidationException if input is invalid
     * @throws DuplicateUserException if username or email exists
     */
    User create_user(const std::string& username, const std::string& email);
};
```

## Clang-Tidy Configuration

### .clang-tidy
```yaml
Checks: >
  *,
  -fuchsia-*,
  -google-*,
  -llvm-*,
  -abseil-*,
  modernize-*,
  performance-*,
  readability-*,
  bugprone-*,
  cppcoreguidelines-*,
  clang-analyzer-*
  
CheckOptions:
  - key: readability-identifier-naming.ClassCase
    value: CamelCase
  - key: readability-identifier-naming.StructCase
    value: CamelCase
  - key: readability-identifier-naming.FunctionCase
    value: lower_case
  - key: readability-identifier-naming.VariableCase
    value: lower_case
  - key: readability-identifier-naming.PrivateMemberSuffix
    value: '_'
  - key: readability-identifier-naming.ConstantCase
    value: UPPER_CASE
  - key: readability-identifier-naming.NamespaceCase
    value: lower_case
  - key: modernize-use-nullptr.NullMacros
    value: 'NULL'
```

## CI/CD Integration

### GitHub Actions
```yaml
name: C++ Linting and Tests

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Install dependencies
      run: |
        sudo apt-get update
        sudo apt-get install -y cmake clang-tidy cppcheck
    
    - name: Run clang-tidy
      run: clang-tidy src/**/*.cpp -- -std=c++20
    
    - name: Run cppcheck
      run: cppcheck --enable=all --error-exitcode=1 src/
    
    - name: Build
      run: |
        cmake -B build -DCMAKE_BUILD_TYPE=Release
        cmake --build build
    
    - name: Run tests
      run: ctest --test-dir build --output-on-failure
```

## Common Anti-Patterns

### Raw Pointers
```cpp
// BAD
Data* ptr = new Data();
delete ptr;

// GOOD
auto ptr = std::make_unique<Data>();
```

### Manual Resource Management
```cpp
// BAD
FILE* f = fopen("file.txt", "r");
// ...
fclose(f);

// GOOD
std::ifstream file("file.txt");
// Automatically closed
```

## Code Review Checklist

- [ ] RAII used for all resources
- [ ] Smart pointers instead of raw pointers
- [ ] const correctness
- [ ] Move semantics where appropriate
- [ ] No manual memory management
- [ ] Modern C++ features (auto, lambdas, etc.)
- [ ] Exception safety
- [ ] Thread safety documented
- [ ] Input validation
- [ ] Test coverage >= 90%
- [ ] Clang-tidy passes
- [ ] No memory leaks (Valgrind/AddressSanitizer)

---

**Enforcement:** These rules are automatically enforced through Clang-Tidy, Cppcheck, and CI/CD pipelines.
