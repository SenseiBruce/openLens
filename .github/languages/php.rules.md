# PHP Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** PHP 8.1
- **Recommended Version:** PHP 8.3+
- **Framework:** Laravel 11+ for web applications
- **Philosophy:** Modern PHP with strong typing, objects, and best practices

### Core Principles
- Use type declarations (strict types)
- Follow PSR standards (PSR-1, PSR-12)
- Embrace object-oriented programming
- Use composer for dependency management
- Write testable, maintainable code
- Leverage modern PHP features (attributes, enums, readonly properties)

## Naming Conventions

### Classes and Interfaces
```php
<?php

declare(strict_types=1);

// GOOD - PascalCase for classes
class UserService
{
    public function __construct(
        private readonly UserRepository $repository
    ) {}
}

interface PaymentProcessorInterface
{
    public function processPayment(Payment $payment): Result;
}

abstract class BaseController
{
    // Implementation
}

// BAD - snake_case or camelCase
class user_service
{
}

class userService
{
}
```

### Methods and Variables
```php
<?php

// GOOD - camelCase for methods and variables
class OrderProcessor
{
    private float $totalAmount = 0.0;
    
    public function calculateTotalPrice(array $items): float
    {
        $itemCount = count($items);
        $discountRate = 0.1;
        
        foreach ($items as $item) {
            $this->totalAmount += $item->getPrice();
        }
        
        return $this->totalAmount * (1 - $discountRate);
    }
    
    public function isValidOrder(Order $order): bool
    {
        return $order->getItems()->count() > 0;
    }
}

// BAD - snake_case or PascalCase
class OrderProcessor
{
    public function calculate_total_price($items)
    {
    }
    
    public function IsValidOrder($order)
    {
    }
}
```

### Constants
```php
<?php

// GOOD - SCREAMING_SNAKE_CASE for constants
class Config
{
    public const MAX_RETRY_ATTEMPTS = 3;
    public const DEFAULT_TIMEOUT = 30;
    public const API_BASE_URL = 'https://api.example.com';
}

define('APP_VERSION', '1.0.0');

// BAD - camelCase or PascalCase
class Config
{
    public const maxRetryAttempts = 3;
    public const DefaultTimeout = 30;
}
```

## Code Structure

### Class Organization
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use App\Exceptions\ValidationException;
use Psr\Log\LoggerInterface;

final class UserService
{
    // 1. Constants
    private const MAX_USERNAME_LENGTH = 50;
    private const MIN_USERNAME_LENGTH = 3;
    
    // 2. Properties
    private array $cache = [];
    
    // 3. Constructor with property promotion
    public function __construct(
        private readonly UserRepository $repository,
        private readonly LoggerInterface $logger,
        private readonly bool $cacheEnabled = true
    ) {}
    
    // 4. Public methods
    public function createUser(string $username, string $email): User
    {
        $this->validateInput($username, $email);
        
        $user = new User(
            username: $username,
            email: $email,
            createdAt: new \DateTimeImmutable()
        );
        
        $savedUser = $this->repository->save($user);
        
        $this->logger->info('User created', [
            'user_id' => $savedUser->getId(),
            'username' => $username
        ]);
        
        return $savedUser;
    }
    
    public function findByEmail(string $email): ?User
    {
        if ($this->cacheEnabled && isset($this->cache[$email])) {
            return $this->cache[$email];
        }
        
        $user = $this->repository->findByEmail($email);
        
        if ($user && $this->cacheEnabled) {
            $this->cache[$email] = $user;
        }
        
        return $user;
    }
    
    // 5. Private methods
    private function validateInput(string $username, string $email): void
    {
        if (empty($username)) {
            throw new ValidationException('Username is required');
        }
        
        if (strlen($username) < self::MIN_USERNAME_LENGTH) {
            throw new ValidationException('Username too short');
        }
        
        if (!$this->isValidEmail($email)) {
            throw new ValidationException('Invalid email');
        }
    }
    
    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
```

## Modern PHP Features

### Type Declarations and Strict Types
```php
<?php

declare(strict_types=1);

// GOOD - Always use strict types and type declarations
function calculateTotal(float $price, int $quantity): float
{
    return $price * $quantity;
}

class Product
{
    public function __construct(
        private readonly int $id,
        private readonly string $name,
        private readonly float $price,
        private readonly ?string $description = null
    ) {}
    
