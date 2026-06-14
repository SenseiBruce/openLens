# Python Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** Python 3.10+
- **Recommended Version:** Python 3.11+ for performance improvements
- **Philosophy:** "Explicit is better than implicit" - Follow The Zen of Python (PEP 20)

### Core Principles
- Write Pythonic code using language idioms
- Prioritize readability over cleverness
- Use type hints for all public APIs
- Maintain comprehensive test coverage
- Follow PEP 8 and PEP 257 standards

## Naming Conventions

### Variables and Functions
```python
# GOOD - snake_case for variables and functions
user_name = "John Doe"
total_count = 0

def calculate_total_price(items: list) -> float:
    return sum(item.price for item in items)

# BAD - camelCase or PascalCase for variables
userName = "John Doe"
TotalCount = 0

def CalculateTotalPrice(items):
    return sum(item.price for item in items)
```

### Classes and Exceptions
```python
# GOOD - PascalCase for classes
class UserAccount:
    pass

class InvalidCredentialsError(Exception):
    pass

# BAD - snake_case or other conventions
class user_account:
    pass

class invalid_credentials_error(Exception):
    pass
```

### Constants
```python
# GOOD - UPPER_CASE with underscores
MAX_RETRY_ATTEMPTS = 3
DEFAULT_TIMEOUT_SECONDS = 30
API_BASE_URL = "https://api.example.com"

# BAD - Any other case
max_retry_attempts = 3
MaxRetryAttempts = 3
```

### Private Members
```python
# GOOD - Single underscore prefix for internal use
class Account:
    def __init__(self):
        self._balance = 0  # Internal attribute
        
    def _calculate_interest(self):  # Internal method
        return self._balance * 0.05

# Name mangling with double underscore only when necessary
class BaseClass:
    def __init__(self):
        self.__private_attr = "value"  # Prevents subclass override
```

### Files and Modules
```python
# GOOD - snake_case, descriptive names
user_service.py
database_connection.py
payment_processor.py

# BAD - camelCase or abbreviations
UserService.py
dbConn.py
payProc.py
```

## Code Structure

### File Organization
```python
"""
Module docstring describing the module's purpose.

This module handles user authentication and authorization.
"""

# Standard library imports
import os
import sys
from typing import Optional, List, Dict

# Third-party imports
import requests
from sqlalchemy import create_engine

# Local application imports
from .models import User
from .exceptions import AuthenticationError
from ..config import settings

# Module-level constants
DEFAULT_TIMEOUT = 30
MAX_RETRIES = 3

# Module-level variables (use sparingly)
_connection_pool = None


class UserService:
    """Service class for user operations."""
    pass


def authenticate_user(username: str, password: str) -> Optional[User]:
    """Authenticate a user with credentials."""
    pass


if __name__ == "__main__":
    # Module execution code
    pass
```

### Import Organization
```python
# GOOD - Organized in groups with blank lines
import os
import sys
from typing import List, Optional

import numpy as np
import pandas as pd
from sqlalchemy import create_engine

from myapp.models import User
from myapp.utils import validate_email

# BAD - Mixed imports without organization
from myapp.models import User
import os
from typing import List
import pandas as pd
from myapp.utils import validate_email
import sys
```

### Function and Method Structure
```python
# GOOD - Clear, single responsibility
def calculate_discount(
    base_price: float,
    discount_percentage: float,
    is_member: bool = False
) -> float:
    """
    Calculate the final price after applying discount.
    
    Args:
        base_price: The original price before discount
        discount_percentage: Discount percentage (0-100)
        is_member: Whether the customer is a member
        
    Returns:
        The final price after discount
        
    Raises:
        ValueError: If discount_percentage is not between 0 and 100
    """
    if not 0 <= discount_percentage <= 100:
        raise ValueError("Discount percentage must be between 0 and 100")
    
    discount_multiplier = discount_percentage / 100
    if is_member:
        discount_multiplier += 0.05  # Extra 5% for members
    
    discount_amount = base_price * discount_multiplier
    return base_price - discount_amount
```

## Language-Specific Patterns

### List Comprehensions
```python
# GOOD - Readable list comprehensions
squared_numbers = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# BAD - Complex nested comprehensions (use loops instead)
matrix_transpose = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
# Better:
matrix_transpose = list(zip(*matrix))
```

