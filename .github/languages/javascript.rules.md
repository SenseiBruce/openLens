# JavaScript Coding Rules (ES6+)

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** ES6 (ECMAScript 2015)
- **Recommended Version:** ES2023+
- **Runtime:** Node.js 18+ for backend, Modern browsers (last 2 versions) for frontend
- **Philosophy:** Write modern, readable JavaScript using latest features

### Core Principles
- Use const/let, never var
- Leverage arrow functions and destructuring
- Embrace async/await over callbacks
- Write modular, testable code
- Follow functional programming principles where appropriate
- Prioritize readability and maintainability

## Naming Conventions

### Variables and Functions
```javascript
// GOOD - camelCase for variables and functions
const userName = 'John Doe';
let totalCount = 0;

function calculateTotalPrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const fetchUserData = async (userId) => {
  return await api.get(`/users/${userId}`);
};

// BAD - snake_case or PascalCase for variables
const user_name = 'John Doe';
const UserName = 'John Doe';

function Calculate_Total_Price(items) {
  return 0;
}
```

### Classes and Constructors
```javascript
// GOOD - PascalCase for classes
class UserAccount {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
  
  getFullInfo() {
    return `${this.username} (${this.email})`;
  }
}

class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

// BAD - camelCase or snake_case for classes
class userAccount {
  // ...
}
```

### Constants
```javascript
// GOOD - UPPER_SNAKE_CASE for true constants
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 30000;
const API_BASE_URL = 'https://api.example.com';

// Config objects can use camelCase
const config = {
  apiKey: process.env.API_KEY,
  maxConnections: 10,
  timeout: 5000
};

// BAD - Mixed conventions
const max_retry_attempts = 3;
const defaulttimeout = 30000;
```

### Private Members (Convention)
```javascript
// GOOD - Use # for truly private fields (ES2022+)
class BankAccount {
  #balance = 0;
  
  deposit(amount) {
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

// For older code, use _ prefix convention
class LegacyAccount {
  constructor() {
    this._balance = 0; // Convention: internal use only
  }
}

// BAD - Public fields that should be private
class Account {
  constructor() {
    this.balance = 0; // No protection
  }
}
```

### Files and Modules
```javascript
// GOOD - kebab-case or camelCase for files
user-service.js
userService.js
database-connection.js
paymentProcessor.js

// Components (React/Vue) can use PascalCase
UserProfile.jsx
PaymentForm.vue

// BAD - Inconsistent naming
User_Service.js
USERSERVICE.js
```

## Code Structure

### Module Organization (ES6 Modules)
```javascript
// user-service.js

// 1. Imports - external dependencies first
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 2. Imports - internal dependencies
import { User } from './models/User.js';
import { ValidationError } from './errors/index.js';
import config from './config.js';

// 3. Constants
const TOKEN_EXPIRY = '24h';
const SALT_ROUNDS = 10;

// 4. Private helper functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 5. Main exports
export class UserService {
  async createUser(userData) {
    // Implementation
  }
  
  async authenticate(email, password) {
    // Implementation
  }
}

// 6. Default export (if applicable)
export default new UserService();
```

### Function Structure
```javascript
// GOOD - Clear, focused functions with proper async/await
/**
 * Calculate the discounted price for an item
 * @param {number} basePrice - Original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @param {boolean} isMember - Whether customer is a member
 * @returns {number} Final price after discount
 * @throws {Error} If discount percentage is invalid
 */
function calculateDiscount(basePrice, discountPercent, isMember = false) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  
  let totalDiscount = discountPercent;
  if (isMember) {
    totalDiscount += 5; // Extra 5% for members
  }
  
  const discountAmount = basePrice * (totalDiscount / 100);
  return basePrice - discountAmount;
}

// Async function example
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// BAD - Callback hell
function fetchUserDataBad(userId, callback) {
  fetch(`/api/users/${userId}`, (err, response) => {
    if (err) {
      callback(err);
      return;
    }
    response.json((err, data) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, data);
    });
  });
}
```

## Language-Specific Patterns

