# Angular Coding Standards and Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED - Auto-checked via ESLint/TSLint and CI/CD

---

## 1. Framework Overview

### Version Requirements
- **Angular:** >= 17.0.0
- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.2.0
- **RxJS:** >= 7.8.0

### Architecture Philosophy
- Component-based architecture
- Dependency injection at core
- TypeScript-first
- Reactive programming with RxJS
- Modular design with NgModules/Standalone components

---

## 2. Project Structure

### Directory Layout
```
src/
├── app/
│   ├── core/              # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── core.module.ts
│   ├── shared/            # Shared components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── shared.module.ts
│   ├── features/          # Feature modules
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── users.module.ts
│   │   └── products/
│   ├── models/            # Shared interfaces/types
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── assets/                # Static assets
└── environments/          # Environment configs
```

### File Naming Conventions
- **Component:** `user-profile.component.ts`
- **Service:** `user.service.ts`
- **Module:** `users.module.ts`
- **Directive:** `highlight.directive.ts`
- **Pipe:** `currency-format.pipe.ts`
- **Guard:** `auth.guard.ts`
- **Interceptor:** `auth.interceptor.ts`
- **Model:** `user.model.ts` or `user.interface.ts`

**RULE:** Follow Angular CLI naming conventions strictly

---

## 3. Naming Conventions

### Classes and Interfaces
```typescript
// ✅ GOOD - PascalCase with suffix
export class UserProfileComponent implements OnInit { }
export class UserService { }
export class AuthGuard implements CanActivate { }
export interface User { }
export enum UserRole { }

// ❌ BAD - Missing suffix or wrong case
export class userprofile { }
export class User { } // Could be interface or class
```

### Properties and Methods
```typescript
// ✅ GOOD - camelCase
export class UserService {
  private baseUrl = '/api/users';
  private currentUser: User | null = null;

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }
}

// ❌ BAD - PascalCase or snake_case
private BaseUrl = '/api/users';
get_user_by_id() { }
```

### Observables
```typescript
// ✅ GOOD - $ suffix for observables
users$: Observable<User[]>;
loading$: Observable<boolean>;
selectedUser$ = this.store.select(selectUser);

// ❌ BAD - No suffix
users: Observable<User[]>;
```

---

## 4. Component Architecture

### Standalone Components (Preferred)
```typescript
// ✅ GOOD - Standalone component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.user = user,
      error: (err) => console.error('Failed to load user', err)
    });
  }
}
```

### Component Lifecycle
```typescript
// ✅ GOOD - Proper lifecycle implementation
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ BAD - Missing unsubscribe
export class UserComponent implements OnInit {
  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users); // Memory leak!
  }
}
```

### Smart vs. Presentational Components
```typescript
// ✅ GOOD - Presentational (dumb) component
@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <button (click)="userSelected.emit(user.id)">View</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Output() userSelected = new EventEmitter<string>();
}

// ✅ GOOD - Smart (container) component
@Component({
  selector: 'app-users-container',
  standalone: true,
  imports: [UserListComponent],
  template: `
    <app-user-list 
      [users]="users$ | async"
      (userSelected)="onUserSelected($event)">
    </app-user-list>
  `
})
export class UsersContainerComponent {
  users$ = this.userService.getUsers();

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onUserSelected(userId: string): void {
    this.router.navigate(['/users', userId]);
  }
}
```

---

## 5. Dependency Injection

### Service Definition
```typescript
// ✅ GOOD - Injectable service with providedIn
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}

// ❌ BAD - Missing providedIn (requires module registration)
@Injectable()
export class UserService { }
```

### Constructor Injection
```typescript
// ✅ GOOD - Inject dependencies in constructor
export class UserComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
}

// ❌ BAD - Direct instantiation
export class UserComponent {
  userService = new UserService(); // NEVER
}
```

