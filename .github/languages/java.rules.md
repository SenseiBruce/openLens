# Java Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** Java 17 (LTS)
- **Recommended Version:** Java 21 (LTS)
- **Build Tool:** Maven 3.9+ or Gradle 8+
- **Philosophy:** Object-oriented with functional programming features, emphasize SOLID principles

### Core Principles
- Write clean, maintainable object-oriented code
- Follow SOLID principles
- Leverage modern Java features (records, sealed classes, pattern matching)
- Use Spring Framework best practices for enterprise applications
- Prioritize immutability and thread safety
- Write comprehensive unit and integration tests

## Naming Conventions

### Classes and Interfaces
```java
// GOOD - PascalCase for classes and interfaces
public class UserService {
    // Implementation
}

public interface UserRepository {
    Optional<User> findById(Long id);
}

public record UserDto(String username, String email) {}

public enum OrderStatus {
    PENDING, PROCESSING, COMPLETED, CANCELLED
}

// BAD - camelCase or snake_case
public class userService {}
public interface user_repository {}
```

### Methods and Variables
```java
// GOOD - camelCase for methods and variables
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentProcessor paymentProcessor;
    
    public Order processOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }
    
    private void validateOrderStatus(Order order) {
        // Validation logic
    }
}

// BAD - PascalCase or snake_case
public void ProcessOrder(Long OrderId) {}
private void validate_order_status(Order order) {}
```

### Constants
```java
// GOOD - UPPER_SNAKE_CASE for constants
public class Constants {
    public static final int MAX_RETRY_ATTEMPTS = 3;
    public static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);
    public static final String API_BASE_URL = "https://api.example.com";
    
    private Constants() {
        throw new UnsupportedOperationException("Utility class");
    }
}

// BAD - camelCase or PascalCase
public static final int maxRetryAttempts = 3;
public static final int MaxRetryAttempts = 3;
```

### Packages
```java
// GOOD - lowercase, reverse domain name
package com.example.myapp.service;
package com.example.myapp.repository;
package com.example.myapp.model;

// BAD - camelCase or PascalCase
package com.example.MyApp.Service;
package com.Example.myapp.Repository;
```

## Code Structure

### Class Organization
```java
// GOOD - Organized class structure
package com.example.myapp.service;

import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import com.example.myapp.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for user management operations.
 * 
 * @author John Doe
 * @since 1.0
 */
@Service
public class UserService {
    
    // 1. Static constants
    private static final int MAX_USERNAME_LENGTH = 50;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    // 2. Instance fields
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // 3. Constructor
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    // 4. Public methods
    /**
     * Create a new user.
     *
     * @param username the username
     * @param email the email address
     * @param password the plain text password
     * @return the created user
     * @throws ValidationException if validation fails
     */
    @Transactional
    public User createUser(String username, String email, String password) {
        validateUserData(username, email, password);
        
        String hashedPassword = passwordEncoder.encode(password);
        User user = User.builder()
            .username(username)
            .email(email)
            .password(hashedPassword)
            .build();
            
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // 5. Private helper methods
    private void validateUserData(String username, String email, String password) {
        if (username == null || username.length() > MAX_USERNAME_LENGTH) {
            throw new ValidationException("Invalid username");
        }
        
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new ValidationException("Invalid email format");
        }
        
        if (password == null || password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
    }
    
    // 6. Inner classes (if needed)
    private static class UserValidator {
        // Validation logic
    }
}
```

### Modern Java Features

#### Records (Java 14+)
```java
// GOOD - Use records for immutable data carriers
public record UserDto(
    Long id,
    String username,
    String email
) {
    // Compact constructor for validation
    public UserDto {
        Objects.requireNonNull(username, "Username cannot be null");
        Objects.requireNonNull(email, "Email cannot be null");
        
        if (username.length() < 3) {
            throw new IllegalArgumentException("Username too short");
        }
    }
    
    // Additional methods
    public String displayName() {
        return username + " (" + email + ")";
    }
}

// BAD - Verbose bean with boilerplate
public class UserDtoBad {
    private Long id;
    private String username;
    private String email;
    
    // Constructors, getters, setters, equals, hashCode, toString...
}
```