### Destructuring
```javascript
// GOOD - Use destructuring for objects and arrays
const user = { name: 'John', age: 30, email: 'john@example.com' };
const { name, email } = user;

const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Function parameter destructuring
function greetUser({ name, age }) {
  return `Hello ${name}, you are ${age} years old`;
}

// With default values
function createUser({ 
  name, 
  email, 
  role = 'user',
  isActive = true 
}) {
  return { name, email, role, isActive };
}

// BAD - Manually extracting properties
const name = user.name;
const email = user.email;
const age = user.age;
```

### Arrow Functions
```javascript
// GOOD - Use arrow functions for callbacks and simple functions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Multi-line arrow functions
const processUser = (user) => {
  const sanitized = sanitizeInput(user);
  const validated = validateUser(sanitized);
  return validated;
};

// Use regular functions for methods that need 'this'
class Counter {
  constructor() {
    this.count = 0;
  }
  
  // GOOD - Regular method for 'this' binding
  increment() {
    this.count++;
  }
  
  // Arrow function in constructor for event handlers
  setupEventListener() {
    button.addEventListener('click', () => {
      this.increment(); // 'this' correctly refers to Counter instance
    });
  }
}

// BAD - Arrow function where 'this' is needed
class CounterBad {
  increment = () => {
    this.count++; // Works but creates new function for each instance
  }
}
```

### Template Literals
```javascript
// GOOD - Use template literals for string interpolation
const name = 'John';
const age = 30;
const message = `User ${name} is ${age} years old`;

// Multi-line strings
const html = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`;

// Complex expressions
const total = `Total: $${(price * quantity).toFixed(2)}`;

// BAD - String concatenation
const messageBad = 'User ' + name + ' is ' + age + ' years old';
```

### Spread and Rest Operators
```javascript
// GOOD - Use spread for arrays and objects
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };

// Clone with modifications
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31 };

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// BAD - Manual array/object copying
const combinedBad = arr1.concat(arr2);
const mergedBad = Object.assign({}, obj1, obj2);
```

### Promises and Async/Await
```javascript
// GOOD - Use async/await for cleaner async code
async function getUserWithPosts(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(userId);
    return { ...user, posts };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Unable to load user profile');
  }
}

// Parallel async operations
async function fetchMultipleUsers(userIds) {
  const promises = userIds.map(id => fetchUser(id));
  return await Promise.all(promises);
}

// Promise.allSettled for partial failures
async function fetchUserDataSafely(userId) {
  const results = await Promise.allSettled([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ]);
  
  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    posts: results[1].status === 'fulfilled' ? results[1].value : [],
    comments: results[2].status === 'fulfilled' ? results[2].value : []
  };
}

// BAD - Promise chains (when async/await is clearer)
function getUserWithPostsBad(userId) {
  return fetchUser(userId)
    .then(user => {
      return fetchUserPosts(userId)
        .then(posts => {
          return { ...user, posts };
        });
    })
    .catch(error => {
      console.error(error);
      throw new Error('Unable to load user profile');
    });
}
```

### Optional Chaining and Nullish Coalescing
```javascript
// GOOD - Use optional chaining (?.)
const userName = user?.profile?.name;
const firstPost = user?.posts?.[0];
const result = user?.getProfile?.();

// Nullish coalescing (??) - only null/undefined
const displayName = userName ?? 'Anonymous';
const port = config.port ?? 3000;

// Combined
const email = user?.contact?.email ?? 'no-email@example.com';

// BAD - Manual null checking
const userNameBad = user && user.profile && user.profile.name;
const displayNameBad = userName !== null && userName !== undefined 
  ? userName 
  : 'Anonymous';
```

## Security Patterns

### SQL Injection Prevention
```javascript
// GOOD - Use parameterized queries
import mysql from 'mysql2/promise';

async function getUserByEmail(email) {
  const connection = await mysql.createConnection(config.db);
  
  // Parameterized query
  const [rows] = await connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  await connection.end();
  return rows[0];
}

// With ORM (e.g., Sequelize)
async function getUserSafe(email) {
  return await User.findOne({
    where: { email } // ORM handles escaping
  });
}

