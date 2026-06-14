# TypeScript Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** TypeScript 5.0+
- **Recommended Version:** TypeScript 5.3+
- **Target:** ES2022+ with appropriate polyfills
- **Philosophy:** Embrace type safety for better developer experience and fewer runtime errors

### Core Principles
- Type everything - avoid `any` unless absolutely necessary
- Use strict mode configuration
- Leverage TypeScript's advanced type features
- Write types that express intent clearly
- Prefer types over interfaces when possible (composition over extension)
- Use generics for reusable, type-safe code

## Naming Conventions

### Variables, Functions, and Methods
```typescript
// GOOD - camelCase
const userName: string = 'John Doe';
let itemCount: number = 0;

function calculateTotalPrice(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const fetchUserData = async (userId: string): Promise<User> => {
  return await api.get(`/users/${userId}`);
};

// BAD - PascalCase or snake_case
const UserName: string = 'John Doe';
const user_name: string = 'John Doe';
```

### Types and Interfaces
```typescript
// GOOD - PascalCase for types and interfaces
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';

interface User {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// Prefer type over interface for object types
type UserProfile = {
  readonly id: string;
  name: string;
  age: number;
  email: string;
};

// Use interface for extensibility
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  username: string;
  email: string;
}
```

### Classes and Enums
```typescript
// GOOD - PascalCase
class UserService {
  private readonly repository: UserRepository;
  
  constructor(repository: UserRepository) {
    this.repository = repository;
  }
  
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ id });
  }
}

enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED'
}

// Prefer const assertion for simple enums
const OrderStatus = {
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED'
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

### Generic Type Parameters
```typescript
// GOOD - Single uppercase letter or descriptive PascalCase
type Container<T> = {
  value: T;
  getValue: () => T;
};

type ApiResponse<TData, TError = Error> = {
  data?: TData;
  error?: TError;
  status: number;
};

// For complex generics, use descriptive names
type Repository<TEntity, TId = string> = {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
};
```

## Code Structure

### Module Organization
```typescript
// user.service.ts

// 1. Type imports
import type { User, CreateUserDto, UpdateUserDto } from './types';
import type { Repository } from '../database';

// 2. Value imports
import { ValidationError, NotFoundError } from '../errors';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { validateEmail } from '../utils/validation';

// 3. Internal types
type UserServiceConfig = {
  maxLoginAttempts: number;
  lockoutDuration: number;
};

// 4. Constants
const DEFAULT_CONFIG: UserServiceConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};

// 5. Main exports
export class UserService {
  constructor(
    private readonly repository: Repository<User>,
    private readonly config: UserServiceConfig = DEFAULT_CONFIG
  ) {}
  
  async createUser(dto: CreateUserDto): Promise<User> {
    // Implementation
  }
}

// 6. Helper functions (not exported)
function validateUserData(data: CreateUserDto): void {
  if (!validateEmail(data.email)) {
    throw new ValidationError('Invalid email format');
  }
}
```

### Strict Type Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    // Module & Import
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    
    // Advanced
    "skipLibCheck": true,
    "exactOptionalPropertyTypes": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

## Type System Patterns

### Avoid Any
```typescript
// BAD - Using any
function processData(data: any): any {
  return data.value;
}

// GOOD - Use unknown for truly unknown types
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String((data as { value: unknown }).value);
  }
  throw new Error('Invalid data format');
}

// GOOD - Use generics for flexibility
function processData<T extends { value: string }>(data: T): string {
  return data.value;
}
```

### Type Guards
```typescript
// GOOD - Type guards for runtime type checking
type User = { type: 'user'; name: string; email: string };
type Admin = { type: 'admin'; name: string; permissions: string[] };
type Account = User | Admin;

function isAdmin(account: Account): account is Admin {
  return account.type === 'admin';
}

function processAccount(account: Account): void {
  if (isAdmin(account)) {
    // TypeScript knows account is Admin here
    console.log(account.permissions);
  } else {
    // TypeScript knows account is User here
    console.log(account.email);
  }
}

// Type guard for null/undefined
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values: (string | null)[] = ['a', null, 'b', undefined];
const definedValues: string[] = values.filter(isDefined);
```

### Discriminated Unions
```typescript
// GOOD - Use discriminated unions for state management
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

