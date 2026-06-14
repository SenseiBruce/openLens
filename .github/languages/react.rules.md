# React Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via ESLint and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **React:** >= 18.2.0
- **React DOM:** >= 18.2.0
- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.0.0 (recommended)

### Architecture Philosophy
- Function components with hooks (no class components)
- Unidirectional data flow
- Component composition over inheritance
- Separation of concerns (presentational vs. container components)
- Immutable state updates

---

## 2. Project Structure

### Directory Layout
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── hooks/               # Custom hooks
├── contexts/            # React Context providers
├── services/            # API services
├── utils/               # Utility functions
├── types/               # TypeScript types/interfaces
├── constants/           # Constants and enums
├── styles/              # Global styles
├── assets/              # Static assets
└── __tests__/           # Test files
```

### File Organization
- **One component per file** (exception: small related components)
- **Component file naming:** PascalCase (e.g., `UserProfile.tsx`)
- **Hook file naming:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Test file naming:** `ComponentName.test.tsx`
- **Index files:** Use for clean exports, not re-exporting everything

**RULE:** Co-locate related files (component, styles, tests, types)
```
UserProfile/
├── UserProfile.tsx
├── UserProfile.module.css
├── UserProfile.test.tsx
├── UserProfile.types.ts
└── index.ts
```

---

## 3. Naming Conventions

### Components
```typescript
// ✅ GOOD - PascalCase for components
export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ❌ BAD - lowercase or camelCase
export const userProfileCard = () => {};
```

### Hooks
```typescript
// ✅ GOOD - camelCase with 'use' prefix
export const useUserData = (userId: string) => {
  const [data, setData] = useState<User | null>(null);
  return { data, setData };
};

// ❌ BAD - missing 'use' prefix
export const getUserData = () => {};
```

### Props and State
```typescript
// ✅ GOOD - Descriptive, camelCase
interface ButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  ariaLabel: string;
}

// ❌ BAD - abbreviations, unclear naming
interface BtnProps {
  clk: () => void;
  dis: boolean;
}
```

### Event Handlers
```typescript
// ✅ GOOD - handle* prefix for handlers
const handleSubmit = (e: React.FormEvent) => {};
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

// ❌ BAD - inconsistent naming
const submit = () => {};
const onInputChange = () => {};
```

---

## 4. Component Patterns

### Function Components (Mandatory)
```typescript
// ✅ GOOD - Function component with TypeScript
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      {onEdit && <button onClick={() => onEdit(user.id)}>Edit</button>}
    </div>
  );
};

// ❌ BAD - Class component (forbidden)
class UserCard extends React.Component {
  render() {
    return <div>...</div>;
  }
}
```

### Component Composition
```typescript
// ✅ GOOD - Composition pattern
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, title }) => (
  <div className="card">
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

// Usage
<Card title="User Info">
  <UserDetails user={user} />
  <UserActions user={user} />
</Card>

// ❌ BAD - Prop drilling multiple levels
<Card user={user} showActions={true} onEdit={handleEdit} />
```

### Presentational vs. Container Components
```typescript
// ✅ GOOD - Presentational component (pure)
interface UserListProps {
  users: User[];
  onUserClick: (id: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => (
  <ul>
    {users.map(user => (
      <li key={user.id} onClick={() => onUserClick(user.id)}>
        {user.name}
      </li>
    ))}
  </ul>
);

// ✅ GOOD - Container component (logic)
export const UserListContainer: React.FC = () => {
  const { users, loading } = useUsers();
  const navigate = useNavigate();

  const handleUserClick = (id: string) => {
    navigate(`/users/${id}`);
  };

  if (loading) return <Spinner />;
  return <UserList users={users} onUserClick={handleUserClick} />;
};
```

---

## 5. Hooks Best Practices

### Custom Hooks
```typescript
// ✅ GOOD - Custom hook with proper cleanup
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

// ❌ BAD - Missing cleanup
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    window.addEventListener('resize', () => setSize(...));
    // Missing cleanup!
  }, []);
  return size;
};
```

### useState
```typescript
// ✅ GOOD - Proper state initialization
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState(0);

// ✅ GOOD - Functional updates for dependent state
const incrementCount = () => setCount(prev => prev + 1);

// ❌ BAD - Direct state mutation
const updateUser = () => {
  user.name = 'New Name'; // NEVER mutate state directly
  setUser(user);
};
```

### useEffect
```typescript
// ✅ GOOD - Proper dependencies, cleanup
useEffect(() => {
  const controller = new AbortController();
  
  fetchUser(userId, controller.signal)
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    });

  return () => controller.abort();
}, [userId]);

// ❌ BAD - Missing dependencies (ESLint error)
useEffect(() => {
  fetchUser(userId).then(setUser);
}, []); // userId should be in dependency array
```

### useMemo and useCallback
```typescript
// ✅ GOOD - Memoize expensive computations
const expensiveValue = useMemo(() => {
  return users.filter(u => u.age > 18).sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// ✅ GOOD - Memoize callbacks passed to child components
const handleUserUpdate = useCallback((id: string, data: Partial<User>) => {
  updateUser(id, data);
}, [updateUser]);

// ❌ BAD - Unnecessary memoization
const name = useMemo(() => user.name, [user]); // Simple access doesn't need memo
```

---

## 6. State Management

### Local State (useState)
```typescript
// ✅ GOOD - Local UI state
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input 
        type={showPassword ? 'text' : 'password'} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
    </form>
  );
};
```

### Context API
```typescript
// ✅ GOOD - Context with proper typing
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### State Management Libraries (Optional)
- **Redux Toolkit:** For complex global state
- **Zustand:** Lightweight alternative
- **Jotai/Recoil:** Atomic state management

