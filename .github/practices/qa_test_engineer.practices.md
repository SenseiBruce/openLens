# QA/Test Engineer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** QA/Test Engineer  
**Purpose:** Guidance for comprehensive testing, quality assurance, and test automation

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Test Strategy & Planning](#test-strategy--planning)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Security Testing](#security-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Contract Testing](#contract-testing)
10. [Test Automation Frameworks](#test-automation-frameworks)
11. [Test Coverage Requirements](#test-coverage-requirements)
12. [Bug Tracking & Reporting](#bug-tracking--reporting)
13. [Cross-Platform Testing](#cross-platform-testing)
14. [Continuous Testing in CI/CD](#continuous-testing-in-cicd)
15. [Quality Standards](#quality-standards)
16. [Integration Points](#integration-points)
17. [Tools & Frameworks](#tools--frameworks)
18. [Project Type Adaptations](#project-type-adaptations)
19. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 Quality First Mindset
- **Prevention over detection:** Build quality in, don't test it in
- **Shift-left testing:** Test as early as possible in the development cycle
- **Continuous testing:** Automate and integrate testing throughout CI/CD
- **Risk-based testing:** Focus on high-impact, high-probability issues
- **User-centric:** Test from the user's perspective

### 1.2 Test Automation
- **Automate repetitive tests:** Free up time for exploratory testing
- **Maintainable tests:** Write clear, DRY test code
- **Fast feedback:** Tests should run quickly
- **Reliable tests:** No flaky tests in the suite
- **Test the right things:** Focus on behavior, not implementation

### 1.3 Comprehensive Coverage
- **All test types:** Unit, integration, E2E, security, performance, accessibility
- **All platforms:** Windows, macOS, Linux, mobile, containers
- **All browsers:** Chrome, Firefox, Safari, Edge
- **All scenarios:** Happy path, edge cases, error conditions
- **All environments:** Local, CI, staging, production monitoring

---

## Test Strategy & Planning

### 2.1 Test Plan Template

```markdown
# Test Plan: [Feature Name]

## Overview
- **Feature:** [Feature description]
- **Version:** [Version number]
- **Author:** [QA Engineer name]
- **Date:** [Date]

## Scope
### In Scope
- User authentication flow
- Password reset functionality
- Session management

### Out of Scope
- Third-party OAuth providers (future release)

## Test Objectives
1. Verify all authentication flows work correctly
2. Ensure security requirements are met
3. Validate error handling and user feedback
4. Test across all supported browsers

## Test Approach
- **Unit Tests:** 95% coverage for auth service
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Complete user flows in Cypress
- **Security Tests:** OWASP Top 10 validation
- **Performance Tests:** Login latency < 200ms

## Test Environment
- **Development:** Local Docker environment
- **Staging:** AWS staging cluster
- **Production:** Monitoring and smoke tests

## Test Schedule
| Phase | Start Date | End Date | Status |
|-------|-----------|----------|--------|
| Test Planning | 2026-02-01 | 2026-02-03 | Complete |
| Test Development | 2026-02-04 | 2026-02-10 | In Progress |
| Test Execution | 2026-02-11 | 2026-02-15 | Not Started |
| Bug Fixing | 2026-02-16 | 2026-02-20 | Not Started |

## Entry Criteria
- [ ] Feature code complete
- [ ] Unit tests passing
- [ ] Deployed to staging environment
- [ ] Test data prepared

## Exit Criteria
- [ ] All test cases executed
- [ ] 95% test coverage achieved
- [ ] No critical bugs open
- [ ] Performance requirements met
- [ ] Security scan passed

## Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Test environment unavailable | High | Low | Backup environment available |
| Incomplete requirements | High | Medium | Regular sync with Product Manager |

## Deliverables
- Test cases and test data
- Automated test scripts
- Test execution report
- Bug reports
- Test coverage report
```

### 2.2 Test Case Template

```gherkin
Feature: User Login

Background:
  Given the application is running
  And the database is seeded with test users

Scenario: Successful login with valid credentials
  Given I am on the login page
  When I enter email "user@example.com"
  And I enter password "ValidPass123!"
  And I click the "Login" button
  Then I should be redirected to the dashboard
  And I should see a welcome message "Welcome, John"
  And a session cookie should be set

Scenario: Failed login with invalid password
  Given I am on the login page
  When I enter email "user@example.com"
  And I enter password "WrongPassword"
  And I click the "Login" button
  Then I should see an error message "Invalid credentials"
  And I should remain on the login page
  And no session cookie should be set

Scenario: Failed login with non-existent email
  Given I am on the login page
  When I enter email "nonexistent@example.com"
  And I enter password "SomePassword123"
  And I click the "Login" button
  Then I should see an error message "Invalid credentials"
  And the response should not reveal whether the email exists

Scenario: Account lockout after multiple failed attempts
  Given I am on the login page
  When I attempt to login with wrong password 5 times
  Then I should see an error message "Account locked"
  And I should not be able to login even with correct password
  And an account lockout email should be sent

Scenario Outline: Password validation
  Given I am on the signup page
  When I enter password "<password>"
  Then I should see validation message "<message>"

  Examples:
    | password | message |
    | short | Password must be at least 8 characters |
    | nouppercaseornumbers | Password must contain uppercase and numbers |
    | ValidPass123! | Password accepted |
```

---

## Unit Testing

### 3.1 Unit Test Best Practices

**Python (pytest):**
```python
# tests/unit/test_user_service.py
import pytest
from unittest.mock import Mock, patch
from services.user_service import UserService
from models.user import User

class TestUserService:
    """Test suite for UserService."""
    
    @pytest.fixture
    def user_service(self):
        """Create UserService instance for testing."""
        return UserService()
    
    @pytest.fixture
    def mock_user(self):
        """Create a mock user for testing."""
        return User(
            id=1,
            email='test@example.com',
            first_name='John',
            last_name='Doe'
        )
    
    def test_create_user_success(self, user_service, mock_user):
        """Test successful user creation."""
        with patch('repositories.user_repository.UserRepository.save') as mock_save:
            mock_save.return_value = mock_user
            
            result = user_service.create_user(
                email='test@example.com',
                first_name='John',
                last_name='Doe'
            )
            
            assert result.email == 'test@example.com'
            assert result.first_name == 'John'
            mock_save.assert_called_once()
    
    def test_create_user_duplicate_email(self, user_service):
        """Test user creation with duplicate email raises error."""
        with patch('repositories.user_repository.UserRepository.exists_by_email') as mock_exists:
            mock_exists.return_value = True
            
            with pytest.raises(ValueError, match='already exists'):
                user_service.create_user(
                    email='existing@example.com',
                    first_name='Jane',
                    last_name='Doe'
                )
    
    @pytest.mark.parametrize('email,valid', [
        ('valid@example.com', True),
        ('invalid-email', False),
        ('', False),
        ('no-at-sign.com', False),
    ])
    def test_email_validation(self, user_service, email, valid):
        """Test email validation with various inputs."""
        if valid:
            user_service._validate_email(email)
        else:
            with pytest.raises(ValueError):
                user_service._validate_email(email)
    
    def test_get_user_not_found(self, user_service):
        """Test getting non-existent user returns None."""
        with patch('repositories.user_repository.UserRepository.find_by_id') as mock_find:
            mock_find.return_value = None
            
            result = user_service.get_user(999)
            
            assert result is None
            mock_find.assert_called_once_with(999)
```

**JavaScript (Jest):**
```javascript
// tests/unit/userService.test.js
import { UserService } from '../src/services/userService';
import { UserRepository } from '../src/repositories/userRepository';

jest.mock('../src/repositories/userRepository');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockUserRepository.save.mockResolvedValue({
        id: 1,
        ...userData
      });

      const result = await userService.createUser(userData);

      expect(result).toHaveProperty('id', 1);
      expect(result.email).toBe('test@example.com');
      expect(mockUserRepository.save).toHaveBeenCalledWith(userData);
    });

    it('should throw error for duplicate email', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);

      await expect(
        userService.createUser({
          email: 'existing@example.com',
          firstName: 'Jane',
          lastName: 'Doe'
        })
      ).rejects.toThrow('already exists');
    });
  });

  describe('validateEmail', () => {
    it.each([
      ['valid@example.com', true],
      ['invalid-email', false],
      ['', false],
      ['no-at-sign.com', false],
    ])('should validate email %s as %s', (email, isValid) => {
      if (isValid) {
        expect(() => userService.validateEmail(email)).not.toThrow();
      } else {
        expect(() => userService.validateEmail(email)).toThrow();
      }
    });
  });
});
```

### 3.2 Test Coverage Configuration

**pytest configuration (.coveragerc):**
```ini
[run]
source = src
omit =
    */tests/*
    */migrations/*
    */venv/*
    */__pycache__/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
    if TYPE_CHECKING:
    @abstractmethod

precision = 2
show_missing = True
skip_covered = False

[html]
directory = htmlcov
```

**Jest configuration (jest.config.js):**
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/index.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};
```

---

## Integration Testing

### 4.1 API Integration Tests

**Python (pytest + requests):**
```python
# tests/integration/test_api.py
import pytest
import requests
from faker import Faker

fake = Faker()

class TestUserAPI:
    """Integration tests for User API."""
    
    @pytest.fixture(scope='class')
    def base_url(self):
        """API base URL."""
        return 'http://localhost:8000/api/v1'
    
    @pytest.fixture
    def auth_headers(self, base_url):
        """Get authentication headers."""
        response = requests.post(f'{base_url}/auth/login', json={
            'email': 'admin@example.com',
            'password': 'AdminPass123!'
        })
        token = response.json()['access_token']
        return {'Authorization': f'Bearer {token}'}
    
    def test_create_user(self, base_url, auth_headers):
        """Test user creation via API."""
        user_data = {
            'email': fake.email(),
            'firstName': fake.first_name(),
            'lastName': fake.last_name()
        }
        
        response = requests.post(
            f'{base_url}/users',
            json=user_data,
            headers=auth_headers
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data['email'] == user_data['email']
        assert 'id' in data
        
        # Cleanup
        requests.delete(f"{base_url}/users/{data['id']}", headers=auth_headers)
    
    def test_get_user(self, base_url, auth_headers):
        """Test retrieving user via API."""
        # Create user first
        user_data = {'email': fake.email(), 'firstName': 'John', 'lastName': 'Doe'}
        create_response = requests.post(
            f'{base_url}/users',
            json=user_data,
            headers=auth_headers
        )
        user_id = create_response.json()['id']
        
        # Get user
        response = requests.get(f'{base_url}/users/{user_id}', headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json()['email'] == user_data['email']
        
        # Cleanup
        requests.delete(f'{base_url}/users/{user_id}', headers=auth_headers)
    
    def test_update_user(self, base_url, auth_headers):
        """Test updating user via API."""
        # Create user
        create_response = requests.post(
            f'{base_url}/users',
            json={'email': fake.email(), 'firstName': 'John', 'lastName': 'Doe'},
            headers=auth_headers
        )
        user_id = create_response.json()['id']
        
        # Update user
        update_data = {'firstName': 'Jane', 'lastName': 'Smith'}
        response = requests.put(
            f'{base_url}/users/{user_id}',
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert response.json()['firstName'] == 'Jane'
        
        # Cleanup
        requests.delete(f'{base_url}/users/{user_id}', headers=auth_headers)
    
    def test_delete_user(self, base_url, auth_headers):
        """Test deleting user via API."""
        # Create user
        create_response = requests.post(
            f'{base_url}/users',
            json={'email': fake.email(), 'firstName': 'John', 'lastName': 'Doe'},
            headers=auth_headers
        )
        user_id = create_response.json()['id']
        
        # Delete user
        response = requests.delete(f'{base_url}/users/{user_id}', headers=auth_headers)
        
        assert response.status_code == 204
        
        # Verify deletion
        get_response = requests.get(f'{base_url}/users/{user_id}', headers=auth_headers)
        assert get_response.status_code == 404
```

### 4.2 Database Integration Tests

```python
# tests/integration/test_database.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Post

@pytest.fixture(scope='session')
def engine():
    """Create test database engine."""
    return create_engine('postgresql://test:test@localhost:5432/test_db')

@pytest.fixture(scope='session')
def tables(engine):
    """Create all tables."""
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def session(engine, tables):
    """Create database session for tests."""
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.rollback()
    session.close()

def test_user_post_relationship(session):
    """Test user-post relationship in database."""
    # Create user
    user = User(email='test@example.com', first_name='John', last_name='Doe')
    session.add(user)
    session.commit()
    
    # Create posts
    post1 = Post(title='Post 1', content='Content 1', author_id=user.id)
    post2 = Post(title='Post 2', content='Content 2', author_id=user.id)
    session.add_all([post1, post2])
    session.commit()
    
    # Verify relationship
    assert len(user.posts) == 2
    assert post1.author.email == 'test@example.com'
```

---

## End-to-End Testing

### 5.1 Cypress E2E Tests

```javascript
// cypress/e2e/login.cy.js
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('ValidPass123!');
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
    
    // Verify session
    cy.getCookie('session').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('WrongPassword');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
    
    cy.url().should('include', '/login');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="email-error"]').should('contain', 'Email is required');
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required');
  });

  it('should navigate to password reset', () => {
    cy.get('[data-testid="forgot-password-link"]').click();
    cy.url().should('include', '/reset-password');
  });

  it('should be accessible via keyboard', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'email-input');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'password-input');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'submit-button');
  });
});

// cypress/e2e/user-management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'AdminPass123!');
    cy.visit('/admin/users');
  });

  it('should create new user', () => {
    cy.get('[data-testid="create-user-button"]').click();
    
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="first-name-input"]').type('John');
    cy.get('[data-testid="last-name-input"]').type('Doe');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="users-table"]').should('contain', 'newuser@example.com');
  });

  it('should search for users', () => {
    cy.get('[data-testid="search-input"]').type('john');
    
    cy.get('[data-testid="users-table"] tbody tr').each(($row) => {
      cy.wrap($row).should('contain.text', 'john');
    });
  });

  it('should paginate users', () => {
    cy.get('[data-testid="page-2-button"]').click();
    cy.url().should('include', 'page=2');
    cy.get('[data-testid="users-table"] tbody tr').should('have.length.at.least', 1);
  });
});
```

### 5.2 Playwright E2E Tests

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'ValidPass123!');
    await page.click('[data-testid="submit-button"]');

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'WrongPassword');
    await page.click('[data-testid="submit-button"]');

    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid credentials');
  });

  test('should work across different browsers', async ({ browserName, page }) => {
    test.skip(browserName === 'webkit', 'Safari-specific issue pending');
    
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'ValidPass123!');
    await page.click('[data-testid="submit-button"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/login', route => route.abort());
    
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'ValidPass123!');
    await page.click('[data-testid="submit-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Network error');
  });
});
```