### Context Managers
```python
# GOOD - Always use context managers for resources
with open("file.txt", "r") as f:
    content = f.read()

with database.transaction():
    user.save()
    profile.save()

# Create custom context managers when needed
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    start = time.time()
    yield
    print(f"{name} took {time.time() - start:.2f}s")

# BAD - Manual resource management
f = open("file.txt", "r")
content = f.read()
f.close()  # Easy to forget or skip on error
```

### Generators and Iterators
```python
# GOOD - Use generators for large datasets
def read_large_file(file_path: str):
    """Generator to read large files line by line."""
    with open(file_path) as f:
        for line in f:
            yield line.strip()

# Use generator expressions for memory efficiency
sum_of_squares = sum(x**2 for x in range(1000000))

# BAD - Loading everything into memory
def read_large_file(file_path: str):
    with open(file_path) as f:
        return [line.strip() for line in f]  # Loads entire file
```

### Decorators
```python
# GOOD - Use decorators for cross-cutting concerns
from functools import wraps
from typing import Callable, Any

def retry(max_attempts: int = 3):
    """Decorator to retry a function on failure."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    logger.warning(f"Attempt {attempt + 1} failed: {e}")
            return None
        return wrapper
    return decorator

@retry(max_attempts=3)
def fetch_data(url: str) -> dict:
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
```

### Type Hints
```python
# GOOD - Comprehensive type hints
from typing import List, Dict, Optional, Union, Tuple, Callable

def process_users(
    users: List[Dict[str, str]],
    filter_func: Optional[Callable[[Dict], bool]] = None
) -> Tuple[List[str], int]:
    """
    Process a list of users.
    
    Args:
        users: List of user dictionaries
        filter_func: Optional filter function
        
    Returns:
        Tuple of (user names, total count)
    """
    if filter_func:
        users = [u for u in users if filter_func(u)]
    
    names = [u["name"] for u in users]
    return names, len(names)

# Use Protocol for structural typing
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

def render(obj: Drawable) -> None:
    obj.draw()
```

### Data Classes
```python
# GOOD - Use dataclasses for data containers
from dataclasses import dataclass, field
from typing import List

@dataclass
class User:
    """User data model."""
    id: int
    username: str
    email: str
    is_active: bool = True
    roles: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        """Validate data after initialization."""
        if not self.email or "@" not in self.email:
            raise ValueError("Invalid email address")

# BAD - Manual __init__ with boilerplate
class User:
    def __init__(self, id, username, email, is_active=True, roles=None):
        self.id = id
        self.username = username
        self.email = email
        self.is_active = is_active
        self.roles = roles or []
```

## Security Patterns

### SQL Injection Prevention
```python
# GOOD - Use parameterized queries
import sqlite3

def get_user_by_email(email: str) -> Optional[dict]:
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    # Parameterized query
    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )
    result = cursor.fetchone()
    conn.close()
    return result

# With SQLAlchemy
from sqlalchemy import select
from models import User

def get_user_safe(session, email: str) -> Optional[User]:
    stmt = select(User).where(User.email == email)
    return session.execute(stmt).scalar_one_or_none()

# BAD - String interpolation (SQL INJECTION RISK)
def get_user_unsafe(email: str):
    cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
    # Attacker can input: ' OR '1'='1
```

### Input Validation
```python
# GOOD - Validate and sanitize all inputs
from pydantic import BaseModel, EmailStr, validator, Field

class UserInput(BaseModel):
    """Validated user input model."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
    
    @validator("username")
    def username_alphanumeric(cls, v):
        if not v.replace("_", "").isalnum():
            raise ValueError("Username must be alphanumeric")
        return v

def create_user(data: dict) -> User:
    validated_data = UserInput(**data)
    # Safe to use validated_data
    return User(**validated_data.dict())

# BAD - Direct use of user input
def create_user_unsafe(data: dict):
    user = User(**data)  # No validation
    return user
```

### Password Security
```python
# GOOD - Use bcrypt or argon2 for password hashing
import bcrypt

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a hash."""
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed.encode("utf-8")
    )

# BAD - Plain text or weak hashing
import hashlib

def hash_password_weak(password: str) -> str:
    return hashlib.md5(password.encode()).hexdigest()  # WEAK!
```

