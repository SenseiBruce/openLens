# C# Coding Rules (.NET)

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** C# 11 (.NET 7)
- **Recommended Version:** C# 12 (.NET 8+)
- **Philosophy:** Type safety, LINQ, async/await, modern language features

### Core Principles
- Use modern C# features (records, pattern matching, nullable reference types)
- Leverage async/await for I/O operations
- Follow SOLID principles
- Use dependency injection
- Embrace immutability where appropriate
- Write comprehensive unit tests with xUnit or NUnit

## Naming Conventions

### Classes, Interfaces, and Methods
```csharp
// GOOD - PascalCase for types and public members
public class UserService
{
    private readonly IUserRepository _repository;
    
    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<User> GetUserByIdAsync(int userId)
    {
        return await _repository.FindByIdAsync(userId);
    }
}

public interface IUserRepository
{
    Task<User?> FindByIdAsync(int id);
    Task<User> SaveAsync(User user);
}

// BAD - camelCase or snake_case
public class userService {}
public interface UserRepository {}  // Missing I prefix
public async Task<User> getUserById(int userId) {}
```

### Fields and Local Variables
```csharp
// GOOD - Private fields with underscore prefix, camelCase for locals
public class Account
{
    private readonly decimal _balance;
    private int _transactionCount;
    
    public void ProcessTransaction(decimal amount)
    {
        decimal newBalance = _balance + amount;
        int count = _transactionCount + 1;
        
        // Update fields
        _transactionCount = count;
    }
}

// BAD - Inconsistent naming
private decimal Balance;  // Should have underscore
private int transaction_count;  // Should be camelCase with underscore
```

### Constants and Properties
```csharp
// GOOD - PascalCase for constants and properties
public class Constants
{
    public const int MaxRetryAttempts = 3;
    public const string ApiBaseUrl = "https://api.example.com";
    public static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(30);
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; init; } = string.Empty;  // Init-only
    public DateTime CreatedAt { get; private set; }     // Private setter
}

// BAD - Inconsistent casing
public const int MAX_RETRY_ATTEMPTS = 3;
public string username { get; set; }
```

## Code Structure

### File Organization
```csharp
// UserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// Third-party
using Microsoft.Extensions.Logging;

// Project
using MyApp.Models;
using MyApp.Repositories;
using MyApp.Exceptions;

namespace MyApp.Services;

/// <summary>
/// Service for managing user operations
/// </summary>
public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;
    
    public UserService(
        IUserRepository repository,
        ILogger<UserService> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    
    public async Task<User> CreateUserAsync(
        string username,
        string email,
        CancellationToken cancellationToken = default)
    {
        ValidateInput(username, email);
        
        var user = new User
        {
            Username = username,
            Email = email,
            CreatedAt = DateTime.UtcNow
        };
        
        return await _repository.SaveAsync(user, cancellationToken);
    }
    
    private static void ValidateInput(string username, string email)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ValidationException("Username is required");
            
        if (string.IsNullOrWhiteSpace(email))
            throw new ValidationException("Email is required");
    }
}
```

## Modern C# Features

### Records (C# 9+)
```csharp
// GOOD - Use records for immutable data
public record User(
    int Id,
    string Username,
    string Email,
    DateTime CreatedAt
);

// Record with validation
public record CreateUserRequest
{
    public required string Username { get; init; }
    public required string Email { get; init; }
    public string? Password { get; init; }
    
    public void Validate()
    {
        if (Username.Length < 3)
            throw new ValidationException("Username too short");
            
        if (!Email.Contains('@'))
            throw new ValidationException("Invalid email");
    }
}

// With deconstruction
var user = new User(1, "john_doe", "john@example.com", DateTime.UtcNow);
var (id, username, email, _) = user;
```

### Nullable Reference Types (C# 8+)
```csharp
#nullable enable

// GOOD - Explicit nullability
public class UserService
{
    public User? FindUser(int id)  // May return null
    {
        return _repository.FindById(id);
    }
    
    public User GetUser(int id)    // Never returns null
    {
        return _repository.FindById(id) 
            ?? throw new NotFoundException($"User {id} not found");
    }
    
    public void ProcessUser(User user)  // user cannot be null
    {
        ArgumentNullException.ThrowIfNull(user);
        // Process...
    }
}
```