#### Sealed Classes (Java 17+)
```java
// GOOD - Sealed classes for restricted hierarchies
public sealed interface Result<T> permits Success, Failure {
    
    record Success<T>(T value) implements Result<T> {}
    
    record Failure<T>(String error) implements Result<T> {}
    
    default T getOrThrow() {
        return switch (this) {
            case Success<T> s -> s.value();
            case Failure<T> f -> throw new RuntimeException(f.error());
        };
    }
}

// Usage with pattern matching
public String processResult(Result<User> result) {
    return switch (result) {
        case Result.Success<User> s -> "User: " + s.value().getUsername();
        case Result.Failure<User> f -> "Error: " + f.error();
    };
}
```

#### Pattern Matching (Java 21+)
```java
// GOOD - Pattern matching for instanceof
public String describeObject(Object obj) {
    return switch (obj) {
        case String s -> "String of length " + s.length();
        case Integer i -> "Integer: " + i;
        case List<?> list when list.isEmpty() -> "Empty list";
        case List<?> list -> "List with " + list.size() + " elements";
        case null -> "null value";
        default -> "Unknown type: " + obj.getClass().getName();
    };
}

// Pattern matching with records
public double calculateArea(Shape shape) {
    return switch (shape) {
        case Circle(double radius) -> Math.PI * radius * radius;
        case Rectangle(double width, double height) -> width * height;
        case Square(double side) -> side * side;
    };
}
```

#### Virtual Threads (Java 21+)
```java
// GOOD - Use virtual threads for high concurrency
public class VirtualThreadExample {
    
    public void processRequests(List<Request> requests) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            requests.forEach(request -> 
                executor.submit(() -> processRequest(request))
            );
        }
    }
    
    private void processRequest(Request request) {
        // I/O-intensive operation
        var response = httpClient.send(request, BodyHandlers.ofString());
        // Process response
    }
}
```

## Language-Specific Patterns

### Builder Pattern
```java
// GOOD - Use Lombok or implement builder pattern
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private boolean active;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

// Usage
User user = User.builder()
    .username("john_doe")
    .email("john@example.com")
    .password("hashed_password")
    .active(true)
    .build();
```

### Optional for Null Safety
```java
// GOOD - Use Optional to avoid null pointer exceptions
public class UserService {
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public User getOrDefault(Long id) {
        return findById(id)
            .orElse(createDefaultUser());
    }
    
    public User getOrThrow(Long id) {
        return findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }
    
    public void processUser(Long id) {
        findById(id).ifPresent(user -> {
            // Process user
            updateLastLogin(user);
        });
    }
}

// BAD - Returning null
public User findByIdBad(Long id) {
    User user = userRepository.find(id);
    return user; // Could be null!
}
```

### Stream API
```java
// GOOD - Use Stream API for collection operations
public class OrderService {
    
    public List<Order> getActiveOrders(List<Order> orders) {
        return orders.stream()
            .filter(Order::isActive)
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }
    
    public Map<OrderStatus, List<Order>> groupByStatus(List<Order> orders) {
        return orders.stream()
            .collect(Collectors.groupingBy(Order::getStatus));
    }
    
    public double calculateTotalRevenue(List<Order> orders) {
        return orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
            .mapToDouble(Order::getTotal)
            .sum();
    }
    
    public Optional<Order> findMostExpensive(List<Order> orders) {
        return orders.stream()
            .max(Comparator.comparing(Order::getTotal));
    }
}
```

### CompletableFuture for Async Operations
```java
// GOOD - Use CompletableFuture for async processing
public class AsyncService {
    
    public CompletableFuture<User> fetchUserAsync(Long userId) {
        return CompletableFuture.supplyAsync(() -> 
            userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId))
        );
    }
    
    public CompletableFuture<UserProfile> fetchUserProfile(Long userId) {
        CompletableFuture<User> userFuture = fetchUserAsync(userId);
        CompletableFuture<List<Order>> ordersFuture = fetchOrdersAsync(userId);
        CompletableFuture<List<Comment>> commentsFuture = fetchCommentsAsync(userId);
        
        return CompletableFuture.allOf(userFuture, ordersFuture, commentsFuture)
            .thenApply(v -> new UserProfile(
                userFuture.join(),
                ordersFuture.join(),
                commentsFuture.join()
            ));
    }
    
    public CompletableFuture<String> processWithRetry(Supplier<String> operation) {
        return CompletableFuture.supplyAsync(operation)
            .exceptionally(ex -> {
                log.warn("Operation failed, retrying...", ex);
                return operation.get();
            });
    }
}
```

## Security Patterns