---

## Security Testing

### 6.1 OWASP Top 10 Testing

**SQL Injection Testing:**
```python
# tests/security/test_sql_injection.py
import pytest
import requests

class TestSQLInjection:
    """Test for SQL injection vulnerabilities."""
    
    @pytest.fixture
    def base_url(self):
        return 'http://localhost:8000/api/v1'
    
    @pytest.mark.parametrize('malicious_input', [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "' OR 1=1--",
    ])
    def test_sql_injection_login(self, base_url, malicious_input):
        """Test SQL injection attempts in login."""
        response = requests.post(f'{base_url}/auth/login', json={
            'email': malicious_input,
            'password': 'password'
        })
        
        # Should not succeed or reveal SQL errors
        assert response.status_code in [400, 401, 422]
        assert 'SQL' not in response.text.upper()
        assert 'SYNTAX' not in response.text.upper()
```

**XSS Testing:**
```python
# tests/security/test_xss.py
@pytest.mark.parametrize('xss_payload', [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '<iframe src="javascript:alert(\'XSS\')">',
])
def test_xss_in_user_input(base_url, auth_headers, xss_payload):
    """Test XSS prevention in user inputs."""
    response = requests.post(f'{base_url}/users', json={
        'email': 'test@example.com',
        'firstName': xss_payload,
        'lastName': 'Doe'
    }, headers=auth_headers)
    
    # Get the created user
    user_id = response.json()['id']
    get_response = requests.get(f'{base_url}/users/{user_id}', headers=auth_headers)
    
    # Verify XSS payload is escaped/sanitized
    data = get_response.json()
    assert '<script>' not in data['firstName'].lower()
    assert 'javascript:' not in data['firstName'].lower()
```

