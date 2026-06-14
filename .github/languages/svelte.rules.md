# Svelte Development Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09

## Table of Contents
- [Coding Standards](#coding-standards)
- [Best Practices](#best-practices)
- [Security Patterns](#security-patterns)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Linting and Formatting](#linting-and-formatting)
- [Common Pitfalls](#common-pitfalls)

## Coding Standards

### Component Structure

```svelte
<!-- MyComponent.svelte -->
<script>
  // 1. Imports
  import { onMount, onDestroy } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import ChildComponent from './ChildComponent.svelte';
  
  // 2. Props
  export let title = '';
  export let items = [];
  export let callback = () => {};
  
  // 3. Local state
  let count = 0;
  let isLoading = false;
  
  // 4. Reactive declarations
  $: doubleCount = count * 2;
  $: hasItems = items.length > 0;
  $: if (count > 10) {
    console.log('Count exceeded 10');
  }
  
  // 5. Functions
  function increment() {
    count += 1;
    callback(count);
  }
  
  async function fetchData() {
    isLoading = true;
    try {
      const response = await fetch('/api/data');
      items = await response.json();
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      isLoading = false;
    }
  }
  
  // 6. Lifecycle hooks
  onMount(() => {
    fetchData();
    
    return () => {
      // Cleanup
    };
  });
  
  onDestroy(() => {
    // Cleanup logic
  });
</script>

<!-- 7. Template -->
<div class="container">
  <h1>{title}</h1>
  <p>Count: {count}</p>
  <p>Double: {doubleCount}</p>
  
  <button on:click={increment}>
    Increment
  </button>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else if hasItems}
    <ul>
      {#each items as item (item.id)}
        <li>{item.name}</li>
      {/each}
    </ul>
  {:else}
    <p>No items found</p>
  {/if}
  
  <ChildComponent />
</div>

<!-- 8. Styles (scoped by default) -->
<style>
  .container {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  h1 {
    color: #333;
    font-size: 2rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0052a3;
  }
</style>
```

### TypeScript Support

```typescript
// MyComponent.svelte with TypeScript
<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import ChildComponent from './ChildComponent.svelte';
  
  // Type-safe props
  export let name: string;
  export let age: number = 0;
  export let onUpdate: (value: string) => void = () => {};
  
  // Interface for data
  interface User {
    id: string;
    name: string;
    email: string;
  }
  
  let users: User[] = [];
  
  // Generic function
  function processItems<T>(items: T[]): T[] {
    return items.filter(item => item !== null);
  }
  
  // Type-safe reactive statement
  $: nameLength = name.length as number;
</script>

<div>
  <h1>{name} ({age})</h1>
  {#each users as user (user.id)}
    <div>{user.name}</div>
  {/each}
</div>
```

## Best Practices

### Reactivity

```svelte
<script>
  // Reactive declarations run automatically when dependencies change
  let count = 0;
  let doubled = 0;
  
  // Good: Use $: for derived values
  $: doubled = count * 2;
  
  // Bad: Manual updates
  function increment() {
    count += 1;
    doubled = count * 2; // Redundant
  }
  
  // Reactive statements for side effects
  $: console.log(`Count is now ${count}`);
  
  // Reactive blocks
  $: {
    console.log(`Count: ${count}`);
    console.log(`Doubled: ${doubled}`);
  }
  
  // Array/Object reactivity
  let items = [1, 2, 3];
  
  // Bad: Mutation doesn't trigger reactivity
  function addBad() {
    items.push(4); // Won't update UI
  }
  
  // Good: Reassignment triggers reactivity
  function addGood() {
    items = [...items, 4];
  }
  
  // Or use assignment
  function addAlternative() {
    items.push(4);
    items = items; // Trigger reactivity
  }
  
  // Object updates
  let user = { name: 'Alice', age: 30 };
  
  function updateUser() {
    user = { ...user, age: 31 }; // Triggers reactivity
  }
</script>
```

### Stores

```typescript
// stores.ts
import { writable, readable, derived, get } from 'svelte/store';

// Writable store
export const count = writable(0);

// With initial value and start/stop logic
export const time = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return () => clearInterval(interval);
});

// Derived store
export const doubled = derived(count, $count => $count * 2);

// Multiple sources
export const sum = derived(
  [count, doubled],
  ([$count, $doubled]) => $count + $doubled
);

// Custom store with methods
function createCounter() {
  const { subscribe, set, update } = writable(0);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(0)
  };
}

export const counter = createCounter();

// Using stores in components
</script>

<script>
  import { count, counter } from './stores';
  
  // Auto-subscription with $
  // (automatically unsubscribes on component destroy)
</script>

<div>
  <p>Count: {$count}</p>
  <p>Counter: {$counter}</p>
  
  <button on:click={() => count.update(n => n + 1)}>
    Increment count
  </button>
  
  <button on:click={counter.increment}>
    Increment counter
  </button>
</div>

// Manual subscription (remember to unsubscribe!)
<script>
  import { onDestroy } from 'svelte';
  import { count } from './stores';
  
  let value;
  const unsubscribe = count.subscribe(val => {
    value = val;
  });
  
  onDestroy(unsubscribe);
</script>
```

### Component Communication

```svelte
<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
  
  let childMessage = '';
  
  function handleMessage(event) {
    childMessage = event.detail.message;
  }
</script>

<Child on:message={handleMessage} />
<p>Child said: {childMessage}</p>

<!-- Child.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function sendMessage() {
    dispatch('message', {
      message: 'Hello from child!'
    });
  }
</script>

<button on:click={sendMessage}>
  Send Message
</button>

<!-- Event forwarding -->
<!-- Wrapper.svelte -->
<script>
  import Button from './Button.svelte';
</script>

<!-- Forward click event -->
<Button on:click />

<!-- Context API for deep prop passing -->
<!-- Parent.svelte -->
<script>
  import { setContext } from 'svelte';
  
  setContext('api', {
    fetchData: async (endpoint) => {
      return fetch(endpoint).then(r => r.json());
    }
  });
</script>

<!-- Child.svelte (any depth) -->
<script>
  import { getContext } from 'svelte';
  
  const api = getContext('api');
  
  async function loadData() {
    const data = await api.fetchData('/api/users');
  }
</script>
```

### Slots

```svelte
<!-- Card.svelte -->
<div class="card">
  <header>
    <slot name="header">
      <!-- Default header content -->
      <h2>Default Title</h2>
    </slot>
  </header>
  
  <main>
    <slot>
      <!-- Default content -->
      <p>Default content</p>
    </slot>
  </main>
  
  <footer>
    <slot name="footer" />
  </footer>
</div>

<!-- Usage -->
<Card>
  <h1 slot="header">Custom Title</h1>
  <p>Custom content</p>
  <div slot="footer">
    <button>Action</button>
  </div>
</Card>

<!-- Slot props -->
<!-- List.svelte -->
<script>
  export let items = [];
</script>

<ul>
  {#each items as item (item.id)}
    <li>
      <slot item={item}>
        {item.name}
      </slot>
    </li>
  {/each}
</ul>

<!-- Usage with slot props -->
<List items={users} let:item>
  <strong>{item.name}</strong> ({item.email})
</List>
```

## Security Patterns

### XSS Prevention

```svelte
<script>
  let userInput = '';
  let trustedHTML = '';
  
  // Svelte automatically escapes content
  // This is safe - HTML entities are escaped
</script>

<div>{userInput}</div>

<!-- To render HTML (use with extreme caution) -->
<!-- Only use with trusted, sanitized content -->
<div>{@html trustedHTML}</div>

<!-- Better: Sanitize with DOMPurify -->
<script>
  import DOMPurify from 'isomorphic-dompurify';
  
  export let htmlContent = '';
  
  $: sanitized = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
</script>

<div>{@html sanitized}</div>
```

### Secure Forms

```svelte
<script>
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let csrfToken = '';
  
  onMount(() => {
    // Get CSRF token from meta tag
    csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
  });
  
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateEmail(email)) {
      alert('Invalid email');
      return;
    }
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      // Handle success
    } catch (error) {
      console.error('Login error:', error);
    }
  }
</script>

<form on:submit={handleSubmit}>
  <input
    type="email"
    bind:value={email}
    required
    autocomplete="email"
  />
  <input
    type="password"
    bind:value={password}
    required
    minlength="8"
    autocomplete="current-password"
  />
  <button type="submit">Login</button>
</form>
```

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/tests/']
    }
  }
});
```

### Testing with Testing Library

```typescript
// Button.test.ts
import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with label', () => {
    render(Button, { props: { label: 'Click me' } });
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(Button, { props: { onClick } });
    
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(Button, { props: { disabled: true } });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});