### SQL Injection Prevention
```java
// GOOD - Use parameterized queries with JPA
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.active = true")
    Optional<User> findActiveUserByUsername(@Param("username") String username);
}

// With JDBC Template
public class UserDao {
    
    private final JdbcTemplate jdbcTemplate;
    
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        
        try {
            User user = jdbcTemplate.queryForObject(
                sql,
                new Object[]{email},
                new UserRowMapper()
            );
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}

// BAD - String concatenation (SQL INJECTION RISK)
public User findByEmailUnsafe(String email) {
    String sql = "SELECT * FROM users WHERE email = '" + email + "'";
    // Attacker can inject: ' OR '1'='1
    return jdbcTemplate.queryForObject(sql, new UserRowMapper());
}
```

### Input Validation
```java
// GOOD - Use Bean Validation (JSR-380)
import jakarta.validation.constraints.*;

public class CreateUserRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain alphanumeric characters and underscores")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$",
        message = "Password must contain at least one letter and one number"
    )
    private String password;
    
    @Min(value = 0, message = "Age must be positive")
    @Max(value = 150, message = "Age must be less than 150")
    private Integer age;
}

// Controller with validation
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
```

### Password Security
```java
// GOOD - Use BCrypt for password hashing
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Cost factor
    }
}

@Service
public class AuthenticationService {
    
    private final PasswordEncoder passwordEncoder;
    
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}

// BAD - Weak hashing
public String hashPasswordWeak(String password) {
    return DigestUtils.md5Hex(password); // WEAK!
}
```

### Secure Configuration
```java
// GOOD - Externalize configuration
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    
    private String jwtSecret;
    private Duration jwtExpiration;
    private String apiKey;
    
    // Getters and setters
    
    @PostConstruct
    public void validateConfig() {
        if (jwtSecret == null || jwtSecret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters");
        }
    }
}

// application.yml
/*
app:
  jwt-secret: ${JWT_SECRET}
  jwt-expiration: 24h
  api-key: ${API_KEY}
*/

// BAD - Hardcoded secrets
public class BadConfig {
    private static final String JWT_SECRET = "my-secret-key"; // NEVER DO THIS!
    private static final String API_KEY = "sk-1234567890";
}
```

### CSRF Protection (Spring Security)
```java
// GOOD - CSRF protection enabled
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            
        return http.build();
    }
}
```

## Error Handling

### Custom Exception Hierarchy
```java
// GOOD - Custom exception hierarchy
public class ApplicationException extends RuntimeException {
    private final String errorCode;
    
    public ApplicationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public ApplicationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}

public class ValidationException extends ApplicationException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }
}

public class ResourceNotFoundException extends ApplicationException {
    public ResourceNotFoundException(String resource, Object id) {
        super(String.format("%s not found with id: %s", resource, id), "NOT_FOUND");
    }
}

public class UnauthorizedException extends ApplicationException {
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED");
    }
}
```

### Global Exception Handler (Spring)
```java
// GOOD - Centralized exception handling
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        log.error("Unexpected error", ex);
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

@Builder
record ErrorResponse(
    int status,
    String error,
    String message,
    LocalDateTime timestamp
) {}
```

### Try-with-Resources
```java
// GOOD - Use try-with-resources for automatic resource management
public String readFile(String path) throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
        return reader.lines()
            .collect(Collectors.joining("\n"));
    }
}

public void processDatabase() {
    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users");
         ResultSet rs = stmt.executeQuery()) {
        
        while (rs.next()) {
            // Process results
        }
    } catch (SQLException e) {
        log.error("Database error", e);
        throw new DatabaseException("Failed to process database operation", e);
    }
}

// BAD - Manual resource management
public String readFileBad(String path) throws IOException {
    BufferedReader reader = new BufferedReader(new FileReader(path));
    try {
        return reader.lines().collect(Collectors.joining("\n"));
    } finally {
        reader.close(); // Easy to forget or skip on error
    }
}
```

## Testing Standards