**Authentication Testing:**
```python
# tests/security/test_authentication.py
def test_access_protected_endpoint_without_auth(base_url):
    """Test that protected endpoints require authentication."""
    response = requests.get(f'{base_url}/users')
    assert response.status_code == 401

def test_invalid_jwt_token(base_url):
    """Test that invalid JWT tokens are rejected."""
    headers = {'Authorization': 'Bearer invalid.token.here'}
    response = requests.get(f'{base_url}/users', headers=headers)
    assert response.status_code == 401

def test_expired_jwt_token(base_url):
    """Test that expired tokens are rejected."""
    expired_token = generate_expired_token()
    headers = {'Authorization': f'Bearer {expired_token}'}
    response = requests.get(f'{base_url}/users', headers=headers)
    assert response.status_code == 401
```

### 6.2 Automated Security Scanning

**OWASP ZAP Integration:**
```python
# tests/security/test_zap_scan.py
from zapv2 import ZAPv2

def test_zap_baseline_scan():
    """Run OWASP ZAP baseline scan."""
    zap = ZAPv2(apikey='your-api-key', proxies={'http': 'http://localhost:8080'})
    
    target = 'http://localhost:8000'
    
    # Spider the target
    scan_id = zap.spider.scan(target)
    while int(zap.spider.status(scan_id)) < 100:
        time.sleep(2)
    
    # Active scan
    scan_id = zap.ascan.scan(target)
    while int(zap.ascan.status(scan_id)) < 100:
        time.sleep(5)
    
    # Get alerts
    alerts = zap.core.alerts(baseurl=target)
    
    # Assert no high-risk vulnerabilities
    high_risk_alerts = [a for a in alerts if a['risk'] == 'High']
    assert len(high_risk_alerts) == 0, f"High risk vulnerabilities found: {high_risk_alerts}"
```