// Testing stores
import { get } from 'svelte/store';
import { counter } from './stores';

describe('counter store', () => {
  it('initializes with 0', () => {
    expect(get(counter)).toBe(0);
  });
  
  it('increments', () => {
    counter.increment();
    expect(get(counter)).toBe(1);
  });
  
  it('resets', () => {
    counter.increment();
    counter.increment();
    counter.reset();
    expect(get(counter)).toBe(0);
  });
});
```

## Performance Optimization

### Keyed Each Blocks

```svelte
<script>
  let items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' }
  ];
  
  function shuffle() {
    items = items.sort(() => Math.random() - 0.5);
  }
</script>

<!-- Bad: Without key -->
{#each items as item}
  <div>{item.name}</div>
{/each}

<!-- Good: With key for optimal DOM updates -->
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}

<!-- Destructuring with key -->
{#each items as { id, name } (id)}
  <div>{name}</div>
{/each}
```

### Lazy Loading Components

```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyComponent;
  let showHeavy = false;
  
  async function loadHeavyComponent() {
    const module = await import('./HeavyComponent.svelte');
    HeavyComponent = module.default;
    showHeavy = true;
  }
</script>

<button on:click={loadHeavyComponent}>
  Load Heavy Component
</button>

{#if showHeavy && HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

### Avoid Unnecessary Reactivity

```svelte
<script>
  let count = 0;
  let expensiveResult;
  
  // Bad: Runs on every count change
  $: expensiveResult = expensiveComputation(count);
  
  // Good: Only compute when needed
  function updateResult() {
    expensiveResult = expensiveComputation(count);
  }
  
  // Or use derived with conditions
  $: if (count % 10 === 0) {
    expensiveResult = expensiveComputation(count);
  }
</script>
```

## Linting and Formatting

### ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      rules: {
        'svelte/no-at-html-tags': 'error',
        'svelte/no-unused-svelte-ignore': 'warn',
        'svelte/valid-compile': 'error'
      }
    }
  ]
};
```

### Prettier Configuration

```javascript
// .prettierrc
{
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

## Common Pitfalls

### Reactivity Gotchas

```svelte
<script>
  // Array mutations don't trigger reactivity
  let items = [1, 2, 3];
  
  // Bad
  items.push(4); // UI won't update
  items[0] = 10; // UI won't update
  
  // Good
  items = [...items, 4];
  items = [10, ...items.slice(1)];
  
  // Object mutations
  let user = { name: 'Alice', age: 30 };
  
  // Bad
  user.age = 31; // UI won't update
  
  // Good
  user = { ...user, age: 31 };
</script>
```

### Binding Pitfalls

```svelte
<script>
  let value = '';
  
  // Be careful with two-way binding
  // Changes to value update the input
  // Changes to input update value
</script>

<!-- Can cause issues with controlled inputs -->
<input bind:value on:input={(e) => {
  // This conflicts with bind:value
  value = e.target.value.toUpperCase();
}} />

<!-- Better: Choose one approach -->
<input
  value={value}
  on:input={(e) => {
    value = e.target.value.toUpperCase();
  }}
/>
```

### Event Modifiers

```svelte
<script>
  function handleClick() {
    console.log('Clicked');
  }
</script>

<!-- Event modifiers -->
<button on:click|preventDefault={handleClick}>
  Submit
</button>

<div on:click|stopPropagation={handleClick}>
  Click (won't bubble)
</div>

<button on:click|once={handleClick}>
  Click once
</button>

<!-- Chain modifiers -->
<button on:click|preventDefault|stopPropagation={handleClick}>
  Submit
</button>
```

---

**Key Takeaways:**
1. Embrace Svelte's reactivity with `$:` declarations
2. Use keyed each blocks for lists
3. Leverage stores for shared state
4. Components are scoped by default (CSS and logic)
5. Use event dispatchers for parent-child communication
6. Remember: reassignment triggers reactivity, mutation doesn't
7. Sanitize HTML before using `{@html}`
8. Test with Vitest and Testing Library
9. Lazy load heavy components
10. Configure ESLint with svelte plugin