### JUnit 5 Test Structure
```java
// UserServiceTest.java
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .password("hashed_password")
            .build();
    }
    
    @AfterEach
    void tearDown() {
        // Cleanup if needed
    }
    
    @Nested
    @DisplayName("Create User Tests")
    class CreateUserTests {
        
        @Test
        @DisplayName("Should create user with valid data")
        void shouldCreateUserWithValidData() {
            // Arrange
            String password = "SecurePass123";
            String hashedPassword = "hashed_password";
            
            when(passwordEncoder.encode(password)).thenReturn(hashedPassword);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            // Act
            User result = userService.createUser("testuser", "test@example.com", password);
            
            // Assert
            assertNotNull(result);
            assertEquals("testuser", result.getUsername());
            assertEquals("test@example.com", result.getEmail());
            
            verify(passwordEncoder).encode(password);
            verify(userRepository).save(any(User.class));
        }
        
        @Test
        @DisplayName("Should throw ValidationException for invalid email")
        void shouldThrowExceptionForInvalidEmail() {
            // Act & Assert
            assertThrows(ValidationException.class, () ->
                userService.createUser("testuser", "invalid-email", "SecurePass123")
            );
            
            verifyNoInteractions(userRepository);
        }
        
        @ParameterizedTest
        @ValueSource(strings = {"ab", "a", ""})
        @DisplayName("Should throw ValidationException for short username")
        void shouldThrowExceptionForShortUsername(String username) {
            assertThrows(ValidationException.class, () ->
                userService.createUser(username, "test@example.com", "SecurePass123")
            );
        }
    }
    
    @Nested
    @DisplayName("Find User Tests")
    class FindUserTests {
        
        @Test
        @DisplayName("Should return user when found by email")
        void shouldReturnUserWhenFoundByEmail() {
            // Arrange
            when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
            
            // Act
            Optional<User> result = userService.findByEmail("test@example.com");
            
            // Assert
            assertTrue(result.isPresent());
            assertEquals("testuser", result.get().getUsername());
        }
        
        @Test
        @DisplayName("Should return empty when user not found")
        void shouldReturnEmptyWhenUserNotFound() {
            // Arrange
            when(userRepository.findByEmail("notfound@example.com"))
                .thenReturn(Optional.empty());
            
            // Act
            Optional<User> result = userService.findByEmail("notfound@example.com");
            
            // Assert
            assertFalse(result.isPresent());
        }
    }
}
```

### Integration Tests (Spring Boot)
```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    @DisplayName("Should create user via API")
    void shouldCreateUserViaApi() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("SecurePass123");
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.username").value("newuser"))
            .andExpect(jsonPath("$.email").value("new@example.com"))
            .andExpect(jsonPath("$.password").doesNotExist());
        
        assertEquals(1, userRepository.count());
    }
}
```

### Test Coverage Requirements
```xml
<!-- pom.xml - JaCoCo configuration -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.90</minimum> <!-- 85%/90%/95% by project type -->
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Performance Optimization

### Use Appropriate Collections
```java
// GOOD - Choose right collection for use case
public class CollectionExamples {
    
    // Fast lookup by key
    private Map<String, User> userCache = new ConcurrentHashMap<>();
    
    // Preserve insertion order
    private Map<String, String> config = new LinkedHashMap<>();
    
    // Sorted keys
    private NavigableMap<LocalDate, Order> ordersByDate = new TreeMap<>();
    
    // Unique elements
    private Set<String> uniqueEmails = new HashSet<>();
    
    // Thread-safe list
    private List<Event> events = new CopyOnWriteArrayList<>();
}
```

### Lazy Initialization
```java
// GOOD - Lazy initialization for expensive objects
public class ExpensiveResource {
    
    private volatile DatabaseConnection connection;
    
    public DatabaseConnection getConnection() {
        if (connection == null) {
            synchronized (this) {
                if (connection == null) {
                    connection = new DatabaseConnection();
                }
            }
        }
        return connection;
    }
}

// Using Supplier for lazy loading
public class LazyLoader {
    
    private final Supplier<ExpensiveObject> expensiveSupplier = 
        Suppliers.memoize(() -> new ExpensiveObject());
    
    public ExpensiveObject getExpensive() {
        return expensiveSupplier.get();
    }
}
```

### String Concatenation
```java
// GOOD - Use StringBuilder for loops
public String buildReport(List<String> items) {
    StringBuilder sb = new StringBuilder();
    for (String item : items) {
        sb.append(item).append("\n");
    }
    return sb.toString();
}

// Modern Java - String.join or Stream
public String buildReportModern(List<String> items) {
    return String.join("\n", items);
}

// BAD - String concatenation in loop
public String buildReportBad(List<String> items) {
    String result = "";
    for (String item : items) {
        result += item + "\n"; // Creates new string each time
    }
    return result;
}
```

## Documentation Standards

### Javadoc
```java
/**
 * Service for managing user accounts and authentication.
 * 
 * <p>This service provides operations for creating, updating, and authenticating
 * users. It handles password encryption and validation.</p>
 * 
 * @author John Doe
 * @since 1.0
 * @see UserRepository
 * @see PasswordEncoder
 */
