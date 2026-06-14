# React Native Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via ESLint and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **React Native:** >= 0.73.0
- **React:** >= 18.2.0
- **TypeScript:** >= 5.0.0 (recommended)
- **Node.js:** >= 18.0.0

### Architecture Philosophy
- Cross-platform mobile development
- Native performance
- Platform-specific code when needed
- Hot reload for fast development
- Shared business logic, platform-specific UI

---

## 2. Project Structure

### Directory Layout
```
project_name/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── types.ts
│   │   └── providers/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── screens/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   └── home/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── Button.test.tsx
│   │   │   └── Input/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── types/
│   ├── services/
│   │   ├── api/
│   │   ├── storage/
│   │   └── notifications/
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── __tests__/
├── android/
├── ios/
├── .eslintrc.js
├── tsconfig.json
└── package.json
```

---

## 3. Naming Conventions

### Files and Components
```typescript
// ✅ GOOD - PascalCase for components, camelCase for utilities
LoginScreen.tsx → LoginScreen
Button.tsx → Button
apiService.ts → apiService
useAuth.ts → useAuth hook

// ❌ BAD
login-screen.tsx
button.tsx
APIService.ts
use-auth.ts
```

### Platform-Specific Files
```typescript
// ✅ GOOD - Platform extensions
Button.ios.tsx
Button.android.tsx
Button.native.tsx
styles.ios.ts
styles.android.ts

// Usage - automatically selected by platform
import Button from './Button';  // Resolves to .ios.tsx or .android.tsx
```

---

## 4. Component Patterns

### Function Components with TypeScript
```typescript
// ✅ GOOD - FC with proper typing
import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  testID?: string;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#8E8E93',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// ❌ BAD - No types, inline styles
export const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={{ padding: 12, backgroundColor: 'blue' }}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Screen Components
```typescript
// ✅ GOOD - Screen with navigation typing
import React, { FC, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

export const UserListScreen: FC<Props> = ({ navigation, route }) => {
  const { users, isLoading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserDetail', { userId });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserCard user={item} onPress={() => handleUserPress(item.id)} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### Custom Hooks
```typescript
// ✅ GOOD - Reusable hook with types
import { useState, useEffect } from 'react';
import { User } from '@/shared/types';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, error, fetchUsers, refreshUsers };
};
```

---

## 5. State Management

### Redux Toolkit (Recommended)
```typescript
// ✅ GOOD - Redux Toolkit slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/shared/types';
import { RootState } from '../store';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    const response = await apiService.getUser(userId);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { logout, updateUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export default userSlice.reducer;

// Store configuration
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Usage in component
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchUser, selectUser } from '@/store/slices/userSlice';

export const UserProfile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchUser('123'));
  }, []);

  return <Text>{user?.name}</Text>;
};
```

### Context API (Simple State)
```typescript
// ✅ GOOD - Context for theme
import React, { createContext, useContext, useState, FC, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Usage
const App = () => {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
};
```

---

## 6. Navigation

### React Navigation (Recommended)
```typescript
// ✅ GOOD - Typed navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  UserDetail: { userId: string };
  Settings: { section?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="UserDetail" 
          component={UserDetailScreen}
          options={{ title: 'User Details' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Usage in component
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (userId: string) => {
    navigation.navigate('UserDetail', { userId });
  };

  return <Button title="View User" onPress={() => handlePress('123')} />;
};
```

---

## 7. Styling

### StyleSheet (Recommended)
```typescript
// ✅ GOOD - StyleSheet with responsive design
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000000',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,  // Android
  },
  responsive: {
    width: width * 0.9,
    height: height * 0.3,
  },
});

// ❌ BAD - Inline styles
<View style={{ flex: 1, padding: 16, backgroundColor: '#FFF' }}>
  <Text style={{ fontSize: 24, fontWeight: '700' }}>Title</Text>
</View>
```

### Styled Components (Alternative)
```typescript
// ✅ GOOD - Styled components
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const Card = styled.View`
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.card};
`;
```

---

## 8. Platform-Specific Code

### Platform Module
```typescript
// ✅ GOOD - Platform-specific code
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  text: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
});

// Platform-specific imports
import DeviceInfo from 'react-native-device-info';

if (Platform.OS === 'ios') {
  // iOS-specific code
} else {
  // Android-specific code
}
```

---

## 9. Performance Optimization

### Memoization
```typescript
// ✅ GOOD - Memoize expensive components
import React, { FC, memo } from 'react';

interface UserCardProps {
  user: User;
  onPress: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = memo(
  ({ user, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(user.id)}>
        <Text>{user.name}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### FlatList Optimization
```typescript
// ✅ GOOD - Optimized FlatList
<FlatList
  data={users}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <UserCard user={item} />}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### Image Optimization
```typescript
// ✅ GOOD - Optimized image loading
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: user.avatar,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 100, height: 100 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

---

## 10. Testing

### Component Tests
```typescript
// ✅ GOOD - Component test with React Native Testing Library
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button title="Click Me" onPress={() => {}} disabled testID="button" />
    );
    
    const button = getByTestId('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
```

### Hook Tests
```typescript
// ✅ GOOD - Hook test
import { renderHook, act } from '@testing-library/react-hooks';
import { useUsers } from './useUsers';

jest.mock('@/services/api/apiService');

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const mockUsers = [{ id: '1', name: 'John' }];
    (apiService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { result, waitForNextUpdate } = renderHook(() => useUsers());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

---

## 11. Linting Configuration

### .eslintrc.js
```javascript
module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'warn',
  },
};
```

---

## 12. CI/CD Integration

### GitHub Actions
```yaml
name: React Native CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: cd ios && pod install
      - run: npx react-native build-ios --mode Release

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: npm ci
      - run: cd android && ./gradlew assembleRelease
```

---

## 13. Common Anti-Patterns

### ❌ Avoid These Patterns

```typescript
// ❌ BAD - No TypeScript types
const UserCard = ({ user, onPress }) => { };

// ❌ BAD - Inline styles
<View style={{ flex: 1, padding: 16 }}>

// ❌ BAD - No memoization for expensive renders
const UserList = ({ users }) => {
  return users.map(user => <UserCard user={user} />);
};

// ❌ BAD - Direct state mutation
user.name = 'New Name';  // Use setState or dispatch

// ❌ BAD - Unoptimized images
<Image source={{ uri: largeImageUrl }} />

// ❌ BAD - Missing key in lists
users.map(user => <UserCard user={user} />)

// ✅ GOOD - Proper patterns
interface UserCardProps {
  user: User;
  onPress: (id: string) => void;
}

const styles = StyleSheet.create({ container: { flex: 1 } });

const UserCard = memo<UserCardProps>(({ user, onPress }) => { });

<FlatList
  data={users}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <UserCard user={item} />}
/>
```

---

## Enforcement Checklist

- [ ] TypeScript strict mode enabled
- [ ] ESLint configured and passing
- [ ] Component tests with >80% coverage
- [ ] Platform-specific code properly handled
- [ ] StyleSheet used (no inline styles)
- [ ] Navigation properly typed
- [ ] State management implemented
- [ ] Performance optimizations applied
- [ ] CI/CD pipeline configured

---

**End of React Native Rules Document**
