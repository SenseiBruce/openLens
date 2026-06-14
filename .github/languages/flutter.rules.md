# Flutter Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via Dart Analyzer and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Flutter:** >= 3.16.0
- **Dart:** >= 3.2.0

### Architecture Philosophy
- Widget-based UI
- Reactive programming (Streams, State Management)
- Platform-specific adaptations
- Hot reload for fast development
- Material Design & Cupertino (iOS) widgets

---

## 2. Project Structure

### Directory Layout
```
project_name/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── network/
│   │   ├── theme/
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── models/
│   │   │   │   ├── repositories/
│   │   │   │   └── datasources/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── pages/
│   │   │       ├── widgets/
│   │   │       └── providers/
│   │   └── home/
│   └── shared/
│       ├── widgets/
│       ├── extensions/
│       └── mixins/
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── analysis_options.yaml
└── pubspec.yaml
```

---

## 3. Naming Conventions

### Files and Classes
```dart
// ✅ GOOD - snake_case for files, PascalCase for classes
user_profile_page.dart → UserProfilePage
auth_repository.dart → AuthRepository
custom_button.dart → CustomButton

// ❌ BAD
UserProfilePage.dart
authRepository.dart
```

### Variables and Functions
```dart
// ✅ GOOD - camelCase
String userName = 'John';
int itemCount = 10;

void getUserById(String id) { }
Future<User> fetchUserData() async { }

// ❌ BAD
String UserName = 'John';  // PascalCase
String user_name = 'John';  // snake_case
```

### Constants
```dart
// ✅ GOOD - lowerCamelCase
const int maxRetries = 3;
const String apiBaseUrl = 'https://api.example.com';

// ❌ BAD
const int MAX_RETRIES = 3;  // SCREAMING_SNAKE_CASE (only for enums)
```

---

## 4. Widget Patterns

### Stateless Widget
```dart
// ✅ GOOD - Stateless widget for static UI
class UserCard extends StatelessWidget {
  const UserCard({
    super.key,
    required this.user,
    this.onTap,
  });

  final User user;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(user.avatar),
        ),
        title: Text(user.name),
        subtitle: Text(user.email),
        onTap: onTap,
      ),
    );
  }
}

// ❌ BAD - StatefulWidget for static content
class UserCard extends StatefulWidget { }  // Unnecessary
```

### Stateful Widget
```dart
// ✅ GOOD - Stateful widget for interactive UI
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  void dispose() {
    // Clean up resources
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

### Widget Composition
```dart
// ✅ GOOD - Extract widgets for reusability
class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            _EmailField(),
            SizedBox(height: 16),
            _PasswordField(),
            SizedBox(height: 24),
            _LoginButton(),
          ],
        ),
      ),
    );
  }
}

class _EmailField extends StatelessWidget {
  const _EmailField();

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: const InputDecoration(
        labelText: 'Email',
        prefixIcon: Icon(Icons.email),
      ),
      keyboardType: TextInputType.emailAddress,
    );
  }
}

// ❌ BAD - Everything in one widget
Widget build(BuildContext context) {
  return Column(
    children: [
      TextFormField(...),  // Inline, not reusable
      TextFormField(...),
      ElevatedButton(...),
    ],
  );
}
```

---

## 5. State Management

### Provider Pattern (Recommended)
```dart
// ✅ GOOD - ChangeNotifier for state management
import 'package:flutter/foundation.dart';

class UserProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchUser(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await userRepository.getUserById(id);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}

// Usage in main.dart
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

// Usage in widget
class UserProfilePage extends StatelessWidget {
  const UserProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        if (userProvider.isLoading) {
          return const CircularProgressIndicator();
        }

        if (userProvider.error != null) {
          return Text('Error: ${userProvider.error}');
        }

        final user = userProvider.user;
        if (user == null) {
          return const Text('No user data');
        }

        return Text(user.name);
      },
    );
  }
}
```

### Riverpod (Alternative)
```dart
// ✅ GOOD - Riverpod for dependency injection
import 'package:flutter_riverpod/flutter_riverpod.dart';

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepositoryImpl();
});

final userProvider = FutureProvider.family<User, String>((ref, userId) async {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUserById(userId);
});

// Usage
class UserProfilePage extends ConsumerWidget {
  const UserProfilePage({super.key, required this.userId});

  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncUser = ref.watch(userProvider(userId));