### Injection Tokens
```typescript
// ✅ GOOD - Use InjectionToken for non-class dependencies
export const API_URL = new InjectionToken<string>('api.url');

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(@Inject(API_URL) private apiUrl: string) {}
}

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: environment.apiUrl }
  ]
};
```

---

## 6. RxJS Patterns

### Observable Subscriptions
```typescript
// ✅ GOOD - Async pipe (auto-unsubscribe)
@Component({
  template: `
    <div *ngIf="user$ | async as user">
      {{ user.name }}
    </div>
  `
})
export class UserComponent {
  user$ = this.userService.getUser(this.userId);
}

// ✅ GOOD - takeUntil pattern
export class UserComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ BAD - Unmanaged subscription
ngOnInit(): void {
  this.userService.getUsers()
    .subscribe(users => this.users = users); // Memory leak
}
```

### Operators
```typescript
// ✅ GOOD - Proper operator usage
searchUsers(term: string): Observable<User[]> {
  return this.searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.userService.search(term)),
    catchError(error => {
      console.error(error);
      return of([]);
    }),
    shareReplay(1)
  );
}

// ✅ GOOD - combineLatest for multiple streams
vm$ = combineLatest([
  this.users$,
  this.selectedUserId$,
  this.loading$
]).pipe(
  map(([users, selectedId, loading]) => ({
    users,
    selectedUser: users.find(u => u.id === selectedId),
    loading
  }))
);
```

### Subject Best Practices
```typescript
// ✅ GOOD - Private Subject, public Observable
export class DataService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  public data$ = this.dataSubject.asObservable();

  updateData(data: Data[]): void {
    this.dataSubject.next(data);
  }
}

// ❌ BAD - Exposing Subject directly
public dataSubject = new BehaviorSubject<Data[]>([]);
```

---

## 7. Routing

### Route Configuration
```typescript
// ✅ GOOD - Type-safe routes
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./users/user-detail.component').then(m => m.UserDetailComponent),
    resolve: {
      user: UserResolver
    }
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
```

### Guards
```typescript
// ✅ GOOD - Functional guard (Angular 15+)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

// ✅ GOOD - Class-based guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      map(isAuth => isAuth || this.router.createUrlTree(['/login']))
    );
  }
}
```

---

## 8. API Integration

### HTTP Interceptor
```typescript
// ✅ GOOD - Authentication interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}

// Register in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### HTTP Service Pattern
```typescript
// ✅ GOOD - Service with proper typing and error handling
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

---

## 9. Security Patterns

### XSS Prevention
```typescript
// ✅ GOOD - Angular sanitizes by default
@Component({
  template: `<div>{{ userInput }}</div>` // Auto-sanitized
})

// ⚠️ DANGEROUS - Bypass sanitization
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

sanitizedContent: SafeHtml;

ngOnInit(): void {
  this.sanitizedContent = this.sanitizer.sanitize(
    SecurityContext.HTML,
    this.untrustedHtml
  ) || '';
}
```

### Environment Variables
```typescript
// ✅ GOOD - Environment configuration
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  enableDebug: false
};

// ❌ BAD - Hardcoded values
const apiUrl = 'http://localhost:3000'; // NEVER
```

### CSRF Protection
```typescript
// ✅ GOOD - Angular provides CSRF protection via HttpClient
// Automatically includes XSRF-TOKEN cookie as X-XSRF-TOKEN header
```

---

## 10. Testing Standards

### Unit Testing (Jasmine/Karma)
```typescript
// ✅ GOOD - Component test
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    const mockUser: User = { id: '1', name: 'John Doe' };
    userService.getUser.and.returnValue(of(mockUser));

    fixture.detectChanges();

    expect(userService.getUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });
});
```