    public function getId(): int
    {
        return $this->id;
    }
    
    public function getPrice(): float
    {
        return $this->price;
    }
}

// BAD - No type declarations
function calculateTotal($price, $quantity)
{
    return $price * $quantity;
}
```

### Enums (PHP 8.1+)
```php
<?php

declare(strict_types=1);

// GOOD - Use enums for fixed sets of values
enum OrderStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::PROCESSING => 'Processing',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
        };
    }
    
    public function canTransitionTo(self $status): bool
    {
        return match($this) {
            self::PENDING => in_array($status, [self::PROCESSING, self::CANCELLED]),
            self::PROCESSING => in_array($status, [self::COMPLETED, self::CANCELLED]),
            self::COMPLETED, self::CANCELLED => false,
        };
    }
}

// Usage
$order = new Order(status: OrderStatus::PENDING);

// BAD - Using constants
class OrderStatus
{
    const PENDING = 'pending';
    const PROCESSING = 'processing';
}
```

### Attributes (PHP 8.0+)
```php
<?php

declare(strict_types=1);

// GOOD - Use attributes for metadata
#[\Attribute]
class Route
{
    public function __construct(
        public readonly string $path,
        public readonly string $method = 'GET'
    ) {}
}

#[Route('/api/users', 'POST')]
class CreateUserController
{
    public function __invoke(Request $request): Response
    {
        // Implementation
    }
}
```

### Readonly Properties (PHP 8.1+)
```php
<?php

declare(strict_types=1);

// GOOD - Use readonly for immutable properties
class User
{
    public function __construct(
        public readonly int $id,
        public readonly string $email,
        public readonly \DateTimeImmutable $createdAt
    ) {}
}

// Readonly class (PHP 8.2+)
readonly class Point
{
    public function __construct(
        public int $x,
        public int $y
    ) {}
}
```

### Named Arguments
```php
<?php

// GOOD - Use named arguments for clarity
$user = new User(
    id: 1,
    email: 'user@example.com',
    createdAt: new \DateTimeImmutable()
);

$result = processPayment(
    amount: 100.00,
    currency: 'USD',
    userId: 123
);
```

## Laravel Specific Patterns

### Models (Eloquent)
```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Model
{
    use HasFactory;
    
    // 1. Table and timestamps
    protected $table = 'users';
    
    // 2. Mass assignment protection
    protected $fillable = [
        'username',
        'email',
        'first_name',
        'last_name',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    // 3. Casts
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'settings' => 'array',
    ];
    
    // 4. Relationships
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
    
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
    
    // 5. Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }
    
    // 6. Accessors and Mutators
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
    
    public function setEmailAttribute(string $value): void
    {
        $this->attributes['email'] = strtolower(trim($value));
    }
    
    // 7. Custom methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

### Controllers
```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin')->only(['destroy']);
    }
    
    public function index(): JsonResponse
    {
        $users = User::active()
            ->with('organization')
            ->paginate(20);
        
        return response()->json($users);
    }
    
    public function show(User $user): JsonResponse
    {
        $user->load('posts', 'organization');
        
        return response()->json($user);
    }
    
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $user = User::create($validated);
        
        return response()->json($user, Response::HTTP_CREATED);
    }
    
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();
        
        $user->update($validated);
        
        return response()->json($user);
    }
    
    public function destroy(User $user): Response
    {
        $user->delete();
        
        return response()->noContent();
    }
}
```

### Form Requests
```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }
    
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:users'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', Password::min(8)->mixedCase()->numbers()->symbols()],
            'first_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'username.unique' => 'This username is already taken',
            'email.unique' => 'This email is already registered',
        ];
    }
}
```

### Service Layer
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Exceptions\UserRegistrationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

final class UserRegistrationService
{
    public function __construct(
        private readonly UserRepository $repository
    ) {}
    
    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = $this->createUser($data);
            $this->createProfile($user, $data);
            $this->sendWelcomeEmail($user);
            
            return $user;
        });
    }
    
    private function createUser(array $data): User
    {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
    
    private function createProfile(User $user, array $data): void
    {
        $user->profile()->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);
    }
    
    private function sendWelcomeEmail(User $user): void
    {
        Mail::to($user)->send(new WelcomeEmail($user));
    }
}
```

## Security Patterns

### SQL Injection Prevention
```php
<?php