### Secrets Management
```python
# GOOD - Use environment variables and secret managers
import os
from functools import lru_cache

@lru_cache
def get_secret(key: str) -> str:
    """Get secret from environment or secret manager."""
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Secret {key} not found")
    return value

# Use python-decouple or similar
from decouple import config

DATABASE_URL = config("DATABASE_URL")
API_KEY = config("API_KEY")

# BAD - Hardcoded secrets
API_KEY = "sk-1234567890abcdef"  # NEVER DO THIS
DATABASE_URL = "postgresql://user:password@localhost/db"
```

### Path Traversal Prevention
```python
# GOOD - Validate file paths
import os
from pathlib import Path

ALLOWED_DIRECTORY = Path("/var/app/uploads")

def safe_file_access(filename: str) -> Path:
    """Safely construct file path preventing traversal."""
    # Remove any path components
    safe_name = Path(filename).name
    full_path = (ALLOWED_DIRECTORY / safe_name).resolve()
    
    # Ensure path is within allowed directory
    if not full_path.is_relative_to(ALLOWED_DIRECTORY):
        raise ValueError("Invalid file path")
    
    return full_path

# BAD - Direct path concatenation
def unsafe_file_access(filename: str):
    return f"/var/app/uploads/{filename}"
    # Attacker can use: ../../etc/passwd
```

## Error Handling

### Exception Handling
```python
# GOOD - Specific exception handling
def read_config(file_path: str) -> dict:
    """Read configuration from a JSON file."""
    try:
        with open(file_path) as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Config file not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in config file: {e}")
        raise ConfigurationError(f"Invalid config file: {file_path}") from e
    except PermissionError:
        logger.error(f"Permission denied reading: {file_path}")
        raise

# BAD - Bare except or catching Exception
def read_config_bad(file_path: str):
    try:
        with open(file_path) as f:
            return json.load(f)
    except:  # Catches everything including KeyboardInterrupt!
        return {}
```

### Custom Exceptions
```python
# GOOD - Custom exception hierarchy
class ApplicationError(Exception):
    """Base exception for application errors."""
    pass

class ValidationError(ApplicationError):
    """Raised when validation fails."""
    pass

class AuthenticationError(ApplicationError):
    """Raised when authentication fails."""
    pass

class DatabaseError(ApplicationError):
    """Raised when database operations fail."""
    pass

# Use custom exceptions
def validate_user(data: dict) -> None:
    if "email" not in data:
        raise ValidationError("Email is required")
    if not data["email"].endswith("@example.com"):
        raise ValidationError("Only example.com emails allowed")
```

### Error Propagation
```python
# GOOD - Let errors propagate with context
def process_order(order_id: int) -> Order:
    """Process an order, raising errors with context."""
    try:
        order = fetch_order(order_id)
    except DatabaseError as e:
        raise OrderProcessingError(
            f"Failed to fetch order {order_id}"
        ) from e
    
    try:
        payment = process_payment(order)
    except PaymentError as e:
        order.status = "payment_failed"
        order.save()
        raise OrderProcessingError(
            f"Payment failed for order {order_id}"
        ) from e
    
    return order

# BAD - Swallowing exceptions
def process_order_bad(order_id: int):
    try:
        order = fetch_order(order_id)
        payment = process_payment(order)
        return order
    except Exception:
        return None  # Lost all error context!
```

## Testing Standards

### Test Structure with pytest
```python
# tests/test_user_service.py
import pytest
from unittest.mock import Mock, patch
from myapp.services import UserService
from myapp.models import User
from myapp.exceptions import ValidationError

class TestUserService:
    """Test suite for UserService."""
    
    @pytest.fixture
    def user_service(self):
        """Fixture to create UserService instance."""
        return UserService()
    
    @pytest.fixture
    def sample_user(self):
        """Fixture for sample user data."""
        return User(
            id=1,
            username="testuser",
            email="test@example.com"
        )
    
    def test_create_user_success(self, user_service, sample_user):
        """Test successful user creation."""
        # Arrange
        user_data = {
            "username": "newuser",
            "email": "new@example.com"
        }
        
        # Act
        with patch.object(user_service, "_save_to_db") as mock_save:
            mock_save.return_value = sample_user
            result = user_service.create_user(user_data)
        
        # Assert
        assert result.username == "testuser"
        mock_save.assert_called_once()
    
    def test_create_user_invalid_email(self, user_service):
        """Test user creation with invalid email."""
        user_data = {
            "username": "testuser",
            "email": "invalid-email"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            user_service.create_user(user_data)
        
        assert "email" in str(exc_info.value).lower()
    
    @pytest.mark.parametrize("username,expected_valid", [
        ("valid_user", True),
        ("a", False),  # Too short
        ("user@invalid", False),  # Invalid characters
        ("valid123", True),
    ])
    def test_validate_username(self, user_service, username, expected_valid):
        """Test username validation with various inputs."""
        if expected_valid:
            assert user_service.validate_username(username)
        else:
            with pytest.raises(ValidationError):
                user_service.validate_username(username)
```