**RULE:** Use Context API for simple global state. Use Redux Toolkit for complex apps with multiple domains.

---

## 7. Routing

### React Router (v6+)
```typescript
// ✅ GOOD - Route configuration
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

// ✅ GOOD - Protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};
```

---

## 8. API Integration

### Fetch Wrapper
```typescript
// ✅ GOOD - Centralized API service
class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL;

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
}

export const apiService = new ApiService();
```

### Data Fetching Hook
```typescript
// ✅ GOOD - Reusable fetch hook
export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    apiService.get<T>(url)
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
};
```

### React Query (Recommended)
```typescript
// ✅ GOOD - React Query for server state
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.get<User[]>('/users'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; updates: Partial<User> }) =>
      apiService.put(`/users/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

---

## 9. Security Patterns

### XSS Prevention
```typescript
// ✅ GOOD - React auto-escapes by default
<div>{user.name}</div>

// ⚠️ DANGEROUS - Only use when absolutely necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// ✅ GOOD - Sanitize user input
import DOMPurify from 'dompurify';
const sanitizedHtml = DOMPurify.sanitize(userInput);
```

### Environment Variables
```typescript
// ✅ GOOD - Use REACT_APP_ prefix (Create React App)
const apiUrl = process.env.REACT_APP_API_URL;

// ✅ GOOD - Use VITE_ prefix (Vite)
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ BAD - Never commit secrets to code
const apiKey = 'sk-1234567890abcdef'; // NEVER DO THIS
```

### CSRF Protection
```typescript
// ✅ GOOD - Include CSRF token in requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

---

## 10. Testing Standards

### Unit Testing with React Testing Library
```typescript
// ✅ GOOD - Test user behavior, not implementation
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('should call onSubmit with email and password', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});

// ❌ BAD - Testing implementation details
expect(wrapper.find('.email-input').props().value).toBe('test@example.com');
```

### Testing Hooks
```typescript
// ✅ GOOD - Test custom hooks with renderHook
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Mocking API Calls
```typescript
// ✅ GOOD - Mock Service Worker (MSW)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', name: 'John' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 11. Performance Optimization

### Code Splitting
```typescript
// ✅ GOOD - Lazy load routes
import { lazy, Suspense } from 'react';

const UserPage = lazy(() => import('./pages/UserPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export const App = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/users" element={<UserPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </Suspense>
);
```

### React.memo
```typescript
// ✅ GOOD - Memoize expensive components
interface UserCardProps {
  user: User;
}

export const UserCard = React.memo<UserCardProps>(({ user }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// Custom comparison function
export const UserCard = React.memo(
  ({ user }) => <div>{user.name}</div>,
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
```

### Virtual Lists
```typescript
// ✅ GOOD - Use react-window for long lists
import { FixedSizeList } from 'react-window';

const Row = ({ index, style, data }) => (
  <div style={style}>{data[index].name}</div>
);

export const UserList = ({ users }) => (
  <FixedSizeList
    height={600}
    itemCount={users.length}
    itemSize={50}
    itemData={users}
  >
    {Row}
  </FixedSizeList>
);
```

---

## 12. Accessibility (WCAG 2.1 AA)

### Semantic HTML
```typescript
// ✅ GOOD - Semantic elements
<button onClick={handleClick}>Submit</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside>...</aside>

// ❌ BAD - Non-semantic elements
<div onClick={handleClick}>Submit</div>
```

### ARIA Attributes
```typescript
// ✅ GOOD - Proper ARIA labels
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  ×
</button>

<input
  type="text"
  aria-describedby="email-help"
  aria-invalid={!!errors.email}
/>
<span id="email-help">Enter your email address</span>
```

### Keyboard Navigation
```typescript
// ✅ GOOD - Keyboard accessible
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
>
  Click me
</div>
```

---

## 13. ESLint Configuration

### .eslintrc.json
```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["react", "react-hooks", "jsx-a11y", "@typescript-eslint"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 14. CI/CD Integration

### GitHub Actions Workflow
```yaml
name: React CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
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
        run: npm test -- --coverage --watchAll=false
      
      - name: Build
        run: npm run build
```

---

## 15. Common Anti-Patterns

### ❌ Don't Modify State Directly
```typescript
// ❌ BAD
const addUser = () => {
  users.push(newUser);
  setUsers(users);
};

// ✅ GOOD
const addUser = () => {
  setUsers([...users, newUser]);
};
```

### ❌ Don't Use Index as Key
```typescript
// ❌ BAD
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ GOOD
{items.map(item => <Item key={item.id} {...item} />)}
```

### ❌ Don't Call Hooks Conditionally
```typescript
// ❌ BAD
if (condition) {
  useEffect(() => {}, []);
}

// ✅ GOOD
useEffect(() => {
  if (condition) {
    // logic here
  }
}, [condition]);
```

### ❌ Don't Create Functions Inside Render
```typescript
// ❌ BAD - Creates new function on every render
<Child onUpdate={(data) => updateData(data)} />

// ✅ GOOD - Memoized callback
const handleUpdate = useCallback((data) => updateData(data), [updateData]);
<Child onUpdate={handleUpdate} />
```

---

## 16. TypeScript Best Practices

### Prop Types
```typescript
// ✅ GOOD - Explicit prop types
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'medium',
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## Enforcement Checklist

- [ ] ESLint with React plugins configured
- [ ] TypeScript strict mode enabled
- [ ] Pre-commit hooks (husky + lint-staged)
- [ ] CI/CD pipeline runs linting and tests
- [ ] Code review checklist includes React best practices
- [ ] React Testing Library for all component tests
- [ ] Accessibility audits with axe-core
- [ ] Bundle size monitoring

---

**End of React Rules Document**
