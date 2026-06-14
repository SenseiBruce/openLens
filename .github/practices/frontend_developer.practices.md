# Frontend Developer Best Practices

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Role:** Frontend Developer  
**Purpose:** Guidance for modern frontend development, UI/UX implementation, and client-side performance

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Responsive Design](#responsive-design)
5. [Accessibility (WCAG 2.1)](#accessibility-wcag-21)
6. [Performance Optimization](#performance-optimization)
7. [Cross-Browser Compatibility](#cross-browser-compatibility)
8. [API Integration](#api-integration)
9. [Testing Strategies](#testing-strategies)
10. [Quality Standards](#quality-standards)
11. [Integration Points](#integration-points)
12. [Tools & Frameworks](#tools--frameworks)
13. [Project Type Adaptations](#project-type-adaptations)
14. [Self-Assessment Checklist](#self-assessment-checklist)

---

## Core Principles

### 1.1 User-Centric Development
- **Performance first:** Every user interaction should feel instant (< 100ms response)
- **Accessibility by default:** Design for all users, including those with disabilities
- **Mobile-first approach:** Start with mobile constraints, enhance for larger screens
- **Progressive enhancement:** Core functionality works everywhere, enhanced features where supported
- **Resilient applications:** Graceful degradation when features aren't available

### 1.2 Code Quality
- **Component reusability:** Build composable, single-purpose components
- **Maintainability:** Write self-documenting code with clear naming conventions
- **Consistency:** Follow established patterns and style guides
- **Type safety:** Use TypeScript for type checking and better developer experience
- **Clean separation:** Separate concerns (presentation, logic, styling)

### 1.3 Modern Development Practices
- **Build optimization:** Minimize bundle size and optimize load times
- **Developer experience:** Fast build times, hot module replacement, helpful error messages
- **Automated testing:** Comprehensive test coverage for reliability
- **Continuous integration:** Automated linting, testing, and deployment
- **Version control:** Meaningful commits, feature branches, code reviews

---

## Component Architecture

### 2.1 Component Design Patterns

**Atomic Design Methodology:**
```
Atoms → Molecules → Organisms → Templates → Pages

Atoms: Button, Input, Label
Molecules: FormField (Label + Input), SearchBar
Organisms: Header, LoginForm, ProductCard
Templates: PageLayout, DashboardLayout
Pages: HomePage, ProductDetailPage
```

**Component Structure Example (React):**
```tsx
// components/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### 2.2 Component Organization

**Directory Structure:**
```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
├── hooks/
├── utils/
├── services/
├── types/
└── styles/
```

**Best Practices:**
- One component per file
- Co-locate tests, styles, and types with components
- Export from index.ts for clean imports
- Use named exports for better refactoring support

### 2.3 Component Communication

**Props (Parent to Child):**
```tsx
<UserProfile user={currentUser} onEdit={handleEdit} />
```

**Events (Child to Parent):**
```tsx
const handleSubmit = (data: FormData) => {
  onSubmit(data); // Callback to parent
};
```

**Context (Global State):**
```tsx
const { user, setUser } = useAuth();
```

**Custom Hooks (Shared Logic):**
```tsx
const { data, loading, error } = useFetch('/api/users');
```

---

## State Management

### 3.1 State Management Strategies

**Local State (useState):**
```tsx
// For component-specific state
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

**Derived State:**
```tsx
// Compute from existing state, don't duplicate
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

**Global State (Context API):**
```tsx
// contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 3.2 State Management Libraries

**Redux Toolkit (Complex Applications):**
```tsx
// features/user/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    const response = await api.getUser(userId);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

**Zustand (Lightweight Alternative):**
```tsx
import create from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**When to Use What:**
- **useState:** Component-specific, simple state
- **useReducer:** Complex component state with multiple sub-values
- **Context:** Share state across many components (theme, auth)
- **Redux:** Large apps with complex state interactions
- **Zustand/Jotai:** Simpler alternative to Redux

---

## Responsive Design

### 4.1 Mobile-First Approach

**CSS Media Queries:**
```css
/* Mobile first (base styles) */
.container {
  padding: 1rem;
  width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

**Breakpoint Standards:**
```tsx
const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};
```

### 4.2 Responsive Techniques

**Flexible Layouts (Flexbox & Grid):**
```css
/* Flexbox for one-dimensional layouts */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* Grid for two-dimensional layouts */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

**Responsive Typography:**
```css
/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

/* Viewport-based sizing */
body {
  font-size: calc(14px + 0.25vw);
}
```

**Responsive Images:**
```tsx
<picture>
  <source media="(min-width: 1024px)" srcSet="large.jpg" />
  <source media="(min-width: 768px)" srcSet="medium.jpg" />
  <img src="small.jpg" alt="Description" loading="lazy" />
</picture>
```

---

## Accessibility (WCAG 2.1)

### 5.1 WCAG 2.1 Level AA Compliance

**Perceivable:**
- Text alternatives for non-text content
- Captions for audio/video
- Content can be presented in different ways
- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)

**Operable:**
- All functionality available via keyboard
- Users have enough time to read content
- No content causes seizures (flashing < 3 times/second)
- Clear navigation and focus indicators

**Understandable:**
- Text is readable and understandable
- Pages appear and operate predictably
- Help users avoid and correct mistakes

**Robust:**
- Compatible with assistive technologies
- Valid HTML semantics

### 5.2 Semantic HTML

```tsx
// Good: Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

// Bad: Div soup
<div class="nav">
  <div class="nav-item">Home</div>
  <div class="nav-item">About</div>
</div>
```

### 5.3 ARIA Attributes

```tsx
// Buttons
<button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon aria-hidden="true" />
</button>

// Form fields
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && <span id="email-error" role="alert">Invalid email</span>}

// Live regions
<div aria-live="polite" aria-atomic="true">
  {notifications.map(n => <Notification key={n.id} {...n} />)}
</div>

// Modal
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirmation</h2>
  {/* content */}
</div>
```

### 5.4 Keyboard Navigation

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleClose();
      break;
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Click me
</div>
```

### 5.5 Accessibility Testing

**Tools:**
- axe DevTools (Chrome extension)
- WAVE (Web Accessibility Evaluation Tool)
- Lighthouse accessibility audit
- Screen readers (NVDA, JAWS, VoiceOver)

**Checklist:**
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA standards
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] ARIA attributes used correctly
- [ ] Screen reader testing completed

---

## Performance Optimization

### 6.1 Bundle Size Optimization

**Code Splitting:**
```tsx
// Route-based splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Dynamic Imports:**
```tsx
const handleLoadEditor = async () => {
  const { Editor } = await import('./components/Editor');
  setEditorComponent(<Editor />);
};
```

**Tree Shaking:**
```tsx
// Good: Named imports
import { debounce, throttle } from 'lodash-es';

// Bad: Full library import
import _ from 'lodash';
```

### 6.2 Lazy Loading

**Images:**
```tsx
<img src="photo.jpg" loading="lazy" alt="Description" />

// Or with Intersection Observer for more control
const LazyImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImageSrc(src);
        observer.disconnect();
      }
    });
    
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return <img ref={imgRef} src={imageSrc || placeholder} alt={alt} />;
};
```

### 6.3 Rendering Optimization

**Memoization:**
```tsx
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(ExpensiveComponent);

// Memoize computed values
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

**Virtual Scrolling:**
```tsx
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>{items[index]}</div>
    )}
  </FixedSizeList>
);
```

### 6.4 Asset Optimization

**Image Optimization:**
- Use modern formats (WebP, AVIF) with fallbacks
- Compress images (TinyPNG, ImageOptim)
- Serve responsive images (srcset)
- Use CDN for static assets

**Font Optimization:**
```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

/* Font-display for better performance */
@font-face {
  font-family: 'Main Font';
  src: url('/fonts/main.woff2') format('woff2');
  font-display: swap; /* or optional */
}
```

### 6.5 Performance Metrics

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s (good)
- **FID (First Input Delay):** < 100ms (good)
- **CLS (Cumulative Layout Shift):** < 0.1 (good)

**Monitoring:**
```tsx
// Web Vitals library
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

**Performance Budget:**
- JavaScript bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Images: Lazy load, optimize for web
- Total page weight: < 1MB initial load

---

## Cross-Browser Compatibility

### 7.1 Browser Support Matrix

**Minimum Support:**
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- Mobile Safari: iOS 13+
- Chrome Mobile: Android 8+

### 7.2 Feature Detection

```tsx
// Check for features, not browsers
const supportsWebP = () => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

// Use Modernizr for comprehensive detection
if (Modernizr.webp) {
  // Use WebP images
}
```

### 7.3 Polyfills and Fallbacks

```tsx
// Polyfill configuration (browserslist)
// package.json
{
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}

// Core-js for modern JavaScript features
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### 7.4 CSS Prefixing

```css
/* Use autoprefixer in build process */
.box {
  display: flex; /* Autoprefixer handles vendor prefixes */
}

/* Feature queries for graceful degradation */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

### 7.5 Testing Strategy

**Browser Testing Tools:**
- BrowserStack (cross-browser testing)
- LambdaTest (automated testing)
- Local device testing (physical devices)

**Testing Checklist:**
- [ ] Core functionality works in all supported browsers
- [ ] Layout renders correctly across browsers
- [ ] JavaScript features have appropriate fallbacks
- [ ] Forms submit correctly
- [ ] Media plays correctly
- [ ] No console errors in any browser

---

## API Integration

### 8.1 REST API Integration

**Fetch with Error Handling:**
```tsx
const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};
```

**Custom Hook for API Calls:**
```tsx
const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Usage
const { data, loading, error } = useFetch<User[]>('/api/users');
```

### 8.2 GraphQL Integration

```tsx
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

const UserProfile = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  const [updateUser] = useMutation(UPDATE_USER);

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <div>{data.user.name}</div>;
};
```

### 8.3 Request Optimization

**Debouncing Search:**
```tsx
import { debounce } from 'lodash-es';

const SearchInput = () => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        const results = await api.search(searchQuery);
        setResults(results);
      }, 300),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
};
```

**Request Cancellation:**
```tsx
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: abortController.signal,
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    }
  };

  fetchData();

  return () => abortController.abort();
}, []);
```

---

## Testing Strategies

### 9.1 Unit Testing (Jest + React Testing Library)

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 9.2 Integration Testing

```tsx
// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(ctx.json({ id: '1', name: 'John Doe' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays user', async () => {
  render(<UserProfile userId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### 9.3 End-to-End Testing (Cypress)

```tsx
// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('successfully logs in user', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
  });

  it('shows error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrong');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

### 9.4 Visual Regression Testing

```tsx
// Storybook + Chromatic
// Button.stories.tsx
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Secondary = () => <Button variant="secondary">Secondary</Button>;
export const Disabled = () => <Button disabled>Disabled</Button>;
export const Loading = () => <Button loading>Loading</Button>;
```

### 9.5 Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Quality Standards

### 10.1 Code Quality Metrics

**TypeScript Coverage:** 100% (all files in TypeScript)
**Test Coverage:**
- POC: 60%+ overall
- Prototype: 75%+ overall
- MVP: 85%+ overall
- Handover: 95%+ overall

**Bundle Size Limits:**
- Main bundle: < 200KB (gzipped)
- Route chunks: < 100KB each (gzipped)
- Vendor bundle: < 150KB (gzipped)

**Performance Metrics:**
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 90+

### 10.2 Linting Standards

**ESLint Configuration:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "jsx-a11y/anchor-is-valid": "warn"
  }
}
```

### 10.3 Code Review Checklist

- [ ] Component is properly typed with TypeScript
- [ ] Accessibility requirements met (ARIA, keyboard nav)
- [ ] Performance optimized (lazy loading, memoization)
- [ ] Responsive design implemented
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Tests written and passing
- [ ] No console errors or warnings
- [ ] Browser compatibility verified

---

## Integration Points

### 11.1 Integration with Other Roles

**From UX/UI Designer:**
- Design system and component library
- Figma/Sketch designs and specifications
- Design tokens (colors, typography, spacing)
- Interaction patterns and animations
- Accessibility requirements

**To Backend Developer:**
- API requirements and contracts
- Data structure needs
- Authentication/authorization requirements
- Error response handling expectations
- Performance requirements

**To QA/Test Engineer:**
- Component documentation
- Test IDs and selectors
- Edge cases to test
- Browser/device compatibility matrix
- Accessibility testing requirements

**From Technical Architect:**
- Architecture decisions
- Technology stack choices
- Performance requirements
- Security requirements
- Integration patterns

---

## Tools & Frameworks

### 12.1 Recommended Frameworks

**React Ecosystem:**
- React 18+ (UI library)
- Next.js (Full-stack framework)
- Remix (Full-stack framework)
- Vite (Build tool)

**Vue Ecosystem:**
- Vue 3 (UI library)
- Nuxt.js (Full-stack framework)
- Vite (Build tool)

**Angular:**
- Angular 15+ (Full framework)
- Angular CLI (Tooling)

### 12.2 Essential Tools

**Development:**
- TypeScript (Type safety)
- ESLint (Linting)
- Prettier (Code formatting)
- Husky (Git hooks)

**Testing:**
- Jest (Unit testing)
- React Testing Library (Component testing)
- Cypress/Playwright (E2E testing)
- Storybook (Component development)

**State Management:**
- Redux Toolkit (Complex state)
- Zustand (Lightweight state)
- React Query (Server state)

**Styling:**
- Tailwind CSS (Utility-first)
- CSS Modules (Scoped styles)
- Styled Components (CSS-in-JS)
- Sass/SCSS (Preprocessor)

**Performance:**
- Lighthouse (Auditing)
- WebPageTest (Performance testing)
- Bundle Analyzer (Bundle optimization)

---

## Project Type Adaptations

### 13.1 POC (Proof of Concept)

**Focus:**
- Rapid prototyping
- Core functionality only
- Minimal styling
- Skip comprehensive testing

**Deliverables:**
- Basic component structure
- Core user flows functional
- Simple styling
- Basic error handling

**Time Investment:** 15-30 hours

### 13.2 Prototype

**Focus:**
- Polished UI/UX
- Key user flows
- Responsive design
- Basic accessibility

**Deliverables:**
- Component library foundation
- Responsive layouts
- WCAG Level A compliance
- 75%+ test coverage
- Cross-browser basics (Chrome, Safari, Firefox)

**Time Investment:** 60-100 hours

### 13.3 MVP (Minimum Viable Product)

**Focus:**
- Production-ready code
- Full accessibility
- Comprehensive testing
- Performance optimization

**Deliverables:**
- Complete component library
- WCAG 2.1 Level AA compliance
- 85%+ test coverage
- Performance optimized (Lighthouse 90+)
- Cross-browser compatible
- Documentation

**Time Investment:** 150-250 hours

### 13.4 Handover Product

**Focus:**
- Enterprise-grade quality
- Full documentation
- Comprehensive testing
- Long-term maintainability

**Deliverables:**
- All MVP deliverables plus:
- Storybook documentation
- 95%+ test coverage
- Accessibility audit passed
- Performance budget enforced
- Component usage guidelines
- Handover documentation

**Time Investment:** 300-500 hours

---

## Self-Assessment Checklist

### 14.1 Component Quality
- [ ] All components properly typed with TypeScript
- [ ] Components are reusable and composable
- [ ] Single Responsibility Principle followed
- [ ] Props validated and documented
- [ ] Default props provided where appropriate
- [ ] Error boundaries implemented for error handling
- [ ] Components follow team naming conventions

### 14.2 Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible and clear
- [ ] ARIA attributes used correctly
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] All images have meaningful alt text
- [ ] Forms have proper labels and error messages
- [ ] Semantic HTML used throughout
- [ ] Screen reader tested
- [ ] No accessibility violations (axe/WAVE)

### 14.3 Performance
- [ ] Bundle size within limits (< 200KB main)
- [ ] Code splitting implemented for routes
- [ ] Images lazy loaded and optimized
- [ ] Unnecessary re-renders prevented (memo, useMemo)
- [ ] Lighthouse Performance score 90+
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Asset optimization completed (images, fonts)
- [ ] Performance monitoring configured

### 14.4 Responsive Design
- [ ] Mobile-first approach followed
- [ ] All breakpoints tested (mobile, tablet, desktop)
- [ ] Responsive images implemented
- [ ] Touch targets appropriate size (44x44px minimum)
- [ ] Horizontal scrolling avoided
- [ ] Content readable at all screen sizes
- [ ] Layouts adapt gracefully

### 14.5 Testing
- [ ] Unit tests written for all components
- [ ] Integration tests for key flows
- [ ] E2E tests for critical paths
- [ ] Test coverage meets requirements
- [ ] All tests passing
- [ ] Edge cases covered
- [ ] Error states tested
- [ ] Accessibility tests included

### 14.6 Code Quality
- [ ] No ESLint errors or warnings
- [ ] Code formatted with Prettier
- [ ] No console errors in browser
- [ ] Type safety enforced (no 'any' types)
- [ ] Code reviewed by peer
- [ ] DRY principle followed
- [ ] Meaningful variable and function names
- [ ] Comments added for complex logic

### 14.7 Browser Compatibility
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers tested (iOS Safari, Chrome Mobile)
- [ ] Polyfills added where needed
- [ ] Feature detection implemented
- [ ] Graceful degradation for unsupported features
- [ ] No browser-specific bugs

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Agent Orchestration System | Initial best practices document |

---

**Note:** These best practices are for guidance only and are not automatically enforced. Language-specific rules in `.github/languages/` are enforced automatically via linting and CI/CD.