---

## Performance Testing

### 7.1 Load Testing with Locust

```python
# tests/performance/locustfile.py
from locust import HttpUser, task, between
import random

class WebsiteUser(HttpUser):
    """Simulate website user behavior."""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """Login before starting tasks."""
        response = self.client.post('/api/v1/auth/login', json={
            'email': 'test@example.com',
            'password': 'TestPass123!'
        })
        self.token = response.json()['access_token']
        self.headers = {'Authorization': f'Bearer {self.token}'}
    
    @task(3)
    def view_homepage(self):
        """View homepage (most common action)."""
        self.client.get('/')
    
    @task(2)
    def list_users(self):
        """List users."""
        self.client.get('/api/v1/users', headers=self.headers)
    
    @task(1)
    def get_user(self):
        """Get specific user."""
        user_id = random.randint(1, 100)
        self.client.get(f'/api/v1/users/{user_id}', headers=self.headers)
    
    @task(1)
    def create_user(self):
        """Create new user."""
        self.client.post('/api/v1/users', json={
            'email': f'user{random.randint(1000, 9999)}@example.com',
            'firstName': 'Test',
            'lastName': 'User'
        }, headers=self.headers)

# Run: locust --headless -f locustfile.py --users 100 --spawn-rate 10 --run-time 5m
```