### Test Coverage Requirements
```python
# By Project Type:
# - Critical/Production: 95% coverage minimum
# - Standard/Business: 90% coverage minimum
# - Internal/Prototype: 85% coverage minimum

# pytest.ini configuration
"""
[pytest]
minversion = 7.0
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --strict-markers
    --strict-config
    --cov=myapp
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=90
    -v
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
"""
```

### Mocking Best Practices
```python
# GOOD - Mock external dependencies
from unittest.mock import Mock, patch, MagicMock

def test_fetch_user_data():
    """Test fetching user data from external API."""
    with patch("requests.get") as mock_get:
        # Setup mock response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"id": 1, "name": "Test"}
        mock_get.return_value = mock_response
        
        # Test function that uses requests.get
        result = fetch_user_data(1)
        
        assert result["name"] == "Test"
        mock_get.assert_called_once_with(
            "https://api.example.com/users/1",
            timeout=30
        )

# Use pytest-mock for easier mocking
def test_with_pytest_mock(mocker):
    """Test using pytest-mock plugin."""
    mock_db = mocker.patch("myapp.database.get_connection")
    mock_db.return_value.query.return_value = [{"id": 1}]
    
    result = get_all_users()
    assert len(result) == 1
```

## Performance Optimization

### Use Built-in Functions
```python
# GOOD - Use built-in functions (implemented in C)
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
maximum = max(numbers)
minimum = min(numbers)

# BAD - Manual implementation
total = 0
for num in numbers:
    total += num
```

### String Concatenation
```python
# GOOD - Use join for multiple strings
parts = ["part1", "part2", "part3"]
result = "".join(parts)

# For formatting, use f-strings
name = "John"
age = 30
message = f"User {name} is {age} years old"

# BAD - Repeated string concatenation
result = ""
for part in parts:
    result += part  # Creates new string each time
```

### List Operations
```python
# GOOD - List comprehensions for simple operations
squares = [x**2 for x in range(1000)]

# Use generators for large datasets
squares_gen = (x**2 for x in range(1000000))

# BAD - Append in loop for simple operations
squares = []
for x in range(1000):
    squares.append(x**2)
```

### Dictionary Operations
```python
# GOOD - Use dict.get() with default
value = my_dict.get("key", default_value)

# Use defaultdict for accumulation
from collections import defaultdict

word_count = defaultdict(int)
for word in words:
    word_count[word] += 1

# BAD - Check key existence every time
if "key" in my_dict:
    value = my_dict["key"]
else:
    value = default_value
```

### Function Caching
```python
# GOOD - Cache expensive computations
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    """Calculate Fibonacci number with caching."""
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Use cache for configuration
@lru_cache(maxsize=1)
def get_config() -> dict:
    """Load and cache configuration."""
    with open("config.json") as f:
        return json.load(f)
```

## Documentation Standards

### Module Docstrings
```python
"""
User authentication and authorization module.

This module provides functionality for user authentication, password
management, and role-based authorization. It integrates with the
database layer and external identity providers.

Example:
    >>> from myapp.auth import authenticate_user
    >>> user = authenticate_user("john@example.com", "password")
    >>> if user:
    ...     print(f"Welcome {user.username}")

Attributes:
    DEFAULT_TOKEN_EXPIRY (int): Default JWT token expiry in seconds
    MAX_LOGIN_ATTEMPTS (int): Maximum failed login attempts before lockout
"""
```