// GOOD - Use query builder or Eloquent ORM
$users = DB::table('users')
    ->where('email', $email)
    ->where('active', true)
    ->get();

// Parameter binding
$users = DB::select('SELECT * FROM users WHERE email = ?', [$email]);

// Named parameters
$users = DB::select(
    'SELECT * FROM users WHERE email = :email AND active = :active',
    ['email' => $email, 'active' => true]
);

// Eloquent
$user = User::where('email', $email)->first();

// BAD - String concatenation (SQL INJECTION RISK)
$users = DB::select("SELECT * FROM users WHERE email = '$email'");
// Attacker can inject: ' OR '1'='1
```

### XSS Prevention
```php
<?php

// GOOD - Always escape output in Blade templates
{{-- Automatic escaping --}}
<p>{{ $user->name }}</p>

{{-- Raw HTML only when necessary and safe --}}
{!! $trustedHtml !!}

// In PHP
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// BAD - Unescaped output
<p><?php echo $user->name; ?></p>
```

### CSRF Protection
```php
<?php

// GOOD - Laravel has built-in CSRF protection
// In Blade forms
<form method="POST" action="/users">
    @csrf
    <input type="text" name="username">
    <button type="submit">Submit</button>
</form>

// In controllers, automatically validated
// Exclude routes if needed
protected $except = [
    'api/*', // API routes often use token auth
];
```

### Mass Assignment Protection
```php
<?php

// GOOD - Use $fillable or $guarded
class User extends Model
{
    protected $fillable = ['username', 'email', 'first_name', 'last_name'];
    
    // Or
    protected $guarded = ['id', 'is_admin', 'created_at', 'updated_at'];
}

// Controller
public function store(Request $request)
{
    $validated = $request->validate([
        'username' => 'required',
        'email' => 'required|email',
    ]);
    
    User::create($validated); // Only validated fields
}

// BAD - Mass assignment vulnerability
User::create($request->all()); // Allows any field!
```

### Password Hashing
```php
<?php

use Illuminate\Support\Facades\Hash;

// GOOD - Use Laravel's Hash facade (bcrypt)
$hashedPassword = Hash::make($password);

// Verify
if (Hash::check($inputPassword, $user->password)) {
    // Password correct
}

// Check if rehash needed
if (Hash::needsRehash($hashedPassword)) {
    $user->password = Hash::make($password);
}

// BAD - Plain text or weak hashing
$password = md5($password); // NEVER DO THIS
$password = sha1($password); // NEVER DO THIS
```

### Environment Variables
```php
<?php

// GOOD - Use .env and config files
// .env
DB_PASSWORD=secret123
API_KEY=sk-1234567890

// config/services.php
return [
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
];

// Access in code
$apiKey = config('services.stripe.key');

// BAD - Hardcoded secrets
$apiKey = 'sk-1234567890'; // NEVER DO THIS
```

## Testing Standards (PHPUnit)

### Unit Tests
```php
<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Services\UserService;
use App\Repositories\UserRepository;
use PHPUnit\Framework\TestCase;