### Pattern Matching (C# 11+)
```csharp
// GOOD - Use pattern matching
public decimal CalculateDiscount(Customer customer, Order order)
{
    return (customer, order) switch
    {
        ({ IsPremium: true }, { Total: > 1000 }) => order.Total * 0.20m,
        ({ IsPremium: true }, _) => order.Total * 0.10m,
        (_, { Total: > 500 }) => order.Total * 0.05m,
        _ => 0m
    };
}

// Type patterns
public string DescribeObject(object obj)
{
    return obj switch
    {
        string s => $"String of length {s.Length}",
        int i => $"Integer: {i}",
        List<int> list when list.Count > 0 => $"List with {list.Count} items",
        null => "null value",
        _ => $"Unknown type: {obj.GetType().Name}"
    };
}
```

### LINQ and Query Expressions
```csharp
// GOOD - Use LINQ for collection operations
public class OrderService
{
    public IEnumerable<Order> GetActiveOrders(IEnumerable<Order> orders)
    {
        return orders
            .Where(o => o.Status == OrderStatus.Active)
            .OrderByDescending(o => o.CreatedAt)
            .Take(10);
    }
    
    public Dictionary<OrderStatus, int> GroupOrdersByStatus(IEnumerable<Order> orders)
    {
        return orders
            .GroupBy(o => o.Status)
            .ToDictionary(g => g.Key, g => g.Count());
    }
    
    public decimal CalculateTotalRevenue(IEnumerable<Order> orders)
    {
        return orders
            .Where(o => o.Status == OrderStatus.Completed)
            .Sum(o => o.Total);
    }
}
```

### Async/Await
```csharp
// GOOD - Proper async/await usage
public class DataService
{
    private readonly HttpClient _httpClient;
    
    public async Task<User> FetchUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync(
            $"/api/users/{userId}",
            cancellationToken);
            
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<User>(cancellationToken)
            ?? throw new InvalidOperationException("Failed to deserialize user");
    }
    
    public async Task<UserProfile> FetchUserProfileAsync(int userId)
    {
        // Parallel async operations
        var userTask = FetchUserAsync(userId);
        var ordersTask = FetchUserOrdersAsync(userId);
        var commentsTask = FetchUserCommentsAsync(userId);
        
        await Task.WhenAll(userTask, ordersTask, commentsTask);
        
        return new UserProfile
        {
            User = await userTask,
            Orders = await ordersTask,
            Comments = await commentsTask
        };
    }
}

// BAD - Blocking on async code
public User FetchUserBad(int userId)
{
    return FetchUserAsync(userId).Result;  // Can cause deadlocks!
}
```

## Security Patterns

### SQL Injection Prevention
```csharp
// GOOD - Use parameterized queries with Entity Framework
public class UserRepository
{
    private readonly DbContext _context;
    
    public async Task<User?> FindByEmailAsync(string email)
    {
        return await _context.Users
            .Where(u => u.Email == email)  // Parameterized
            .FirstOrDefaultAsync();
    }
    
    // With raw SQL (still parameterized)
    public async Task<User?> FindByEmailRawAsync(string email)
    {
        return await _context.Users
            .FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {email}")
            .FirstOrDefaultAsync();
    }
}

// BAD - String concatenation (SQL INJECTION RISK)
public async Task<User?> FindByEmailUnsafe(string email)
{
    var sql = $"SELECT * FROM Users WHERE Email = '{email}'";
    // Attacker can inject: ' OR '1'='1
    return await _context.Users.FromSqlRaw(sql).FirstOrDefaultAsync();
}
```

### Input Validation with Data Annotations
```csharp
// GOOD - Use data annotations
using System.ComponentModel.DataAnnotations;

public class CreateUserRequest
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be 3-50 characters")]
    [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain alphanumeric characters")]
    public string Username { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 8)]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
    
    [Range(0, 150, ErrorMessage = "Age must be between 0 and 150")]
    public int? Age { get; set; }
}

// FluentValidation alternative
public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .Length(3, 50)
            .Matches(@"^[a-zA-Z0-9_]+$");
            
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
            
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8);
    }
}
```

### Password Security
```csharp
// GOOD - Use BCrypt or ASP.NET Core Identity
using BCrypt.Net;

public class PasswordService
{
    private const int WorkFactor = 12;
    
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }
    
    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}

// With ASP.NET Core Identity
public class AuthenticationService
{
    private readonly IPasswordHasher<User> _passwordHasher;
    
    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }
    
    public PasswordVerificationResult VerifyPassword(User user, string password)
    {
        return _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password);
    }
}
```