### Function Docstrings
```python
def calculate_order_total(
    items: List[OrderItem],
    discount_code: Optional[str] = None,
    tax_rate: float = 0.08
) -> OrderTotal:
    """
    Calculate the total cost of an order including tax and discounts.
    
    This function processes a list of order items, applies any discount
    codes, and calculates the final total including applicable taxes.
    
    Args:
        items: List of OrderItem objects to be processed
        discount_code: Optional discount code to apply
        tax_rate: Tax rate as a decimal (default: 0.08 for 8%)
        
    Returns:
        OrderTotal object containing subtotal, tax, discount, and total
        
    Raises:
        ValidationError: If items list is empty
        DiscountCodeError: If discount_code is invalid or expired
        
    Example:
        >>> items = [OrderItem(name="Book", price=10.00, quantity=2)]
        >>> total = calculate_order_total(items, discount_code="SAVE10")
        >>> print(f"Total: ${total.final_amount:.2f}")
        Total: $19.44
        
    Note:
        Tax is calculated on the discounted subtotal, not the original.
    """
    if not items:
        raise ValidationError("Order must contain at least one item")
    
    # Implementation...
```

### Class Docstrings
```python
class UserRepository:
    """
    Repository for user data access operations.
    
    This class provides an abstraction layer for user-related database
    operations, implementing the repository pattern to separate business
    logic from data access logic.
    
    Attributes:
        db_session: SQLAlchemy database session
        cache_enabled: Whether to enable query result caching
        
    Example:
        >>> repo = UserRepository(db_session)
        >>> user = repo.find_by_email("user@example.com")
        >>> repo.update(user.id, {"is_active": True})
    """
    
    def __init__(self, db_session, cache_enabled: bool = True):
        """
        Initialize the UserRepository.
        
        Args:
            db_session: Active SQLAlchemy session
            cache_enabled: Enable query result caching (default: True)
        """
        self.db_session = db_session
        self.cache_enabled = cache_enabled
```

## Linter Configuration

### Pylint Configuration (.pylintrc)
```ini
[MASTER]
jobs=4
persistent=yes
suggestion-mode=yes
unsafe-load-any-extension=no

[MESSAGES CONTROL]
disable=
    C0111,  # missing-docstring (handled by pydocstyle)
    R0903,  # too-few-public-methods (often needed for data classes)
    W0212,  # protected-access (sometimes needed in tests)

enable=
    useless-suppression,
    deprecated-pragma,
    use-symbolic-message-instead

[REPORTS]
output-format=colorized
reports=yes
score=yes

[BASIC]
good-names=i,j,k,ex,Run,_,id,db,pk
bad-names=foo,bar,baz,toto,tutu,tata
include-naming-hint=yes

const-naming-style=UPPER_CASE
class-naming-style=PascalCase
function-naming-style=snake_case
method-naming-style=snake_case
attr-naming-style=snake_case
argument-naming-style=snake_case
variable-naming-style=snake_case
module-naming-style=snake_case

[FORMAT]
max-line-length=100
indent-string='    '
expected-line-ending-format=LF

[DESIGN]
max-args=7
max-attributes=10
max-bool-expr=5
max-branches=12
max-locals=15
max-returns=6
max-statements=50
min-public-methods=1

[IMPORTS]
allow-wildcard-with-all=no
analyse-fallback-blocks=no
deprecated-modules=optparse,imp

[CLASSES]
defining-attr-methods=__init__,__new__,setUp,__post_init__
valid-classmethod-first-arg=cls
valid-metaclass-classmethod-first-arg=mcs

[EXCEPTIONS]
overgeneral-exceptions=BaseException,Exception
```

### Flake8 Configuration (.flake8)
```ini
[flake8]
max-line-length = 100
max-complexity = 10
exclude = 
    .git,
    __pycache__,
    .venv,
    venv,
    build,
    dist,
    *.egg-info,
    .tox,
    .pytest_cache

ignore = 
    E203,  # whitespace before ':'
    E266,  # too many leading '#' for block comment
    E501,  # line too long (handled by black)
    W503,  # line break before binary operator
    F401,  # imported but unused (handled by autoflake)

per-file-ignores =
    __init__.py:F401
    tests/*:S101,S106

# Enable PyFlakes codes
enable-extensions = G

# McCabe complexity
max-complexity = 10

# Docstring conventions
docstring-convention = google
```

### Black Configuration (pyproject.toml)
```toml
[tool.black]
line-length = 100
target-version = ['py310', 'py311']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
)/
'''
```