final class UserServiceTest extends TestCase
{
    private UserService $service;
    private UserRepository $repository;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->repository = $this->createMock(UserRepository::class);
        $this->service = new UserService($this->repository);
    }
    
    public function test_create_user_with_valid_data(): void
    {
        $username = 'testuser';
        $email = 'test@example.com';
        
        $this->repository
            ->expects($this->once())
            ->method('save')
            ->willReturn(new User($username, $email));
        
        $user = $this->service->createUser($username, $email);
        
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals($username, $user->getUsername());
        $this->assertEquals($email, $user->getEmail());
    }
    
    public function test_create_user_throws_exception_for_invalid_email(): void
    {
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Invalid email');
        
        $this->service->createUser('testuser', 'invalid-email');
    }
}
```

### Feature Tests (Laravel)
```php
<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_list_users(): void
    {
        User::factory()->count(5)->create();
        
        $response = $this->get('/api/users');
        
        $response->assertStatus(200);
        $response->assertJsonCount(5, 'data');
    }
    
    public function test_can_create_user(): void
    {
        $data = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'SecurePass123!',
            'first_name' => 'Test',
            'last_name' => 'User',
        ];
        
        $response = $this->postJson('/api/users', $data);
        
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'username',
            'email',
            'created_at',
        ]);
        
        $this->assertDatabaseHas('users', [
            'username' => 'testuser',
            'email' => 'test@example.com',
        ]);
    }
    
    public function test_cannot_create_user_with_duplicate_email(): void
    {
        $existingUser = User::factory()->create(['email' => 'test@example.com']);
        
        $data = [
            'username' => 'newuser',
            'email' => 'test@example.com',
            'password' => 'SecurePass123!',
        ];
        
        $response = $this->postJson('/api/users', $data);
        
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
```

## PHP_CodeSniffer Configuration

### phpcs.xml
```xml
<?xml version="1.0"?>
<ruleset name="Custom Coding Standard">
    <description>Custom PHP coding standard</description>
    
    <!-- Include PSR-12 -->
    <rule ref="PSR12"/>
    
    <!-- Paths to check -->
    <file>app</file>
    <file>tests</file>
    
    <!-- Exclude -->
    <exclude-pattern>*/vendor/*</exclude-pattern>
    <exclude-pattern>*/storage/*</exclude-pattern>
    <exclude-pattern>*/cache/*</exclude-pattern>
    
    <!-- Show progress -->
    <arg value="p"/>
    
    <!-- Use colors -->
    <arg name="colors"/>
    
    <!-- Max line length -->
    <rule ref="Generic.Files.LineLength">
        <properties>
            <property name="lineLimit" value="120"/>
            <property name="absoluteLineLimit" value="150"/>
        </properties>
    </rule>
    
    <!-- Complexity -->
    <rule ref="Generic.Metrics.CyclomaticComplexity">
        <properties>
            <property name="complexity" value="10"/>
        </properties>
    </rule>
</ruleset>
```

### PHPStan Configuration (phpstan.neon)
```neon
parameters:
    level: 8
    paths:
        - app
        - tests
    excludePaths:
        - vendor
    checkMissingIterableValueType: false
    checkGenericClassInNonGenericObjectType: false
```

## CI/CD Integration

### GitHub Actions
```yaml
name: PHP Linting and Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.3'
        extensions: mbstring, pdo, pdo_mysql
        coverage: xdebug
    
    - name: Install dependencies
      run: composer install --prefer-dist --no-progress
    
    - name: Run PHP_CodeSniffer
      run: vendor/bin/phpcs
    
    - name: Run PHPStan
      run: vendor/bin/phpstan analyse
    
    - name: Run PHPUnit tests
      env:
        DB_CONNECTION: mysql
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_DATABASE: test
        DB_USERNAME: root
        DB_PASSWORD: password
      run: vendor/bin/phpunit --coverage-clover coverage.xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage.xml
```

## Common Anti-Patterns

### Not Using Type Declarations
```php
<?php

// BAD
function add($a, $b) {
    return $a + $b;
}

// GOOD
function add(int $a, int $b): int {
    return $a + $b;
}
```

### Using Global Variables
```php
<?php

// BAD
global $database;
$users = $database->query('SELECT * FROM users');

// GOOD - Use dependency injection
class UserService
{
    public function __construct(
        private readonly DatabaseInterface $database
    ) {}
}
```

### Not Handling Exceptions
```php
<?php

// BAD
$user = User::findOrFail($id); // Can throw exception

// GOOD
try {
    $user = User::findOrFail($id);
} catch (ModelNotFoundException $e) {
    return response()->json(['error' => 'User not found'], 404);
}
```

## Code Review Checklist

- [ ] `declare(strict_types=1)` at top of file
- [ ] All functions have type declarations
- [ ] Follows PSR-12 coding standard
- [ ] PHP_CodeSniffer passes
- [ ] PHPStan level 8 passes
- [ ] No SQL injection vulnerabilities
- [ ] Passwords are hashed (bcrypt)
- [ ] No hardcoded secrets
- [ ] Tests cover new code (>= 90%)
- [ ] Proper error handling
- [ ] Mass assignment protected
- [ ] CSRF protection enabled
- [ ] XSS prevention (escaped output)

---

**Enforcement:** These rules are automatically enforced through PHP_CodeSniffer, PHPStan, and CI/CD pipelines.
