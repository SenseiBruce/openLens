# Spring Boot Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via Checkstyle and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Spring Boot:** >= 3.2.0
- **Java:** >= 17 (LTS)
- **Maven:** >= 3.8.0 or **Gradle:** >= 8.0
- **Spring Framework:** >= 6.1.0

### Architecture Philosophy
- Dependency Injection (IoC Container)
- Convention over configuration
- Annotation-driven development
- Aspect-Oriented Programming (AOP)
- Layered architecture (Controller → Service → Repository)

---

## 2. Project Structure

### Directory Layout (Maven)
```
project-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/project/
│   │   │       ├── ProjectApplication.java
│   │   │       ├── config/           # Configuration classes
│   │   │       ├── controller/       # REST controllers
│   │   │       ├── service/          # Business logic
│   │   │       ├── repository/       # Data access
│   │   │       ├── model/            # Domain entities
│   │   │       ├── dto/              # Data Transfer Objects
│   │   │       ├── mapper/           # DTO ↔ Entity mappers
│   │   │       ├── exception/        # Custom exceptions
│   │   │       ├── security/         # Security config
│   │   │       └── util/             # Utility classes
│   │   └── resources/
│   │       ├── application.yml       # Application config
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/         # Flyway/Liquibase
│   └── test/
│       ├── java/
│       │   └── com/company/project/
│       │       ├── controller/
│       │       ├── service/
│       │       └── repository/
│       └── resources/
│           └── application-test.yml
├── pom.xml                           # Maven dependencies
└── checkstyle.xml                    # Checkstyle config
```

---

## 3. Naming Conventions

### Classes and Interfaces
```java
// ✅ GOOD - Descriptive names with proper suffixes
@RestController
@RequestMapping("/api/users")
public class UserController { }

@Service
public class UserService { }

@Repository
public interface UserRepository extends JpaRepository<User, Long> { }

@Entity
@Table(name = "users")
public class User { }

public class UserDto { }

public interface UserMapper { }

// ❌ BAD - Generic or missing suffixes
public class User1 { }  // Non-descriptive
public class UserC { }  // Abbreviated
public class UserRep { }  // Unclear abbreviation
```

### Methods and Variables
```java
// ✅ GOOD - camelCase, descriptive
public List<User> findActiveUsers() { }
public void updateUserProfile(Long userId, UserDto userDto) { }

private final UserService userService;
private static final int MAX_RETRY_ATTEMPTS = 3;

// ❌ BAD - Unclear, abbreviated
public List<User> fau() { }  // Not descriptive
public void upd(Long id) { }  // Abbreviated
```

### Constants
```java
// ✅ GOOD - UPPER_SNAKE_CASE
public static final String API_VERSION = "v1";
public static final int MAX_PAGE_SIZE = 100;
public static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);

// ❌ BAD
public static final String apiVersion = "v1";  // Wrong case
```

---

## 4. Dependency Injection

### Constructor Injection (Mandatory)
```java
// ✅ GOOD - Constructor injection (immutable, testable)
@Service
@RequiredArgsConstructor  // Lombok generates constructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    public User createUser(UserDto userDto) {
        // Implementation
    }
}

// ✅ GOOD - Without Lombok
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// ❌ BAD - Field injection (harder to test, mutable)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;  // AVOID
}

// ❌ BAD - Setter injection (mutable)
@Service
public class UserService {
    private UserRepository userRepository;
    
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### Qualifiers and Profiles
```java
// ✅ GOOD - Use @Qualifier for multiple implementations
public interface NotificationService {
    void send(String message);
}

@Service("emailNotification")
public class EmailNotificationService implements NotificationService { }

@Service("smsNotification")
public class SmsNotificationService implements NotificationService { }

@Service
public class NotificationProcessor {
    private final NotificationService notificationService;
    
    public NotificationProcessor(@Qualifier("emailNotification") NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}

// ✅ GOOD - Use @Profile for environment-specific beans
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(environment.getProperty("spring.datasource.url"));
        return new HikariDataSource(config);
    }
}
```

---

## 5. REST Controller Patterns

### Controller Structure
```java
// ✅ GOOD - Comprehensive REST controller
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
@Tag(name = "User Management", description = "User CRUD operations")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve paginated list of users")
    public ResponseEntity<Page<UserResponseDto>> getUsers(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponseDto> users = userService.getUsers(pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable @Positive Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    @Operation(summary = "Create new user")
    public ResponseEntity<UserResponseDto> createUser(
            @RequestBody @Valid UserCreateDto userDto) {
        
        UserResponseDto createdUser = userService.createUser(userDto);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdUser.getId())
            .toUri();
        
        return ResponseEntity.created(location).body(createdUser);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update user")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable @Positive Long id,
            @RequestBody @Valid UserUpdateDto userDto) {
        
        UserResponseDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable @Positive Long id) {
        userService.deleteUser(id);
    }
}