### Configuration and Secrets
```csharp
// GOOD - Use configuration and secret management
using Microsoft.Extensions.Configuration;

public class AppSettings
{
    public string JwtSecret { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string DatabaseConnectionString { get; set; } = string.Empty;
}

// Startup.cs / Program.cs
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        // Load configuration
        builder.Configuration
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .AddUserSecrets<Program>();  // Development only
        
        // Bind to strongly-typed config
        var appSettings = builder.Configuration
            .GetSection("AppSettings")
            .Get<AppSettings>();
            
        // Validate
        if (string.IsNullOrEmpty(appSettings.JwtSecret))
            throw new InvalidOperationException("JwtSecret is required");
            
        builder.Services.AddSingleton(appSettings);
    }
}

// appsettings.json
/*
{
  "AppSettings": {
    "JwtSecret": "",  // Set via environment variable
    "ApiKey": "",     // Set via environment variable
    "DatabaseConnectionString": ""
  }
}
*/

// BAD - Hardcoded secrets
public class BadConfig
{
    public const string JwtSecret = "my-secret-key";  // NEVER DO THIS!
    public const string ApiKey = "sk-1234567890";
}
```

## Error Handling

### Custom Exceptions
```csharp
// GOOD - Custom exception hierarchy
public class ApplicationException : Exception
{
    public string ErrorCode { get; }
    
    public ApplicationException(string message, string errorCode)
        : base(message)
    {
        ErrorCode = errorCode;
    }
    
    public ApplicationException(string message, string errorCode, Exception innerException)
        : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}

public class ValidationException : ApplicationException
{
    public ValidationException(string message)
        : base(message, "VALIDATION_ERROR")
    {
    }
}

public class NotFoundException : ApplicationException
{
    public NotFoundException(string resource, object id)
        : base($"{resource} not found with id: {id}", "NOT_FOUND")
    {
    }
}
```

### Global Exception Handling (ASP.NET Core)
```csharp
// GOOD - Centralized exception handling
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    
    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }
    
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, errorResponse) = exception switch
        {
            ValidationException ve => (
                StatusCodes.Status400BadRequest,
                new ErrorResponse("Validation Error", ve.Message)
            ),
            NotFoundException nfe => (
                StatusCodes.Status404NotFound,
                new ErrorResponse("Not Found", nfe.Message)
            ),
            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                new ErrorResponse("Unauthorized", "Access denied")
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                new ErrorResponse("Internal Error", "An unexpected error occurred")
            )
        };
        
        _logger.LogError(exception, "Error occurred: {Message}", exception.Message);
        
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);
        
        return true;
    }
}

public record ErrorResponse(string Error, string Message);
```

## Testing Standards

### xUnit Tests
```csharp
// UserServiceTests.cs
using Xunit;
using Moq;
using FluentAssertions;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repositoryMock;
    private readonly Mock<ILogger<UserService>> _loggerMock;
    private readonly UserService _sut;  // System Under Test
    
    public UserServiceTests()
    {
        _repositoryMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<UserService>>();
        _sut = new UserService(_repositoryMock.Object, _loggerMock.Object);
    }
    
    [Fact]
    public async Task CreateUserAsync_WithValidData_ReturnsUser()
    {
        // Arrange
        var username = "testuser";
        var email = "test@example.com";
        var expectedUser = new User
        {
            Id = 1,
            Username = username,
            Email = email
        };
        
        _repositoryMock
            .Setup(r => r.SaveAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedUser);
        
        // Act
        var result = await _sut.CreateUserAsync(username, email);
        
        // Assert
        result.Should().NotBeNull();
        result.Username.Should().Be(username);
        result.Email.Should().Be(email);
        
        _repositoryMock.Verify(
            r => r.SaveAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()),
            Times.Once);
    }
    
    [Theory]
    [InlineData("", "test@example.com")]
    [InlineData("testuser", "")]
    [InlineData(null, "test@example.com")]
    [InlineData("testuser", null)]
    public async Task CreateUserAsync_WithInvalidData_ThrowsValidationException(
        string username,
        string email)
    {
        // Act
        Func<Task> act = async () => await _sut.CreateUserAsync(username, email);
        
        // Assert
        await act.Should().ThrowAsync<ValidationException>();
    }
}

// Integration tests
[Collection("Database")]
public class UserRepositoryIntegrationTests : IAsyncLifetime
{
    private readonly TestDatabaseFixture _fixture;
    
    public UserRepositoryIntegrationTests(TestDatabaseFixture fixture)
    {
        _fixture = fixture;
    }
    
    public async Task InitializeAsync()
    {
        await _fixture.ResetDatabaseAsync();
    }
    
    public Task DisposeAsync() => Task.CompletedTask;
    
    [Fact]
    public async Task SaveAsync_WithNewUser_PersistsToDatabase()
    {
        // Arrange
        var repository = new UserRepository(_fixture.Context);
        var user = new User
        {
            Username = "testuser",
            Email = "test@example.com"
        };
        
        // Act
        var result = await repository.SaveAsync(user);
        
        // Assert
        result.Id.Should().BeGreaterThan(0);
        
        var savedUser = await repository.FindByIdAsync(result.Id);
        savedUser.Should().NotBeNull();
        savedUser!.Username.Should().Be("testuser");
    }
}
```

