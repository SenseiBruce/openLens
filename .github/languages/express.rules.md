# Express.js Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via ESLint and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Express:** >= 4.18.0
- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.0.0 (recommended)

### Architecture Philosophy
- Minimalist web framework
- Middleware-based architecture
- Unopinionated and flexible
- Explicit routing
- Error handling through middleware

---

## 2. Project Structure

### Directory Layout
```
project-name/
├── src/
│   ├── index.ts              # Application entry point
│   ├── app.ts                # Express app configuration
│   ├── config/               # Configuration files
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   └── env.ts
│   ├── routes/               # Route definitions
│   │   ├── index.ts
│   │   ├── users.ts
│   │   └── products.ts
│   ├── controllers/          # Request handlers
│   │   ├── user.controller.ts
│   │   └── product.controller.ts
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   └── product.service.ts
│   ├── models/               # Data models (Mongoose/Sequelize)
│   │   ├── user.model.ts
│   │   └── product.model.ts
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   └── response.ts
│   ├── types/                # TypeScript types
│   │   └── express.d.ts
│   └── validators/           # Input validation schemas
│       ├── user.validator.ts
│       └── product.validator.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── .env.example
├── .eslintrc.json
├── tsconfig.json
└── package.json
```

---

## 3. Naming Conventions

### Files and Modules
```typescript
// ✅ GOOD - kebab-case for files
user.controller.ts
auth.middleware.ts
database.config.ts

// ❌ BAD
UserController.ts
authMiddleware.ts
```

### Classes and Functions
```typescript
// ✅ GOOD - PascalCase for classes, camelCase for functions
class UserService {
  async getUserById(id: string): Promise<User> { }
}

export const createUser = async (req: Request, res: Response) => { };

// ❌ BAD
class user_service { }
export const CreateUser = () => { };
```

---

## 4. Application Setup

### App Configuration
```typescript
// ✅ GOOD - src/app.ts
import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import routes from './routes';
import { logger } from './utils/logger';
import { config } from './config/env';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));

  // API routes
  app.use('/api/v1', routes);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
  });

  // Error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

// ❌ BAD - Everything in one file, no structure
const app = express();
app.use(express.json());
app.get('/users', (req, res) => { });  // Routes mixed with setup
```

### Server Entry Point
```typescript
// ✅ GOOD - src/index.ts
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { config } from './config/env';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

---

## 5. Routing Patterns

### Router Setup
```typescript
// ✅ GOOD - src/routes/index.ts
import { Router } from 'express';
import userRoutes from './users';
import productRoutes from './products';
import authRoutes from './auth';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);

export default router;

// ✅ GOOD - src/routes/users.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { userValidator } from '../validators/user.validator';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  userController.getUsers
);

router.get(
  '/:id',
  authenticate,
  userController.getUserById
);

router.post(
  '/',
  authenticate,
  validate(userValidator.create),
  userController.createUser
);

router.put(
  '/:id',
  authenticate,
  validate(userValidator.update),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  userController.deleteUser
);

export default router;
```

---

## 6. Controller Pattern

### Controller Implementation
```typescript
// ✅ GOOD - src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/response';
import { AppError } from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';

const userService = new UserService();

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getUsers(page, limit);

    ApiResponse.success(res, result, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    ApiResponse.success(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;

    const user = await userService.createUser(userData);

    ApiResponse.created(res, user, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await userService.updateUser(id, updates);

    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    ApiResponse.success(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
};

// ❌ BAD - No error handling, direct DB access
export const getUsers = (req, res) => {
  User.find({}, (err, users) => {  // Callback style, no async/await
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json(users);  // No consistent response format
  });
};
```

---

## 7. Service Layer

### Service Implementation
```typescript
// ✅ GOOD - src/services/user.service.ts
import { User, IUser } from '../models/user.model';
import { AppError } from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class UserService {
  async getUsers(page: number, limit: number): Promise<PaginatedResult<IUser>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).select('-password');
    return user;
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already exists', StatusCodes.CONFLICT);
    }

    // Hash password
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const user = await User.create(userData);
    
    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject as IUser;
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    // Don't allow password updates through this method
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
  }

  async authenticate(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
    }

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject as IUser;
  }
}
```

---

## 8. Middleware Patterns

### Authentication Middleware
```typescript
// ✅ GOOD - src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config/env';
import { User } from '../models/user.model';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', StatusCodes.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized', StatusCodes.FORBIDDEN);
    }

    next();
  };
};
```

### Error Middleware
```typescript
// ✅ GOOD - src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: 'Duplicate field value',
    });
    return;
  }

  // Default error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    ...(config.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    StatusCodes.NOT_FOUND
  );
  next(error);
};
```

### Validation Middleware
```typescript
// ✅ GOOD - src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
```

---

## 9. Validation Schemas

### Zod Validation
```typescript
// ✅ GOOD - src/validators/user.validator.ts
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'Password must contain uppercase, lowercase, and number');

export const userValidator = {
  create: z.object({
    body: z.object({
      email: emailSchema,
      username: z.string().min(3).max(50),
      password: passwordSchema,
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
    }),
  }),

  update: z.object({
    body: z.object({
      email: emailSchema.optional(),
      username: z.string().min(3).max(50).optional(),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
    }),
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    }),
  }),
};
```

---

## 10. Security Patterns

### Rate Limiting
```typescript
// ✅ GOOD - Rate limiting middleware
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Too many login attempts, please try again later',
});

// Usage
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### Input Sanitization
```typescript
// ✅ GOOD - Sanitize user input
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';

app.use(mongoSanitize());  // Prevent NoSQL injection
app.use(xss());  // Prevent XSS attacks
```

---

## 11. Testing Standards

### Unit Tests
```typescript
// ✅ GOOD - tests/unit/services/user.service.test.ts
import { UserService } from '../../../src/services/user.service';
import { User } from '../../../src/models/user.model';
import { AppError } from '../../../src/utils/app-error';

jest.mock('../../../src/models/user.model');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        username: 'testuser',
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.getUserById('123');

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('123');
    });

    it('should return null when user not found', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const result = await userService.getUserById('123');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should throw error if email exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      await expect(
        userService.createUser({ email: 'test@example.com' })
      ).rejects.toThrow(AppError);
    });
  });
});
```

### Integration Tests
```typescript
// ✅ GOOD - tests/integration/user.test.ts
import request from 'supertest';
import { createApp } from '../../src/app';
import { connectDatabase, closeDatabase } from '../../src/config/database';

describe('User API', () => {
  let app: Express;

  beforeAll(async () => {
    await connectDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/v1/users', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/v1/users');
      
      expect(response.status).toBe(401);
    });

    it('should return users with valid token', async () => {
      const token = 'valid-jwt-token';
      
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe(userData.email);
    });
  });
});
```

---

## 12. Linting Configuration

### .eslintrc.json
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "node"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "node/no-missing-import": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

---

## 13. CI/CD Integration

### GitHub Actions
```yaml
name: Express CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm test -- --coverage
        env:
          MONGODB_URI: mongodb://localhost:27017/test
      
      - name: Build
        run: npm run build
```

---

## Enforcement Checklist

- [ ] TypeScript configured
- [ ] Layered architecture (routes → controllers → services)
- [ ] Middleware for auth, validation, errors
- [ ] Input validation with Zod
- [ ] Error handling middleware
- [ ] Security headers (helmet)
- [ ] Rate limiting
- [ ] ESLint configured
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

---

**End of Express.js Rules Document**