### 7.2 Performance Benchmarks

**API Response Time Tests:**
```python
# tests/performance/test_response_times.py
import pytest
import requests
import time

class TestPerformance:
    """Performance tests for API endpoints."""
    
    @pytest.fixture
    def base_url(self):
        return 'http://localhost:8000/api/v1'
    
    def test_list_users_response_time(self, base_url, auth_headers):
        """Test that listing users responds within SLA."""
        start_time = time.time()
        response = requests.get(f'{base_url}/users', headers=auth_headers)
        duration = time.time() - start_time
        
        assert response.status_code == 200
        assert duration < 0.2, f"Response took {duration}s (threshold: 200ms)"
    
    def test_database_query_performance(self, base_url, auth_headers):
        """Test complex query performance."""
        start_time = time.time()
        response = requests.get(
            f'{base_url}/analytics/user-stats',
            headers=auth_headers
        )
        duration = time.time() - start_time
        
        assert response.status_code == 200
        assert duration < 1.0, f"Query took {duration}s (threshold: 1s)"
    
    @pytest.mark.parametrize('concurrent_requests', [10, 50, 100])
    def test_concurrent_load(self, base_url, auth_headers, concurrent_requests):
        """Test performance under concurrent load."""
        import concurrent.futures
        
        def make_request():
            response = requests.get(f'{base_url}/users', headers=auth_headers)
            return response.status_code, response.elapsed.total_seconds()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrent_requests) as executor:
            futures = [executor.submit(make_request) for _ in range(concurrent_requests)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        # All requests should succeed
        assert all(status == 200 for status, _ in results)
        
        # Average response time should be acceptable
        avg_time = sum(duration for _, duration in results) / len(results)
        assert avg_time < 0.5, f"Average response time: {avg_time}s"
```