### Utility Types
```typescript
// GOOD - Leverage TypeScript utility types
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

// Partial - make all properties optional
type UpdateUserDto = Partial<User>;

// Pick - select specific properties
type UserPublicInfo = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude properties
type UserWithoutPassword = Omit<User, 'password'>;

// Required - make all properties required
type CompleteUser = Required<User>;

// Readonly - make all properties readonly
type ImmutableUser = Readonly<User>;

// Record - create object type with keys
type UserMap = Record<string, User>;

// ReturnType - extract return type
function createUser(name: string): User {
  // Implementation
  return {} as User;
}
type CreatedUser = ReturnType<typeof createUser>; // User

// Parameters - extract parameter types
type CreateUserParams = Parameters<typeof createUser>; // [string]
```

### Mapped Types
```typescript
// GOOD - Create mapped types for transformations
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Usage
type User = {
  id: string;
  profile: {
    name: string;
    age: number;
  };
};

type NullableUser = Nullable<User>;
// { id: string | null; profile: { name: string; age: number } | null; }

type ReadonlyUser = DeepReadonly<User>;
// { readonly id: string; readonly profile: { readonly name: string; readonly age: number } }
```

### Conditional Types
```typescript
// GOOD - Use conditional types for advanced type logic
type NonNullable<T> = T extends null | undefined ? never : T;

type Flatten<T> = T extends Array<infer U> ? U : T;

type ReturnTypeOrVoid<T> = T extends (...args: any[]) => infer R ? R : void;

// Practical example
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

type ExtractData<T> = T extends { data: infer D } ? D : never;

// Usage
type UserResponse = ApiResponse<User>;
type UserData = ExtractData<UserResponse>; // User | null
```

## Security Patterns

### Type-Safe Database Queries
```typescript
// GOOD - Type-safe query builder
type WhereClause<T> = {
  [P in keyof T]?: T[P] | { $eq: T[P] } | { $ne: T[P] } | { $in: T[P][] };
};

interface QueryBuilder<T> {
  where(clause: WhereClause<T>): QueryBuilder<T>;
  select<K extends keyof T>(...fields: K[]): QueryBuilder<Pick<T, K>>;
  execute(): Promise<T[]>;
}

// Usage prevents typos and type errors
const users = await db.users
  .where({ email: 'user@example.com' }) // Type-safe
  .select('id', 'name', 'email') // Autocomplete works
  .execute();

// BAD - String-based queries (SQL injection risk)
const queryBad = `SELECT * FROM users WHERE email = '${email}'`;
```

### Input Validation with Zod
```typescript
// GOOD - Runtime validation with type inference
import { z } from 'zod';

const UserSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)/),
  role: z.enum(['admin', 'user', 'guest']).default('user')
});

type UserInput = z.infer<typeof UserSchema>;

function validateUser(data: unknown): UserInput {
  return UserSchema.parse(data); // Throws if invalid
}

// Safe validation
function createUser(data: unknown): User {
  const validated = validateUser(data);
  // validated is now type-safe UserInput
  return saveUser(validated);
}
```

### Branded Types for Security
```typescript
// GOOD - Branded types prevent mixing incompatible values
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };
type HashedPassword = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  // Validate format
  if (!/^usr_[a-zA-Z0-9]{16}$/.test(id)) {
    throw new Error('Invalid user ID format');
  }
  return id as UserId;
}

function createEmail(email: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase() as Email;
}

function hashPassword(password: string): HashedPassword {
  // Hash implementation
  return 'hashed' as HashedPassword;
}

// Type-safe function signatures
function getUserById(id: UserId): Promise<User> {
  // Implementation
}

// This won't compile - prevents using raw strings
// getUserById('123'); // Error: Type 'string' is not assignable to type 'UserId'

// Must use constructor
const userId = createUserId('usr_1234567890abcdef');
getUserById(userId); // OK
```