@Service
public class UserService {
    
    /**
     * Creates a new user account.
     * 
     * <p>The password will be encrypted using BCrypt before storing.</p>
     * 
     * @param username the username (3-50 characters, alphanumeric)
     * @param email the email address (must be valid email format)
     * @param password the plain text password (minimum 8 characters)
     * @return the created user with generated ID
     * @throws ValidationException if any input is invalid
     * @throws DuplicateUserException if username or email already exists
     */
    @Transactional
    public User createUser(String username, String email, String password) {
        // Implementation
    }
}
```

## Checkstyle Configuration

### checkstyle.xml
```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
    "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
    "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
    <property name="charset" value="UTF-8"/>
    <property name="severity" value="error"/>
    <property name="fileExtensions" value="java"/>

    <module name="TreeWalker">
        <!-- Naming Conventions -->
        <module name="PackageName">
            <property name="format" value="^[a-z]+(\.[a-z][a-z0-9]*)*$"/>
        </module>
        <module name="TypeName"/>
        <module name="MethodName"/>
        <module name="ConstantName"/>
        <module name="LocalVariableName"/>
        <module name="MemberName"/>
        
        <!-- Size Violations -->
        <module name="LineLength">
            <property name="max" value="120"/>
        </module>
        <module name="MethodLength">
            <property name="max" value="150"/>
        </module>
        <module name="ParameterNumber">
            <property name="max" value="7"/>
        </module>
        
        <!-- Whitespace -->
        <module name="EmptyLineSeparator"/>
        <module name="WhitespaceAround"/>
        <module name="NoWhitespaceBefore"/>
        
        <!-- Coding -->
        <module name="EmptyStatement"/>
        <module name="EqualsHashCode"/>
        <module name="SimplifyBooleanExpression"/>
        <module name="SimplifyBooleanReturn"/>
        <module name="StringLiteralEquality"/>
        <module name="OneStatementPerLine"/>
        
        <!-- Imports -->
        <module name="AvoidStarImport"/>
        <module name="RedundantImport"/>
        <module name="UnusedImports"/>
        
        <!-- Javadoc -->
        <module name="JavadocMethod">
            <property name="accessModifiers" value="public, protected"/>
        </module>
        <module name="JavadocType"/>
        <module name="MissingJavadocMethod">
            <property name="scope" value="public"/>
        </module>
    </module>
</module>
```

## CI/CD Integration

### GitHub Actions (.github/workflows/java-lint.yml)
```yaml
name: Java Linting and Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        java-version: [17, 21]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up JDK ${{ matrix.java-version }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ matrix.java-version }}
        distribution: 'temurin'
        cache: 'maven'
    
    - name: Run Checkstyle
      run: mvn checkstyle:check
    
    - name: Run PMD
      run: mvn pmd:check
    
    - name: Run SpotBugs
      run: mvn spotbugs:check
    
    - name: Build with Maven
      run: mvn clean install
    
    - name: Run tests with coverage
      run: mvn test jacoco:report
    
    - name: Check coverage
      run: mvn jacoco:check
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./target/site/jacoco/jacoco.xml
```

## Common Anti-Patterns

### Raw Types
```java
// BAD
List list = new ArrayList();
Map map = new HashMap();

// GOOD
List<String> list = new ArrayList<>();
Map<String, User> map = new HashMap<>();
```

### Null Checks Over Optional
```java
// BAD
public User findUser(Long id) {
    User user = repository.find(id);
    if (user != null) {
        return user;
    }
    return null;
}

// GOOD
public Optional<User> findUser(Long id) {
    return repository.findById(id);
}
```

## Code Review Checklist

- [ ] SOLID principles followed
- [ ] Modern Java features used (records, sealed classes, etc.)
- [ ] No raw types or unchecked casts
- [ ] Optional used instead of null returns
- [ ] Stream API for collections
- [ ] Try-with-resources for AutoCloseable
- [ ] Immutable where possible
- [ ] Proper exception handling
- [ ] Input validation on all external data
- [ ] No hardcoded secrets
- [ ] Javadoc on public APIs
- [ ] Test coverage >= 90%
- [ ] Checkstyle passes
- [ ] PMD passes
- [ ] SpotBugs passes

---

**Enforcement:** These rules are automatically enforced through Checkstyle, PMD, SpotBugs, and CI/CD pipelines. All violations must be resolved before merge.