### Service Testing
```typescript
// ✅ GOOD - Service test with HttpClientTestingModule
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve users', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle error', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

### E2E Testing (Playwright/Cypress)
```typescript
// ✅ GOOD - E2E test
describe('User Management', () => {
  beforeEach(() => {
    cy.visit('/users');
  });

  it('should display user list', () => {
    cy.get('[data-testid="user-list"]').should('be.visible');
    cy.get('[data-testid="user-item"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to user detail', () => {
    cy.get('[data-testid="user-item"]').first().click();
    cy.url().should('include', '/users/');
    cy.get('[data-testid="user-detail"]').should('be.visible');
  });
});
```

---

## 11. Performance Optimization

### Change Detection Strategy
```typescript
// ✅ GOOD - OnPush change detection
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>{{ user.name }}</div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
}
```

### TrackBy Function
```typescript
// ✅ GOOD - trackBy for ngFor
@Component({
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  @Input() users: User[] = [];

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}

// ❌ BAD - No trackBy
<div *ngFor="let user of users">{{ user.name }}</div>
```

### Lazy Loading
```typescript
// ✅ GOOD - Lazy load feature modules
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```

### Pure Pipes
```typescript
// ✅ GOOD - Pure pipe for expensive operations
@Pipe({
  name: 'userFilter',
  pure: true,
  standalone: true
})
export class UserFilterPipe implements PipeTransform {
  transform(users: User[], searchTerm: string): User[] {
    if (!searchTerm) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
```

---

## 12. Accessibility (WCAG 2.1 AA)

### Semantic HTML
```typescript
// ✅ GOOD - Semantic elements
@Component({
  template: `
    <nav aria-label="Main navigation">
      <ul>
        <li><a routerLink="/">Home</a></li>
      </ul>
    </nav>
    
    <main>
      <h1>Welcome</h1>
      <button (click)="submit()">Submit</button>
    </main>
  `
})
```

### ARIA Attributes
```typescript
// ✅ GOOD - Proper ARIA
@Component({
  template: `
    <button
      [attr.aria-pressed]="isActive"
      [attr.aria-label]="buttonLabel"
      (click)="toggle()">
      Toggle
    </button>
    
    <input
      type="text"
      [attr.aria-describedby]="'help-text'"
      [attr.aria-invalid]="hasError">
    <span id="help-text">Enter your email</span>
  `
})
```

---

## 13. Linter Configuration

### .eslintrc.json
```json
{
  "root": true,
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          { "type": "attribute", "prefix": "app", "style": "camelCase" }
        ],
        "@angular-eslint/component-selector": [
          "error",
          { "type": "element", "prefix": "app", "style": "kebab-case" }
        ],
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/explicit-function-return-type": "warn"
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ]
    }
  ]
}
```

---

## 14. CI/CD Integration

### GitHub Actions
```yaml
name: Angular CI

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
      
      - name: Test
        run: npm run test:ci
      
      - name: Build
        run: npm run build -- --configuration production
      
      - name: E2E
        run: npm run e2e
```

---

## 15. Common Anti-Patterns

### ❌ Don't Subscribe in Templates
```typescript
// ❌ BAD
<div *ngIf="userService.getUser().subscribe()">...</div>

// ✅ GOOD
users$ = this.userService.getUsers();
<div *ngIf="users$ | async as users">...</div>
```

### ❌ Don't Mutate Inputs
```typescript
// ❌ BAD
@Input() user!: User;
ngOnInit() {
  this.user.name = 'Changed'; // NEVER mutate inputs
}

// ✅ GOOD
@Output() userChanged = new EventEmitter<User>();
updateUser() {
  this.userChanged.emit({ ...this.user, name: 'Changed' });
}
```

---

## Enforcement Checklist

- [ ] ESLint with Angular plugins configured
- [ ] TypeScript strict mode enabled
- [ ] Pre-commit hooks configured
- [ ] CI/CD pipeline enforces linting and tests
- [ ] Unit tests with Jasmine/Karma
- [ ] E2E tests with Cypress/Playwright
- [ ] Accessibility audits
- [ ] Bundle size monitoring

---

**End of Angular Rules Document**