### mypy Configuration (mypy.ini)
```ini
[mypy]
python_version = 3.10
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
disallow_incomplete_defs = True
check_untyped_defs = True
disallow_untyped_decorators = False
no_implicit_optional = True
warn_redundant_casts = True
warn_unused_ignores = True
warn_no_return = True
warn_unreachable = True
strict_equality = True
show_error_codes = True
show_column_numbers = True

[mypy-tests.*]
disallow_untyped_defs = False

[mypy-migrations.*]
ignore_errors = True

[mypy-pytest.*]
ignore_missing_imports = True

[mypy-setuptools.*]
ignore_missing_imports = True
```

### isort Configuration (pyproject.toml)
```toml
[tool.isort]
profile = "black"
line_length = 100
multi_line_output = 3
include_trailing_comma = true
force_grid_wrap = 0
use_parentheses = true
ensure_newline_before_comments = true
skip_gitignore = true
skip_glob = ["*/migrations/*", "*/venv/*"]
known_first_party = ["myapp"]
known_third_party = ["django", "flask", "fastapi", "sqlalchemy"]
sections = ["FUTURE", "STDLIB", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]
```

## CI/CD Integration

### Pre-commit Configuration (.pre-commit-config.yaml)
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: debug-statements

  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3.10

  - repo: https://github.com/PyCQA/isort
    rev: 5.13.2
    hooks:
      - id: isort

  - repo: https://github.com/PyCQA/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        additional_dependencies: [
          flake8-docstrings,
          flake8-bugbear,
          flake8-comprehensions,
          flake8-simplify,
        ]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]

  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.6
    hooks:
      - id: bandit
        args: ['-c', 'pyproject.toml']
```

### GitHub Actions Workflow (.github/workflows/python-lint.yml)
```yaml
name: Python Linting and Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]

    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v5
      with:
        python-version: ${{ matrix.python-version }}
        cache: 'pip'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements-dev.txt
    
    - name: Run Black
      run: black --check .
    
    - name: Run isort
      run: isort --check-only .
    
    - name: Run Flake8
      run: flake8 .
    
    - name: Run Pylint
      run: pylint myapp/
    
    - name: Run mypy
      run: mypy myapp/
    
    - name: Run Bandit (Security)
      run: bandit -r myapp/ -f json -o bandit-report.json
    
    - name: Run pytest with coverage
      run: |
        pytest --cov=myapp --cov-report=xml --cov-report=term-missing
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        fail_ci_if_error: true
```

## Common Anti-Patterns

### Mutable Default Arguments
```python
# BAD - Mutable default argument
def add_item(item, items=[]):
    items.append(item)
    return items

# GOOD - Use None and create new list
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Catching Too Broad Exceptions
```python
# BAD - Catching everything
try:
    risky_operation()
except:
    pass

# GOOD - Specific exception handling
try:
    risky_operation()
except (ValueError, KeyError) as e:
    logger.error(f"Operation failed: {e}")
    raise
```

### Not Using Context Managers
```python
# BAD - Manual resource management
file = open("data.txt")
data = file.read()
file.close()

# GOOD - Context manager
with open("data.txt") as file:
    data = file.read()
```

### Global Variables
```python
# BAD - Global mutable state
global_counter = 0

def increment():
    global global_counter
    global_counter += 1

# GOOD - Class-based state or dependency injection
class Counter:
    def __init__(self):
        self._count = 0
    
    def increment(self):
        self._count += 1
```

### Import *
```python
# BAD - Wildcard imports
from module import *

# GOOD - Explicit imports
from module import function1, function2, ClassName
```

## Code Review Checklist

- [ ] All functions have type hints
- [ ] All public APIs have docstrings
- [ ] Test coverage meets minimum threshold (85%/90%/95%)
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all external data
- [ ] Parameterized queries for database access
- [ ] Proper exception handling with specific exceptions
- [ ] No mutable default arguments
- [ ] Resources managed with context managers
- [ ] Following PEP 8 naming conventions
- [ ] All linters pass (Black, isort, Flake8, Pylint, mypy)
- [ ] Security scan passes (Bandit)
- [ ] No TODO or FIXME comments in production code

---

**Enforcement:** These rules are automatically enforced through pre-commit hooks, CI/CD pipelines, and code review processes. All violations must be resolved before merge.