---

## Accessibility Testing

### 8.1 Automated Accessibility Testing

```javascript
// tests/accessibility/a11y.test.js
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Login page should have no accessibility violations', async () => {
    const html = await getRenderedPage('/login');
    const results = await axe(html);
    
    expect(results).toHaveNoViolations();
  });

  it('should meet WCAG 2.1 Level AA standards', async () => {
    const html = await getRenderedPage('/dashboard');
    const results = await axe(html, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
      }
    });
    
    expect(results).toHaveNoViolations();
  });
});
```

**Cypress Accessibility Tests:**
```javascript
// cypress/e2e/accessibility.cy.js
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have no accessibility violations on homepage', () => {
    cy.checkA11y();
  });

  it('should have no accessibility violations on login page', () => {
    cy.visit('/login');
    cy.checkA11y();
  });

  it('should check specific elements', () => {
    cy.checkA11y('[data-testid="navigation"]');
  });

  it('should exclude specific rules', () => {
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: false }  // Exclude if justified
      }
    });
  });
});
```

### 8.2 Manual Accessibility Testing

**Keyboard Navigation Checklist:**
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Skip links provided
- [ ] Modal dialogs trap focus appropriately

**Screen Reader Testing:**
- [ ] Tested with NVDA (Windows)
- [ ] Tested with JAWS (Windows)
- [ ] Tested with VoiceOver (macOS/iOS)
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] ARIA attributes used correctly
- [ ] Live regions announce updates

---

## Contract Testing

### 9.1 Pact Contract Testing

**Consumer Side (Frontend):**
```javascript
// tests/contract/user-api.pact.test.js
import { PactV3 } from '@pact-foundation/pact';
import { like, eachLike } from '@pact-foundation/pact/dsl/matchers';

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'UserAPI',
});

describe('User API Contract', () => {
  it('should get list of users', async () => {
    await provider
      .given('users exist')
      .uponReceiving('a request for users')
      .withRequest({
        method: 'GET',
        path: '/api/v1/users',
        headers: { Authorization: like('Bearer token') },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: eachLike({
          id: like(1),
          email: like('user@example.com'),
          firstName: like('John'),
          lastName: like('Doe'),
        }),
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/api/v1/users`, {
          headers: { Authorization: 'Bearer token' },
        });
        const users = await response.json();
        
        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty('email');
      });
  });
});
```

**Provider Side (Backend):**
```python
# tests/contract/test_pact_provider.py
from pact import Verifier

def test_user_api_provider():
    """Verify that provider meets consumer contract."""
    verifier = Verifier(
        provider='UserAPI',
        provider_base_url='http://localhost:8000'
    )
    
    output, _ = verifier.verify_pacts(
        './pacts/frontendapp-userapi.json',
        provider_states_setup_url='http://localhost:8000/_pact/provider_states'
    )
    
    assert output == 0, "Pact verification failed"
