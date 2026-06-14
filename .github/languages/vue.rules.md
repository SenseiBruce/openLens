# Vue 3 Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via ESLint and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Vue:** >= 3.3.0
- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.0.0 (recommended)
- **Vite:** >= 4.0.0 (build tool)

### Architecture Philosophy
- Composition API preferred over Options API
- Single File Components (SFC)
- Reactive by default
- Progressive framework (use what you need)
- TypeScript-first approach

---

## 2. Project Structure

### Directory Layout
```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── features/       # Feature components
├── composables/        # Composition functions
├── views/              # Page/route components
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript types
├── directives/         # Custom directives
├── plugins/            # Vue plugins
├── assets/             # Static assets
└── __tests__/          # Test files
```

### File Organization
- **Component naming:** PascalCase (e.g., `UserProfile.vue`)
- **Composable naming:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Store naming:** camelCase with `Store` suffix (e.g., `userStore.ts`)
- **Test files:** `ComponentName.spec.ts`

**RULE:** One component per file, co-locate tests

---

## 3. Naming Conventions

### Components
```vue
<!-- ✅ GOOD - Multi-word component names -->
<template>
  <UserProfileCard :user="user" />
</template>

<script setup lang="ts">
// Component file: UserProfileCard.vue
</script>

<!-- ❌ BAD - Single word component name -->
<!-- User.vue, Card.vue -->
```

### Props and Events
```vue
<script setup lang="ts">
// ✅ GOOD - camelCase in script, kebab-case in template
interface Props {
  userId: string;
  isActive: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'user-selected': [userId: string];
}>();

// ❌ BAD - inconsistent naming
interface Props {
  user_id: string; // snake_case
  IsActive: boolean; // PascalCase
}
</script>

<template>
  <!-- ✅ GOOD - kebab-case in template -->
  <UserCard :user-id="userId" :is-active="isActive" />
</template>
```

### Composables
```typescript
// ✅ GOOD - use* prefix, descriptive name
export function useUserData(userId: Ref<string>) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  
  return { user, loading };
}

// ❌ BAD - no prefix, unclear
export function getUserData() {}
export function user() {}
```

---

## 4. Component Patterns

### Composition API (Mandatory)
```vue
<script setup lang="ts">
// ✅ GOOD - Composition API with TypeScript
import { ref, computed, onMounted } from 'vue';

interface Props {
  userId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'user-loaded': [user: User];
}>();

const user = ref<User | null>(null);
const loading = ref(false);

const fullName = computed(() => 
  user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
);

onMounted(async () => {
  loading.value = true;
  user.value = await fetchUser(props.userId);
  loading.value = false;
  emit('user-loaded', user.value);
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="user">
    <h2>{{ fullName }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>
```

### Options API (Deprecated)
```vue
<!-- ❌ BAD - Options API (forbidden in new code) -->
<script lang="ts">
export default {
  data() {
    return {
      user: null,
    };
  },
  computed: {
    fullName() {
      return this.user.name;
    },
  },
};
</script>
```

### Component Communication
```vue
<!-- ✅ GOOD - Props down, events up -->
<!-- Parent.vue -->
<script setup lang="ts">
const selectedUserId = ref<string | null>(null);

const handleUserSelect = (userId: string) => {
  selectedUserId.value = userId;
};
</script>

<template>
  <UserList @user-selected="handleUserSelect" />
  <UserDetails v-if="selectedUserId" :user-id="selectedUserId" />
</template>

<!-- UserList.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'user-selected': [userId: string];
}>();

const selectUser = (userId: string) => {
  emit('user-selected', userId);
};
</script>
```

### v-model Pattern
```vue
<!-- ✅ GOOD - Custom v-model -->
<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<!-- Usage -->
<CustomInput v-model="username" />
```

---

## 5. Composition API & Composables

### Reactive State
```typescript
// ✅ GOOD - Proper reactive state
import { ref, reactive, computed } from 'vue';

// Use ref for primitives
const count = ref(0);
const name = ref('');

// Use reactive for objects
const user = reactive({
  id: '',
  name: '',
  email: '',
});

// Computed properties
const doubleCount = computed(() => count.value * 2);

// ❌ BAD - Plain variables (not reactive)
let count = 0; // Won't trigger reactivity
```