// BAD - String interpolation (SQL INJECTION RISK)
async function getUserUnsafe(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  // Attacker can input: ' OR '1'='1
  const [rows] = await connection.query(query);
  return rows[0];
}
```

### XSS Prevention
```javascript
// GOOD - Sanitize user input before rendering
import DOMPurify from 'dompurify';

function renderUserComment(comment) {
  const sanitized = DOMPurify.sanitize(comment);
  document.getElementById('comment').innerHTML = sanitized;
}

// Use textContent for plain text
function renderUsername(username) {
  document.getElementById('username').textContent = username;
}

// Escape in templates
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// BAD - Direct HTML insertion
function renderUserCommentUnsafe(comment) {
  document.getElementById('comment').innerHTML = comment;
  // Attacker can inject: <script>alert('XSS')</script>
}
```

### Input Validation
```javascript
// GOOD - Validate all inputs
import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
});

function validateUserInput(data) {
  const { error, value } = userSchema.validate(data);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  return value;
}

// Manual validation example
function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
}

// BAD - No validation
function createUserUnsafe(data) {
  return new User(data); // Accepts anything!
}
```

### Authentication and Secrets
```javascript
// GOOD - Use environment variables for secrets
import dotenv from 'dotenv';
dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET,
  apiKey: process.env.API_KEY,
  dbPassword: process.env.DB_PASSWORD
};

// Validate required secrets at startup
function validateConfig() {
  const required = ['JWT_SECRET', 'API_KEY', 'DB_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

validateConfig();

// Password hashing with bcrypt
import bcrypt from 'bcrypt';

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// BAD - Hardcoded secrets
const JWT_SECRET = 'my-secret-key-123'; // NEVER DO THIS!
const API_KEY = 'sk-1234567890abcdef';
```

### CSRF Protection
```javascript
// GOOD - Implement CSRF tokens
import csrf from 'csurf';
import express from 'express';

const app = express();
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/process', csrfProtection, (req, res) => {
  // Token validated automatically
  res.send('Data processed');
});