```

---

## Test Automation Frameworks

### 10.1 Framework Selection Guide

| Framework | Use Case | Language | Best For |
|-----------|----------|----------|----------|
| pytest | Unit, Integration | Python | Backend testing |
| Jest | Unit, Integration | JavaScript | Frontend/Node.js |
| Cypress | E2E | JavaScript | Modern web apps |
| Playwright | E2E | JavaScript/Python | Cross-browser testing |
| Selenium | E2E | Multiple | Legacy apps |
| Locust | Performance | Python | Load testing |
| JMeter | Performance | Java | Complex scenarios |
| Pact | Contract | Multiple | Microservices |

---

## Test Coverage Requirements

### 11.1 Coverage by Project Type

| Project Type | Unit Coverage | Integration Coverage | E2E Coverage | Performance Tests |
|--------------|---------------|---------------------|--------------|-------------------|
| POC | 60%+ | Optional | Smoke only | No |
| Prototype | 75%+ | Basic | Critical paths | No |
| MVP | 85%+ | Comprehensive | Major flows | Basic |
| Handover | 95%+ | Comprehensive | Full coverage | Comprehensive |

### 11.2 Coverage by Component Type

| Component | Minimum Coverage |
|-----------|-----------------|
| Business Logic | 95% |
| API Endpoints | 90% |
| Database Models | 85% |
| UI Components | 85% |
| Utilities | 90% |
| Configuration | 75% |

---

## Bug Tracking & Reporting

### 12.1 Bug Report Template

```markdown
# Bug Report: [Short Description]

## Environment
- **Version:** 1.2.3
- **Environment:** Staging
- **Browser:** Chrome 121.0.6167.85
- **OS:** macOS 14.2
- **Device:** Desktop

## Severity
- [ ] Critical (system crash, data loss)
- [x] High (major feature broken)
- [ ] Medium (feature partially working)
- [ ] Low (cosmetic issue)

## Priority
- [x] P0 (fix immediately)
- [ ] P1 (fix in current sprint)
- [ ] P2 (fix in next sprint)
- [ ] P3 (backlog)

## Description
When attempting to create a new user with a duplicate email, the system crashes instead of showing a validation error.

## Steps to Reproduce
1. Navigate to `/admin/users`
2. Click "Create User" button
3. Enter email: `existing@example.com`
4. Enter first name: "John"
5. Enter last name: "Doe"
6. Click "Submit"

## Expected Behavior
- System should show validation error: "Email already exists"
- Form should remain on screen with entered data
- No system crash

## Actual Behavior
- White screen appears
- Console shows 500 Internal Server Error
- Error message: "Uncaught TypeError: Cannot read property 'id' of undefined"

## Attachments
- Screenshot: [error-screenshot.png]
- Console logs: [console-logs.txt]
- Network trace: [network-trace.har]
- Video: [reproduction-video.mp4]

## Additional Context
This only occurs when the email already exists in the database. New users can be created successfully.

## Suggested Fix
Add proper validation on the backend before attempting to create user. Return 409 Conflict status with clear error message.

## Related Issues
- Related to #456 (Email validation improvements)
```

### 12.2 Bug Metrics

**Track the following metrics:**
- Bug detection rate
- Bug escape rate (bugs found in production)
- Mean time to detect (MTTD)
- Mean time to resolve (MTTR)
- Bug reopening rate
- Bugs by severity/priority
- Bugs by component/module

---

## Cross-Platform Testing

### 13.1 Platform Matrix

**Desktop Browsers:**
| Browser | Versions | OS |
|---------|----------|-----|
| Chrome | Latest 2 | Windows, macOS, Linux |
| Firefox | Latest 2 | Windows, macOS, Linux |
| Safari | Latest 2 | macOS |
| Edge | Latest 2 | Windows |

**Mobile Browsers:**
| Browser | Versions | OS |
|---------|----------|-----|
| Safari | iOS 15+ | iOS |
| Chrome | Android 10+ | Android |

**Testing in Docker:**
```yaml
# docker-compose.test.yml
version: '3.8'