### Composable Pattern
```typescript
// ✅ GOOD - Reusable composable
// composables/useAsync.ts
export function useAsync<T>(asyncFn: () => Promise<T>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const execute = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      data.value = await asyncFn();
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, execute };
}

// Usage in component
const { data: users, loading, execute: fetchUsers } = useAsync(() => 
  apiService.getUsers()
);

onMounted(() => fetchUsers());
```

### Lifecycle Hooks
```vue
<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue';

// ✅ GOOD - Proper lifecycle usage
onBeforeMount(() => {
  console.log('Component about to mount');
});

onMounted(() => {
  // DOM is ready, can access refs
  document.addEventListener('click', handleClick);
});

onUpdated(() => {
  // Component re-rendered
});

onUnmounted(() => {
  // Cleanup
  document.removeEventListener('click', handleClick);
});
</script>
```

---

## 6. State Management (Pinia)

### Store Definition
```typescript
// ✅ GOOD - Pinia store with TypeScript
// stores/userStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);

  // Getters
  const isAuthenticated = computed(() => currentUser.value !== null);
  const userCount = computed(() => users.value.length);

  // Actions
  async function login(email: string, password: string) {
    const user = await authService.login(email, password);
    currentUser.value = user;
  }

  function logout() {
    currentUser.value = null;
  }

  async function fetchUsers() {
    users.value = await apiService.getUsers();
  }

  return {
    // State
    currentUser,
    users,
    // Getters
    isAuthenticated,
    userCount,
    // Actions
    login,
    logout,
    fetchUsers,
  };
});

// Usage in component
const userStore = useUserStore();
const { currentUser, isAuthenticated } = storeToRefs(userStore);
userStore.login(email, password);
```

### Store Composition
```typescript
// ✅ GOOD - Composing stores
export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore();
  const items = ref<CartItem[]>([]);

  const total = computed(() => {
    if (!userStore.isAuthenticated) return 0;
    return items.value.reduce((sum, item) => sum + item.price, 0);
  });

  return { items, total };
});
```

---

## 7. Routing (Vue Router)

### Route Configuration
```typescript
// ✅ GOOD - Typed routes
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/views/UserDetailPage.vue'),
    props: true, // Pass route params as props
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
```

### Programmatic Navigation
```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ✅ GOOD - Type-safe navigation
const navigateToUser = (userId: string) => {
  router.push({ name: 'user-detail', params: { id: userId } });
};

// Get route params
const userId = computed(() => route.params.id as string);
</script>
```

---

## 8. API Integration

### API Service
```typescript
// ✅ GOOD - Centralized API service
// services/api.ts
import axios, { type AxiosInstance } from 'axios';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    return this.client.get<T>(url).then((res) => res as unknown as T);
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    return this.client.post<T>(url, data).then((res) => res as unknown as T);
  }
}

export const apiService = new ApiService();
```

### Data Fetching Composable
```typescript
// ✅ GOOD - Composable for API calls
// composables/useApi.ts
export function useApi<T>(endpoint: string, options = {}) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      data.value = await apiService.get<T>(endpoint);
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  watchEffect(() => {
    fetchData();
  });

  return { data, error, loading, refetch: fetchData };
}

// Usage
const { data: users, loading, error } = useApi<User[]>('/users');
```

---

## 9. Security Patterns

### XSS Prevention
```vue
<!-- ✅ GOOD - Vue auto-escapes by default -->
<template>
  <div>{{ userInput }}</div>
</template>

<!-- ⚠️ DANGEROUS - Use with caution -->
<template>
  <div v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';

const sanitizedHtml = computed(() => DOMPurify.sanitize(rawHtml.value));
</script>
```

### Environment Variables
```typescript
// ✅ GOOD - Vite environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// ❌ BAD - Hardcoded secrets
const apiKey = 'sk-1234567890'; // NEVER
```

### CSRF Protection
```typescript
// ✅ GOOD - Include CSRF token
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
```

---

## 10. Testing Standards

### Component Testing (Vitest + Vue Test Utils)
```typescript
// ✅ GOOD - Test component behavior
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserCard from '@/components/UserCard.vue';

describe('UserCard', () => {
  it('should render user information', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const wrapper = mount(UserCard, {
      props: { user },
    });

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('john@example.com');
  });

  it('should emit edit event when button clicked', async () => {
    const user = { id: '1', name: 'John Doe' };
    const wrapper = mount(UserCard, {
      props: { user },
    });

    await wrapper.find('button').trigger('click');
    
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual(['1']);
  });
});
```