// ❌ BAD - No validation, unclear responses
@RestController
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public List<User> getUsers() {  // Returns entities directly
        return userService.getAll();
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {  // No validation
        return userService.save(user);
    }
}
```

### Exception Handling
```java
// ✅ GOOD - Global exception handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        log.warn("Entity not found: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse response = ValidationErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .errors(errors)
            .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

// Custom exception
public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}
```

---

## 6. Service Layer

### Service Implementation
```java
// ✅ GOOD - Service with proper transaction management
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public Page<UserResponseDto> getUsers(Pageable pageable) {
        log.debug("Fetching users with pagination: {}", pageable);
        return userRepository.findAll(pageable)
            .map(userMapper::toResponseDto);
    }
    
    @Override
    public UserResponseDto getUserById(Long id) {
        log.debug("Fetching user by id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toResponseDto(user);
    }
    
    @Override
    @Transactional  // Write operation
    public UserResponseDto createUser(UserCreateDto userDto) {
        log.info("Creating new user: {}", userDto.getEmail());
        
        // Validate email uniqueness
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateEntityException("Email already exists: " + userDto.getEmail());
        }
        
        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully with id: {}", savedUser.getId());
        
        return userMapper.toResponseDto(savedUser);
    }
    
    @Override
    @Transactional
    public UserResponseDto updateUser(Long id, UserUpdateDto userDto) {
        log.info("Updating user: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        
        userMapper.updateEntityFromDto(userDto, user);
        User updatedUser = userRepository.save(user);
        
        return userMapper.toResponseDto(updatedUser);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        
        userRepository.deleteById(id);
    }
}
```

---

## 7. Repository Layer (JPA)

### Repository Interface
```java
// ✅ GOOD - Repository with custom queries
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    // Native query
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    // Projection
    @Query("SELECT new com.company.project.dto.UserSummaryDto(u.id, u.email, u.username) " +
           "FROM User u WHERE u.isActive = true")
    List<UserSummaryDto> findUserSummaries();
}

// ✅ GOOD - Specification for dynamic queries
public class UserSpecifications {
    
    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> 
            email == null ? null : cb.equal(root.get("email"), email);
    }
    
    public static Specification<User> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }
    
    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, cb) -> 
            date == null ? null : cb.greaterThan(root.get("createdAt"), date);
    }
}

// Usage
Specification<User> spec = Specification
    .where(UserSpecifications.isActive())
    .and(UserSpecifications.hasEmail(email));
List<User> users = userRepository.findAll(spec);
```

---

## 8. Entity/Model Layer

### Entity Definition
```java
// ✅ GOOD - Comprehensive entity with validation
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_username", columnList = "username")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    @Email
    private String email;
    
    @Column(nullable = false, unique = true, length = 50)
    @Size(min = 3, max = 50)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;  // Optimistic locking
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Post> posts = new ArrayList<>();
    
    // Helper methods
    public void addPost(Post post) {
        posts.add(post);
        post.setUser(this);
    }
    
    public void removePost(Post post) {
        posts.remove(post);
        post.setUser(null);
    }
}

public enum UserRole {
    USER, ADMIN, MODERATOR
}

// ❌ BAD - Poor entity design
@Entity
public class User {
    @Id
    private Long id;  // No generation strategy
    private String email;  // No constraints
    private String password;  // Exposed in toString
}
```

---

## 9. DTO Pattern

### DTO Definition
```java
// ✅ GOOD - Request DTO with validation
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDto {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Username can only contain alphanumeric characters, hyphens, and underscores")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    )
    private String password;
}

// ✅ GOOD - Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private String username;
    private Boolean isActive;
    private UserRole role;
    private LocalDateTime createdAt;
}