### Readonly for Immutability
```typescript
// GOOD - Use readonly to prevent mutations
interface User {
  readonly id: string;
  name: string;
  readonly email: string;
  readonly createdAt: Date;
}

function updateUserName(user: User, newName: string): User {
  // user.id = '123'; // Error: Cannot assign to 'id' because it is a read-only property
  return { ...user, name: newName };
}

// ReadonlyArray prevents mutations
function processItems(items: readonly Item[]): void {
  // items.push(newItem); // Error: Property 'push' does not exist
  const newItems = [...items, newItem]; // OK
}

// Const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} as const;

// config.timeout = 10000; // Error: Cannot assign to 'timeout' because it is a read-only property
```

### Type-Safe Environment Variables
```typescript
// GOOD - Validate environment at startup
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().min(16)
});

type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  try {
    return EnvSchema.parse(process.env);
  } catch (error) {
    console.error('Invalid environment configuration:', error);
    process.exit(1);
  }
}

export const env = loadEnv();

// Usage - fully type-safe
const port = env.PORT; // number
const dbUrl = env.DATABASE_URL; // string
```

## Error Handling

### Type-Safe Error Handling
```typescript
// GOOD - Custom error classes with types
class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

// Type-safe error handling
async function getUser(id: string): Promise<User> {
  const user = await db.users.findById(id);
  if (!user) {
    throw new NotFoundError('User', id);
  }
  return user;
}

// Error boundary
async function handleRequest(req: Request): Promise<Response> {
  try {
    const result = await processRequest(req);
    return { status: 200, data: result };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { status: error.statusCode, error: error.message };
    }
    if (error instanceof NotFoundError) {
      return { status: error.statusCode, error: error.message };
    }
    // Unknown error
    console.error('Unexpected error:', error);
    return { status: 500, error: 'Internal server error' };
  }
}
```

### Result Type Pattern
```typescript
// GOOD - Result type for explicit error handling
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.get(`/users/${id}`);
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// Usage
async function displayUser(id: string): Promise<void> {
  const result = await fetchUser(id);
  
  if (result.ok) {
    console.log(result.value.name); // Type-safe access
  } else {
    console.error(result.error.message);
  }
}
```

### Exhaustive Type Checking
```typescript
// GOOD - Ensure all cases are handled
type Status = 'pending' | 'processing' | 'completed' | 'failed';

function processStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting to start';
    case 'processing':
      return 'In progress';
    case 'completed':
      return 'Done';
    case 'failed':
      return 'Error occurred';
    default:
      // This will cause a compile error if a new status is added
      const exhaustiveCheck: never = status;
      throw new Error(`Unhandled status: ${exhaustiveCheck}`);
  }
}
```

## Testing Standards

### Type-Safe Tests with Jest
```typescript
// user.service.test.ts
import { UserService } from './user.service';
import type { User, CreateUserDto } from './types';
import { ValidationError } from '../errors';

// Mock types
type MockRepository = {
  findOne: jest.Mock<Promise<User | null>, [{ id: string }]>;
  save: jest.Mock<Promise<User>, [User]>;
};

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockRepository;
  
  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn()
    };
    userService = new UserService(mockRepository as any);
  });
  
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const dto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123'
      };
      
      const expectedUser: User = {
        id: 'usr_1234567890abcdef',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRepository.save.mockResolvedValue(expectedUser);
      
      // Act
      const result = await userService.createUser(dto);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: dto.username,
          email: dto.email
        })
      );
    });
    
    it('should throw ValidationError for invalid email', async () => {
      const dto: CreateUserDto = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePass123'
      };
      
      await expect(userService.createUser(dto))
        .rejects
        .toThrow(ValidationError);
    });
  });
});
```

### Type Coverage Requirements
```typescript
// type-coverage.json
{
  "atLeast": 95,
  "ignoreCatch": false,
  "strict": true,
  "ignoreFiles": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/migrations/**"
  ]
}
```

### Generic Test Utilities
```typescript
// test-utils.ts
export function createMock<T>(): jest.Mocked<T> {
  return {} as jest.Mocked<T>;
}

export function mockAsync<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

export function mockAsyncError(error: Error): Promise<never> {
  return Promise.reject(error);
}

// Type-safe test data builders
export class UserBuilder {
  private user: Partial<User> = {};
  
  withId(id: string): this {
    this.user.id = id;
    return this;
  }
  
  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }
  
  build(): User {
    return {
      id: this.user.id ?? 'usr_default',
      username: this.user.username ?? 'testuser',
      email: this.user.email ?? 'test@example.com',
      createdAt: this.user.createdAt ?? new Date(),
      updatedAt: this.user.updatedAt ?? new Date()
    };
  }
}

// Usage in tests
const user = new UserBuilder()
  .withId('usr_123')
  .withEmail('custom@example.com')
  .build();
```