### Testing Composables
```typescript
// ✅ GOOD - Test composables
import { describe, it, expect } from 'vitest';
import { useCounter } from '@/composables/useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { count, increment } = useCounter(0);
    
    expect(count.value).toBe(0);
    increment();
    expect(count.value).toBe(1);
  });
});
```

### Testing Stores
```typescript
// ✅ GOOD - Test Pinia stores
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should login user', async () => {
    const store = useUserStore();
    
    await store.login('test@example.com', 'password');
    
    expect(store.isAuthenticated).toBe(true);
    expect(store.currentUser).toBeTruthy();
  });
});
```

---

## 11. Performance Optimization

### Lazy Loading
```vue
<!-- ✅ GOOD - Lazy load components -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
);
</script>

<template>
  <Suspense>
    <HeavyComponent />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### Computed Caching
```vue
<script setup lang="ts">
// ✅ GOOD - Computed properties are cached
const filteredUsers = computed(() => 
  users.value.filter(u => u.age > 18)
);

// ❌ BAD - Method called on every render
const getFilteredUsers = () => users.value.filter(u => u.age > 18);
</script>
```

### v-once and v-memo
```vue
<!-- ✅ GOOD - Static content -->
<template>
  <div v-once>{{ staticContent }}</div>
</template>

<!-- ✅ GOOD - Memoize based on dependencies -->
<template>
  <div v-memo="[user.id, user.name]">
    <UserCard :user="user" />
  </div>
</template>
```

### Virtual Scrolling
```vue
<!-- ✅ GOOD - Virtual scroll for large lists -->
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core';

const { list, containerProps, wrapperProps } = useVirtualList(users, {
  itemHeight: 50,
});
</script>

<template>
  <div v-bind="containerProps" style="height: 400px">
    <div v-bind="wrapperProps">
      <div v-for="{ data, index } in list" :key="index">
        {{ data.name }}
      </div>
    </div>
  </div>
</template>
```

---

## 12. Accessibility (WCAG 2.1 AA)

### Semantic HTML
```vue
<!-- ✅ GOOD - Semantic elements -->
<template>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
  
  <main>
    <h1>Page Title</h1>
  </main>
  
  <button @click="submit">Submit</button>
</template>

<!-- ❌ BAD - Non-semantic -->
<template>
  <div @click="navigate">Home</div>
</template>
```

### ARIA Attributes
```vue
<template>
  <button
    :aria-pressed="isPressed"
    :aria-label="closeLabel"
    @click="handleClick"
  >
    Close
  </button>
  
  <input
    v-model="email"
    aria-describedby="email-help"
    :aria-invalid="!!errors.email"
  />
  <span id="email-help">Enter your email</span>
</template>
```

### Focus Management
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement>();

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" type="text" />
</template>
```

---

## 13. ESLint Configuration

### .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['vue', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
```

---

## 14. CI/CD Integration

### GitHub Actions
```yaml
name: Vue CI

on: [push, pull_request]

jobs:
  test:
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
        run: npm run test:unit
      
      - name: Build
        run: npm run build
```

---

## 15. Common Anti-Patterns

### ❌ Don't Mutate Props
```vue
<script setup lang="ts">
interface Props {
  user: User;
}

const props = defineProps<Props>();

// ❌ BAD - Mutating props
const updateUser = () => {
  props.user.name = 'New Name'; // FORBIDDEN
};

// ✅ GOOD - Emit event to parent
const emit = defineEmits<{ 'update:user': [user: User] }>();

const updateUser = () => {
  emit('update:user', { ...props.user, name: 'New Name' });
};
</script>
```

### ❌ Don't Use Array Index as Key
```vue
<!-- ❌ BAD -->
<template>
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
  </div>
</template>

<!-- ✅ GOOD -->
<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### ❌ Don't Access Refs in Setup
```vue
<script setup lang="ts">
const inputRef = ref<HTMLInputElement>();

// ❌ BAD - Ref not available yet
inputRef.value?.focus(); // undefined

// ✅ GOOD - Use onMounted
onMounted(() => {
  inputRef.value?.focus();
});
</script>
```

---

## Enforcement Checklist

- [ ] ESLint with Vue 3 plugins configured
- [ ] TypeScript strict mode enabled
- [ ] Vite configured with proper plugins
- [ ] Pre-commit hooks (husky + lint-staged)
- [ ] CI/CD pipeline runs linting and tests
- [ ] Component tests with Vue Test Utils
- [ ] Accessibility audits with axe-core
- [ ] Bundle size monitoring

---

**End of Vue 3 Rules Document**