// ✅ GOOD - MapStruct mapper
@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserResponseDto toResponseDto(User user);
    
    User toEntity(UserCreateDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(UserUpdateDto dto, @MappingTarget User user);
    
    List<UserResponseDto> toResponseDtoList(List<User> users);
}
```

---

## 10. Security (Spring Security)

### Security Configuration
```java
// ✅ GOOD - Security configuration
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}

// JWT Filter
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String jwt = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## 11. Testing Standards

### Unit Testing
```java
// ✅ GOOD - Service test with Mockito
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserMapper userMapper;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    void getUserById_ExistingUser_ReturnsUserDto() {
        // Given
        Long userId = 1L;
        User user = User.builder()
            .id(userId)
            .email("test@example.com")
            .username("testuser")
            .build();
        
        UserResponseDto expectedDto = UserResponseDto.builder()
            .id(userId)
            .email("test@example.com")
            .username("testuser")
            .build();
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDto(user)).thenReturn(expectedDto);
        
        // When
        UserResponseDto result = userService.getUserById(userId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        
        verify(userRepository).findById(userId);
        verify(userMapper).toResponseDto(user);
    }
    
    @Test
    void getUserById_NonExistingUser_ThrowsException() {
        // Given
        Long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> userService.getUserById(userId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("User not found");
        
        verify(userRepository).findById(userId);
        verifyNoInteractions(userMapper);
    }
}
```

### Integration Testing
```java
// ✅ GOOD - Integration test with TestContainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void createUser_ValidData_ReturnsCreated() {
        // Given
        UserCreateDto request = new UserCreateDto(
            "test@example.com",
            "testuser",
            "Password123"
        );
        
        // When
        ResponseEntity<UserResponseDto> response = restTemplate.postForEntity(
            "/api/v1/users",
            request,
            UserResponseDto.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getEmail()).isEqualTo("test@example.com");
        
        // Verify in database
        Optional<User> savedUser = userRepository.findByEmail("test@example.com");
        assertThat(savedUser).isPresent();
    }
}
```

---

## 12. Configuration Management

### application.yml
```yaml
# ✅ GOOD - Externalized configuration
spring:
  application:
    name: user-service
  
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/userdb}
    username: ${DATABASE_USERNAME:postgres}
    password: ${DATABASE_PASSWORD:postgres}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway/Liquibase for migrations
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

server:
  port: ${SERVER_PORT:8080}
  error:
    include-message: always
    include-binding-errors: always

jwt:
  secret: ${JWT_SECRET:change-me-in-production}
  expiration: 86400000  # 24 hours

logging:
  level:
    root: INFO
    com.company.project: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

# ❌ BAD - Hardcoded secrets
# jwt:
#   secret: "my-super-secret-key"  # NEVER
```

---

## 13. Checkstyle Configuration

### checkstyle.xml
```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
    "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
    "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
    <module name="LineLength">
        <property name="max" value="120"/>
    </module>
    
    <module name="TreeWalker">
        <module name="ConstantName"/>
        <module name="LocalFinalVariableName"/>
        <module name="LocalVariableName"/>
        <module name="MemberName"/>
        <module name="MethodName"/>
        <module name="PackageName"/>
        <module name="ParameterName"/>
        <module name="StaticVariableName"/>
        <module name="TypeName"/>
        
        <module name="AvoidStarImport"/>
        <module name="IllegalImport"/>
        <module name="RedundantImport"/>
        <module name="UnusedImports"/>
        
        <module name="EmptyBlock"/>
        <module name="LeftCurly"/>
        <module name="NeedBraces"/>
        <module name="RightCurly"/>
    </module>
</module>
```

---

## 14. CI/CD Integration

### GitHub Actions
```yaml
name: Spring Boot CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: mvn clean install -DskipTests
      
      - name: Run Checkstyle
        run: mvn checkstyle:check
      
      - name: Run Tests
        run: mvn test
      
      - name: Generate Coverage Report
        run: mvn jacoco:report
      
      - name: Build Docker Image
        run: mvn spring-boot:build-image
```

---

## Enforcement Checklist

- [ ] Constructor injection for dependencies
- [ ] Proper layered architecture
- [ ] DTOs for API requests/responses
- [ ] Bean validation on DTOs
- [ ] Global exception handling
- [ ] Transaction management
- [ ] JPA best practices
- [ ] Spring Security configured
- [ ] Unit and integration tests
- [ ] Checkstyle configured
- [ ] CI/CD pipeline

---

**End of Spring Boot Rules Document**