## Performance Optimization

### Type-Efficient Code
```typescript
// GOOD - Use const for type narrowing
const config = {
  url: 'https://api.example.com',
  timeout: 5000
} as const; // Type: { readonly url: "https://api.example.com"; readonly timeout: 5000 }

// Avoid excessive type assertions
// BAD
const value = data as SomeType as AnotherType as FinalType;

// GOOD
function isFinalType(value: unknown): value is FinalType {
  // Proper type checking
  return typeof value === 'object' && value !== null && 'property' in value;
}

if (isFinalType(data)) {
  // data is FinalType here
}
```

### Lazy Loading with Types
```typescript
// GOOD - Dynamic imports with types
async function loadModule(): Promise<typeof import('./heavy-module')> {
  return await import('./heavy-module');
}

// Usage
async function useHeavyFeature(): Promise<void> {
  const module = await loadModule();
  module.doSomething();
}
```

## Documentation Standards

### TSDoc Comments
```typescript
/**
 * Calculate the total price for an order
 * 
 * @param items - Array of order items
 * @param discountCode - Optional discount code to apply
 * @param taxRate - Tax rate as a decimal (default: 0.08)
 * @returns Order total with breakdown
 * @throws {@link ValidationError} If items array is empty
 * @throws {@link DiscountCodeError} If discount code is invalid
 * 
 * @example
 * ```typescript
 * const items: OrderItem[] = [
 *   { name: 'Book', price: 10, quantity: 2 }
 * ];
 * const total = calculateOrderTotal(items, 'SAVE10');
 * console.log(total.finalAmount); // 19.44
 * ```
 * 
 * @see {@link OrderItem} for item structure
 * @see {@link OrderTotal} for return type details
 */
function calculateOrderTotal(
  items: OrderItem[],
  discountCode?: string,
  taxRate: number = 0.08
): OrderTotal {
  // Implementation
}

/**
 * User repository for database operations
 * 
 * @typeParam T - Entity type
 * @typeParam TId - ID type (default: string)
 */
class Repository<T, TId = string> {
  /**
   * Find entity by ID
   * 
   * @param id - Entity identifier
   * @returns Entity or null if not found
   */
  async findById(id: TId): Promise<T | null> {
    // Implementation
  }
}
```

## TypeScript ESLint Configuration

### .eslintrc.json
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true
    }],
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-imports": ["error", {
      "prefer": "type-imports"
    }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      {
        "selector": "enumMember",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

## CI/CD Integration

### GitHub Actions (.github/workflows/typescript-lint.yml)
```yaml
name: TypeScript Linting and Tests

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
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript compiler
      run: npm run type-check
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Check type coverage
      run: npx type-coverage --at-least 95
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
```

## Common Anti-Patterns

### Using any
```typescript
// BAD
function process(data: any): any {
  return data.value;
}

// GOOD
function process<T extends { value: string }>(data: T): string {
  return data.value;
}
```

### Type Assertions Over Guards
```typescript
// BAD
const user = data as User;

// GOOD
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  // data is User
}
```

## Code Review Checklist

- [ ] No `any` types (use `unknown` instead)
- [ ] All functions have explicit return types
- [ ] Strict mode enabled in tsconfig.json
- [ ] Type guards for runtime validation
- [ ] Branded types for domain IDs
- [ ] Readonly for immutable data
- [ ] No type assertions without validation
- [ ] Generic types properly constrained
- [ ] Error types properly defined
- [ ] TSDoc comments on public APIs
- [ ] Type coverage >= 95%
- [ ] ESLint passes with no errors
- [ ] All tests pass with type safety

---

**Enforcement:** These rules are automatically enforced through TypeScript compiler, ESLint, type-coverage checks, and CI/CD pipelines. All violations must be resolved before merge.