// Frontend: Include token in requests
async function submitForm(data) {
  const token = document.querySelector('[name=csrf-token]').content;
  
  const response = await fetch('/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': token
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

### Content Security Policy
```javascript
// GOOD - Set CSP headers
import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.example.com'],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));

// Additional security headers
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));

app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
```

## Error Handling

### Try-Catch with Async/Await
```javascript
// GOOD - Proper error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error.name === 'TypeError') {
      // Network error
      console.error('Network error:', error.message);
      throw new Error('Unable to connect to server');
    }
    
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// BAD - Silent failures
async function fetchUserDataBad(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    return null; // Lost all error context!
  }
}
```

### Custom Error Classes
```javascript
// GOOD - Custom error hierarchy
class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message) {
    super(message, 401);
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

// Usage
function validateUser(data) {
  if (!data.email) {
    throw new ValidationError('Email is required');
  }
  
  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }
}
```

### Error Handling Middleware (Express)
```javascript
// GOOD - Centralized error handling
function errorHandler(err, req, res, next) {
  // Log error
  console.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // Send appropriate response
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err instanceof AuthenticationError) {
    return res.status(err.statusCode).json({
      error: 'Authentication Error',
      message: err.message
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message
  });
}

app.use(errorHandler);
```

### Promise Rejection Handling
```javascript
// GOOD - Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, might want to log and exit
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Use proper error handling in promises
async function main() {
  try {
    await app.listen(3000);
    console.log('Server started on port 3000');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
```

## Testing Standards

### Jest Test Structure
```javascript
// user-service.test.js
import { UserService } from './user-service';
import { ValidationError } from './errors';

describe('UserService', () => {
  let userService;
  let mockDb;
  
  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      insert: jest.fn()
    };
    userService = new UserService(mockDb);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123'
      };
      
      const expectedUser = {
        id: 1,
        ...userData,
        createdAt: expect.any(Date)
      };
      
      mockDb.insert.mockResolvedValue(expectedUser);
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDb.insert).toHaveBeenCalledWith(
        'users',
        expect.objectContaining({
          username: userData.username,
          email: userData.email
        })
      );
    });
    
    it('should throw ValidationError for invalid email', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePass123'
      };
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow(ValidationError);
    });
    
    it('should hash password before storing', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'PlainPassword'
      };
      
      // Act
      await userService.createUser(userData);
      
      // Assert
      const insertCall = mockDb.insert.mock.calls[0][1];
      expect(insertCall.password).not.toBe('PlainPassword');
      expect(insertCall.password).toMatch(/^\$2[aby]\$/); // bcrypt format
    });
  });
  
  describe('authenticate', () => {
    it('should return user on valid credentials', async () => {
      // Test implementation
    });
    
    it('should return null on invalid password', async () => {
      // Test implementation
    });
  });
});

// Test async functions
describe('fetchUserData', () => {
  it('should fetch and return user data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'John' })
      })
    );
    
    const data = await fetchUserData(1);
    
    expect(data).toEqual({ id: 1, name: 'John' });
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});
```

### Test Coverage Requirements
```javascript
// jest.config.js
export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 90,      // 85%/90%/95% by project type
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/index.js'
  ]
};
```

### Mocking Best Practices
```javascript
// GOOD - Mock external dependencies
import axios from 'axios';
jest.mock('axios');

describe('API Service', () => {
  it('should fetch data from external API', async () => {
    const mockData = { id: 1, name: 'Test' };
    axios.get.mockResolvedValue({ data: mockData });
    
    const result = await apiService.fetchData();
    
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.example.com/data',
      expect.objectContaining({
        timeout: 5000
      })
    );
  });
  
  it('should handle API errors', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    
    await expect(apiService.fetchData()).rejects.toThrow('Network error');
  });
});

// Spy on methods
it('should call internal method', () => {
  const spy = jest.spyOn(userService, 'validateUser');
  
  userService.createUser({ username: 'test', email: 'test@example.com' });
  
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
```

## Performance Optimization

### Debouncing and Throttling
```javascript
// GOOD - Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle for scroll/resize events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

window.addEventListener('scroll', throttle(() => {
  updateScrollPosition();
}, 100));
```

### Lazy Loading
```javascript
// GOOD - Dynamic imports for code splitting
async function loadComponent() {
  const { HeavyComponent } = await import('./HeavyComponent.js');
  return new HeavyComponent();
}

// Lazy load routes (React Router example)
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

// Load data on demand
async function loadUserData(userId) {
  if (cache.has(userId)) {
    return cache.get(userId);
  }
  
  const data = await fetchUserData(userId);
  cache.set(userId, data);
  return data;
}
```

### Efficient Array Operations
```javascript
// GOOD - Use appropriate array methods
const numbers = [1, 2, 3, 4, 5];

// Use .find() instead of .filter()[0]
const firstEven = numbers.find(n => n % 2 === 0);

// Use .some() / .every() for boolean checks
const hasEven = numbers.some(n => n % 2 === 0);
const allPositive = numbers.every(n => n > 0);

// BAD - Inefficient patterns
const firstEvenBad = numbers.filter(n => n % 2 === 0)[0]; // Filters all
const hasEvenBad = numbers.filter(n => n % 2 === 0).length > 0; // Filters all
```

### Memory Management
```javascript
// GOOD - Clean up event listeners and timers
class ComponentWithCleanup {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.intervalId = null;
  }
  
  mount() {
    document.addEventListener('click', this.handleClick);
    this.intervalId = setInterval(() => this.update(), 1000);
  }
  
  unmount() {
    document.removeEventListener('click', this.handleClick);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  handleClick(event) {
    // Handle click
  }
  
  update() {
    // Update logic
  }
}

// Use WeakMap for metadata that shouldn't prevent GC
const metadata = new WeakMap();

function setMetadata(obj, data) {
  metadata.set(obj, data);
}
```

## Documentation Standards

### JSDoc Comments
```javascript
/**
 * Calculate the total price for an order
 * @param {OrderItem[]} items - Array of order items
 * @param {string} [discountCode] - Optional discount code
 * @param {number} [taxRate=0.08] - Tax rate as decimal (default 8%)
 * @returns {OrderTotal} Object containing subtotal, tax, discount, and total
 * @throws {ValidationError} If items array is empty
 * @throws {DiscountCodeError} If discount code is invalid
 * @example
 * const items = [{ name: 'Book', price: 10, quantity: 2 }];
 * const total = calculateOrderTotal(items, 'SAVE10');
 * console.log(total.finalAmount); // 19.44
 */
function calculateOrderTotal(items, discountCode, taxRate = 0.08) {
  if (!items || items.length === 0) {
    throw new ValidationError('Order must contain at least one item');
  }
  
  // Implementation
}

/**
 * User repository for database operations
 * @class
 */
class UserRepository {
  /**
   * Create a new UserRepository
   * @param {Object} dbConnection - Database connection object
   * @param {boolean} [cacheEnabled=true] - Enable result caching
   */
  constructor(dbConnection, cacheEnabled = true) {
    this.db = dbConnection;
    this.cacheEnabled = cacheEnabled;
  }
  
  /**
   * Find user by email address
   * @async
   * @param {string} email - User email address
   * @returns {Promise<User|null>} User object or null if not found
   */
  async findByEmail(email) {
    // Implementation
  }
}

/**
 * @typedef {Object} OrderItem
 * @property {string} name - Item name
 * @property {number} price - Item price
 * @property {number} quantity - Item quantity
 */

/**
 * @typedef {Object} OrderTotal
 * @property {number} subtotal - Subtotal before tax and discount
 * @property {number} tax - Tax amount
 * @property {number} discount - Discount amount
 * @property {number} finalAmount - Final total amount
 */
```

## ESLint Configuration

### .eslintrc.json
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:security/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "jest",
    "security",
    "jsdoc"
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": "error",
    "no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "never"],
    "object-shorthand": ["error", "always"],
    "prefer-template": "error",
    "prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }],
    "no-param-reassign": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "max-len": ["warn", { "code": 100, "ignoreUrls": true }],
    "max-lines-per-function": ["warn", 50],
    "complexity": ["warn", 10],
    "jsdoc/require-description": "warn",
    "jsdoc/require-param-description": "warn",
    "jsdoc/require-returns-description": "warn",
    "security/detect-object-injection": "off"
  }
}
```

### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## CI/CD Integration

### GitHub Actions (.github/workflows/javascript-lint.yml)
```yaml
name: JavaScript Linting and Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Run Prettier check
      run: npm run format:check
    
    - name: Run tests with coverage
      run: npm test -- --coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
        fail_ci_if_error: true
    
    - name: Security audit
      run: npm audit --audit-level=moderate