## StyleCop/ReSharper Configuration

### .editorconfig
```ini
root = true

[*.cs]
# Naming conventions
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.severity = warning
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.symbols = interface
dotnet_naming_rule.interfaces_should_be_prefixed_with_i.style = begins_with_i

dotnet_naming_symbols.interface.applicable_kinds = interface
dotnet_naming_style.begins_with_i.required_prefix = I
dotnet_naming_style.begins_with_i.capitalization = pascal_case

# Private fields
dotnet_naming_rule.private_fields_should_have_underscore_prefix.severity = warning
dotnet_naming_rule.private_fields_should_have_underscore_prefix.symbols = private_fields
dotnet_naming_rule.private_fields_should_have_underscore_prefix.style = underscore_prefix

dotnet_naming_symbols.private_fields.applicable_kinds = field
dotnet_naming_symbols.private_fields.applicable_accessibilities = private
dotnet_naming_style.underscore_prefix.required_prefix = _
dotnet_naming_style.underscore_prefix.capitalization = camel_case

# Code style
csharp_prefer_braces = true
csharp_prefer_simple_using_statement = true
csharp_style_namespace_declarations = file_scoped
csharp_style_prefer_method_group_conversion = true
csharp_style_prefer_top_level_statements = true
csharp_style_expression_bodied_methods = when_simple
csharp_style_expression_bodied_properties = true
csharp_style_expression_bodied_indexers = true
csharp_style_expression_bodied_accessors = true

dotnet_style_prefer_auto_properties = true
dotnet_style_prefer_simplified_interpolation = true
dotnet_style_prefer_conditional_expression_over_return = false

# Nullable reference types
csharp_nullable_reference_types_enabled = true
```

## CI/CD Integration

### GitHub Actions
```yaml
name: .NET Linting and Tests

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --no-restore
    
    - name: Run tests
      run: dotnet test --no-build --verbosity normal --collect:"XPlat Code Coverage"
    
    - name: Check code coverage
      run: |
        dotnet tool install -g dotnet-coverage
        dotnet coverage merge coverage.xml --output merged.xml
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./merged.xml
```

## Common Anti-Patterns

### Async Void
```csharp
// BAD
public async void ProcessDataBad()
{
    await Task.Delay(1000);
}

// GOOD
public async Task ProcessData()
{
    await Task.Delay(1000);
}
```

### Blocking on Async
```csharp
// BAD
public User GetUser(int id)
{
    return GetUserAsync(id).Result;  // Deadlock risk!
}

// GOOD
public async Task<User> GetUserAsync(int id)
{
    return await _repository.FindByIdAsync(id);
}
```

## Code Review Checklist

- [ ] Nullable reference types enabled
- [ ] Async/await used correctly
- [ ] No .Result or .Wait() calls
- [ ] Dependency injection used
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Exception handling in place
- [ ] XML documentation on public APIs
- [ ] Test coverage >= 90%
- [ ] StyleCop/ReSharper rules pass
- [ ] No compiler warnings

---

**Enforcement:** These rules are automatically enforced through StyleCop, ReSharper, and CI/CD pipelines.