services:
  test-linux:
    image: python:3.11
    volumes:
      - .:/app
    command: pytest tests/ --platform=linux

  test-windows:
    image: mcr.microsoft.com/windows/servercore:ltsc2022
    volumes:
      - .:/app
    command: pytest tests/ --platform=windows
```

---

## Continuous Testing in CI/CD

### 14.1 CI/CD Integration

**GitHub Actions:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run unit tests
        run: pytest tests/unit/ --cov=src --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - name: Run integration tests
        run: pytest tests/integration/

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security tests
        run: |
          safety check
          bandit -r src/

  performance-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Run load tests
        run: locust --headless -f tests/performance/locustfile.py
```

---

## Quality Standards

### 15.1 Quality Metrics

**Test Execution:**
- Test pass rate: > 98%
- Flaky test rate: < 2%
- Test execution time: < 15 minutes
- Code coverage: Per project type requirements

**Bug Metrics:**
- Critical bugs in production: 0
- Bug escape rate: < 5%
- Mean time to detect: < 24 hours
- Mean time to resolve (Critical): < 4 hours

---

## Integration Points

### 16.1 Integration with Other Roles

**From Developers:**
- Code to test
- Unit tests
- API documentation
- Test data requirements

**To Developers:**
- Bug reports
- Test failures
- Test coverage reports
- Performance bottlenecks

**To Product Manager:**
- Test coverage reports
- Quality metrics
- Risk assessment
- Release readiness

**To DevOps:**
- Test automation scripts
- CI/CD test integration
- Environment requirements
- Test data management

---

## Tools & Frameworks

### 17.1 Recommended Tools

**Test Automation:**
- pytest, Jest (Unit)
- Cypress, Playwright (E2E)
- Locust, JMeter (Performance)
- Pact (Contract)

**Security:**
- OWASP ZAP
- Burp Suite
- Safety, Bandit

**Accessibility:**
- axe-core
- Pa11y
- Lighthouse

**Test Management:**
- TestRail
- Zephyr
- qTest

---

## Project Type Adaptations

### 18.1 POC
**Focus:** Basic smoke tests
**Coverage:** 60%+
**Time:** 10-20 hours

### 18.2 Prototype
**Focus:** Critical path testing
**Coverage:** 75%+
**Time:** 40-80 hours

### 18.3 MVP
**Focus:** Comprehensive testing
**Coverage:** 85%+
**Time:** 150-250 hours

### 18.4 Handover
**Focus:** Production-grade testing
**Coverage:** 95%+
**Time:** 300-500 hours

---

## Self-Assessment Checklist

### 19.1 Test Coverage
- [ ] Unit test coverage meets requirements
- [ ] Integration tests cover all APIs
- [ ] E2E tests cover critical user flows
- [ ] Security tests completed
- [ ] Performance tests passed
- [ ] Accessibility tests passed
- [ ] Contract tests (if microservices)
- [ ] Cross-platform tests completed

### 19.2 Test Quality
- [ ] No flaky tests
- [ ] Tests are maintainable
- [ ] Tests run fast (< 15 min total)
- [ ] Clear test descriptions
- [ ] Proper test data management
- [ ] Tests isolated and independent
- [ ] Code coverage tracked

### 19.3 Bug Management
- [ ] All bugs documented
- [ ] Severity/priority assigned
- [ ] Reproduction steps clear
- [ ] Bugs tracked in system
- [ ] Regression tests added
- [ ] Bug metrics tracked

### 19.4 Documentation
- [ ] Test plan created
- [ ] Test cases documented
- [ ] Test data documented
- [ ] Test environment setup documented
- [ ] Bug reports clear and detailed
- [ ] Test results shared with team

### 19.5 CI/CD Integration
- [ ] Tests integrated in pipeline
- [ ] Tests run on every commit
- [ ] Test failures block deployment
- [ ] Coverage reports generated
- [ ] Test results visible to team

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD.