```

### Package.json Scripts
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.js\"",
    "format:check": "prettier --check \"**/*.js\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky install"
  }
}
```

### Husky Pre-commit Hook (.husky/pre-commit)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run format:check
npm test
```

## Common Anti-Patterns

### Using var
```javascript
// BAD
var count = 0;
for (var i = 0; i < 10; i++) {
  setTimeout(() => console.log(i), 100);
}

// GOOD
let count = 0;
for (let i = 0; i < 10; i++) {
  setTimeout(() => console.log(i), 100);
}
```

### Modifying Function Parameters
```javascript
// BAD
function addProperty(obj) {
  obj.newProp = 'value';
  return obj;
}

// GOOD
function addProperty(obj) {
  return { ...obj, newProp: 'value' };
}
```

### Callback Hell
```javascript
// BAD
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      console.log(c);
    });
  });
});

// GOOD
async function fetchData() {
  const a = await getData();
  const b = await getMoreData(a);
  const c = await getMoreData(b);
  console.log(c);
}
```

## Code Review Checklist

- [ ] Using const/let, no var
- [ ] Arrow functions for callbacks
- [ ] Async/await instead of callback chains
- [ ] Proper error handling with try/catch
- [ ] Input validation on all external data
- [ ] No hardcoded secrets or API keys
- [ ] Parameterized queries for database access
- [ ] XSS prevention with input sanitization
- [ ] JSDoc comments on public APIs
- [ ] Test coverage meets minimum threshold (85%/90%/95%)
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] No console.log in production code
- [ ] Security audit passes
- [ ] No unused variables or imports

---

**Enforcement:** These rules are automatically enforced through ESLint, Prettier, pre-commit hooks, and CI/CD pipelines. All violations must be resolved before merge.