    return asyncUser.when(
      data: (user) => Text(user.name),
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

### Bloc Pattern
```dart
// ✅ GOOD - BLoC for complex state management
import 'package:flutter_bloc/flutter_bloc.dart';

// Events
abstract class UserEvent {}
class FetchUser extends UserEvent {
  final String userId;
  FetchUser(this.userId);
}

// States
abstract class UserState {}
class UserInitial extends UserState {}
class UserLoading extends UserState {}
class UserLoaded extends UserState {
  final User user;
  UserLoaded(this.user);
}
class UserError extends UserState {
  final String message;
  UserError(this.message);
}

// Bloc
class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepository repository;

  UserBloc(this.repository) : super(UserInitial()) {
    on<FetchUser>(_onFetchUser);
  }

  Future<void> _onFetchUser(
    FetchUser event,
    Emitter<UserState> emit,
  ) async {
    emit(UserLoading());
    try {
      final user = await repository.getUserById(event.userId);
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}

// Usage
class UserProfilePage extends StatelessWidget {
  const UserProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserBloc, UserState>(
      builder: (context, state) {
        if (state is UserLoading) {
          return const CircularProgressIndicator();
        } else if (state is UserLoaded) {
          return Text(state.user.name);
        } else if (state is UserError) {
          return Text('Error: ${state.message}');
        }
        return const SizedBox();
      },
    );
  }
}
```

---

## 6. Data Layer

### Model Definition
```dart
// ✅ GOOD - Immutable models with copyWith
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String email,
    required String name,
    String? avatar,
    @Default(false) bool isActive,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

// Without Freezed (manual)
class User {
  const User({
    required this.id,
    required this.email,
    required this.name,
    this.avatar,
    this.isActive = false,
  });

  final String id;
  final String email;
  final String name;
  final String? avatar;
  final bool isActive;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      avatar: json['avatar'] as String?,
      isActive: json['isActive'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'avatar': avatar,
      'isActive': isActive,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    String? avatar,
    bool? isActive,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      avatar: avatar ?? this.avatar,
      isActive: isActive ?? this.isActive,
    );
  }
}
```

### Repository Pattern
```dart
// ✅ GOOD - Repository abstraction
abstract class UserRepository {
  Future<User> getUserById(String id);
  Future<List<User>> getUsers();
  Future<User> createUser(User user);
  Future<void> deleteUser(String id);
}

class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  final UserRemoteDataSource remoteDataSource;
  final UserLocalDataSource localDataSource;

  @override
  Future<User> getUserById(String id) async {
    try {
      // Try remote first
      final user = await remoteDataSource.getUserById(id);
      // Cache locally
      await localDataSource.cacheUser(user);
      return user;
    } catch (e) {
      // Fallback to cache
      return localDataSource.getUserById(id);
    }
  }

  @override
  Future<List<User>> getUsers() async {
    return remoteDataSource.getUsers();
  }
}
```

### API Service
```dart
// ✅ GOOD - HTTP client with Dio
import 'package:dio/dio.dart';

class ApiService {
  ApiService({required this.dio}) {
    dio.options.baseUrl = 'https://api.example.com';
    dio.options.connectTimeout = const Duration(seconds: 5);
    dio.options.receiveTimeout = const Duration(seconds: 3);
    
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          options.headers['Authorization'] = 'Bearer $token';
          return handler.next(options);
        },
        onError: (error, handler) {
          // Handle errors
          return handler.next(error);
        },
      ),
    );
  }

  final Dio dio;

  Future<User> getUser(String id) async {
    try {
      final response = await dio.get('/users/$id');
      return User.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException('Connection timeout');
      case DioExceptionType.badResponse:
        return ServerException('Server error: ${error.response?.statusCode}');
      default:
        return NetworkException('Network error');
    }
  }
}
```

---

## 7. Navigation

### Named Routes
```dart
// ✅ GOOD - Named routes with arguments
class AppRoutes {
  static const String home = '/';
  static const String login = '/login';
  static const String userDetail = '/user/:id';
  static const String settings = '/settings';
}

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginPage());
      
      case AppRoutes.userDetail:
        final userId = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => UserDetailPage(userId: userId),
        );
      
      default:
        return MaterialPageRoute(
          builder: (_) => const NotFoundPage(),
        );
    }
  }
}

// Usage
Navigator.pushNamed(context, AppRoutes.userDetail, arguments: userId);
```

### GoRouter (Recommended)
```dart
// ✅ GOOD - Declarative routing with go_router
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/users/:id',
      builder: (context, state) {
        final userId = state.pathParameters['id']!;
        return UserDetailPage(userId: userId);
      },
    ),
  ],
  errorBuilder: (context, state) => const NotFoundPage(),
);

// Usage
context.go('/users/123');
context.push('/settings');
```

---

## 8. Testing Standards

### Unit Tests
```dart
// ✅ GOOD - Unit test with mocks
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

@GenerateMocks([UserRepository])
void main() {
  late UserProvider userProvider;
  late MockUserRepository mockRepository;

  setUp(() {
    mockRepository = MockUserRepository();
    userProvider = UserProvider(repository: mockRepository);
  });

  group('UserProvider', () {
    test('fetchUser sets user when successful', () async {
      final user = User(id: '1', email: 'test@example.com', name: 'Test');
      when(mockRepository.getUserById('1'))
          .thenAnswer((_) async => user);

      await userProvider.fetchUser('1');

      expect(userProvider.user, user);
      expect(userProvider.isLoading, false);
      expect(userProvider.error, null);
    });

    test('fetchUser sets error when failed', () async {
      when(mockRepository.getUserById('1'))
          .thenThrow(Exception('Network error'));

      await userProvider.fetchUser('1');

      expect(userProvider.user, null);
      expect(userProvider.error, isNotNull);
    });
  });
}
```

### Widget Tests
```dart
// ✅ GOOD - Widget test
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('UserCard displays user information', (tester) async {
    final user = User(id: '1', email: 'test@example.com', name: 'John Doe');

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: UserCard(user: user),
        ),
      ),
    );

    expect(find.text('John Doe'), findsOneWidget);
    expect(find.text('test@example.com'), findsOneWidget);
  });

  testWidgets('UserCard calls onTap when tapped', (tester) async {
    var tapped = false;
    final user = User(id: '1', email: 'test@example.com', name: 'John');

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: UserCard(
            user: user,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    await tester.tap(find.byType(UserCard));
    expect(tapped, true);
  });
}
```

### Integration Tests
```dart
// ✅ GOOD - Integration test
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('end-to-end test', () {
    testWidgets('login flow', (tester) async {
      await tester.pumpWidget(const MyApp());

      // Enter email
      await tester.enterText(
        find.byKey(const Key('emailField')),
        'test@example.com',
      );

      // Enter password
      await tester.enterText(
        find.byKey(const Key('passwordField')),
        'password123',
      );

      // Tap login button
      await tester.tap(find.byKey(const Key('loginButton')));
      await tester.pumpAndSettle();

      // Verify navigation to home
      expect(find.byType(HomePage), findsOneWidget);
    });
  });
}
```

---

## 9. Performance Optimization

### Const Constructors
```dart
// ✅ GOOD - Use const for immutable widgets
const Text('Hello');
const SizedBox(height: 16);
const Icon(Icons.home);

// ❌ BAD
Text('Hello');  // Creates new instance every rebuild
```

### ListView.builder
```dart
// ✅ GOOD - Lazy loading with builder
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return UserCard(user: items[index]);
  },
);

// ❌ BAD - Creates all widgets upfront
ListView(
  children: items.map((item) => UserCard(user: item)).toList(),
);
```

### Keys for Lists
```dart
// ✅ GOOD - Use keys for dynamic lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return UserCard(
      key: ValueKey(items[index].id),
      user: items[index],
    );
  },
);
```

---

## 10. Linting Configuration

### analysis_options.yaml
```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - always_declare_return_types
    - always_use_package_imports
    - avoid_print
    - avoid_unnecessary_containers
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - prefer_final_fields
    - prefer_single_quotes
    - sort_child_properties_last
    - use_key_in_widget_constructors
    - avoid_web_libraries_in_flutter

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
  errors:
    invalid_annotation_target: ignore
```

---

## 11. CI/CD Integration

### GitHub Actions
```yaml
name: Flutter CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
      
      - name: Install dependencies
        run: flutter pub get
      
      - name: Analyze
        run: flutter analyze
      
      - name: Format check
        run: dart format --set-exit-if-changed .
      
      - name: Test
        run: flutter test --coverage
      
      - name: Build APK
        run: flutter build apk --release
```

---

## Enforcement Checklist

- [ ] Dart analyzer configured
- [ ] Const constructors for immutable widgets
- [ ] State management (Provider/Riverpod/Bloc)
- [ ] Repository pattern for data layer
- [ ] Widget tests
- [ ] Integration tests
- [ ] Performance optimizations
- [ ] Linting rules enforced
- [ ] CI/CD pipeline

---

**End of Flutter Rules Document**
