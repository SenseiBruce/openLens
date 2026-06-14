# Ruby Coding Rules

**Version:** 1.0  
**Last Updated:** 2026-02-09  
**Status:** ENFORCED via CI/CD

## Language Overview

### Version Requirements
- **Minimum Version:** Ruby 3.1
- **Recommended Version:** Ruby 3.3+
- **Framework:** Rails 7.1+ for web applications
- **Philosophy:** Developer happiness, convention over configuration, DRY

### Core Principles
- Write expressive, readable Ruby code
- Follow Rails conventions for Rails projects
- Use blocks, procs, and lambdas appropriately
- Embrace duck typing and metaprogramming wisely
- Prioritize simplicity and clarity
- Follow the Ruby Style Guide

## Naming Conventions

### Classes and Modules
```ruby
# GOOD - PascalCase for classes and modules
class UserService
  def initialize(repository)
    @repository = repository
  end
end

module Authentication
  class TokenGenerator
    # Implementation
  end
end

# BAD - snake_case or camelCase
class user_service
end

class userService
end
```

### Methods and Variables
```ruby
# GOOD - snake_case for methods and variables
def calculate_total_price(items)
  total_amount = 0
  item_count = items.length
  
  items.each do |item|
    total_amount += item.price
  end
  
  total_amount
end

# Predicate methods end with ?
def valid_email?(email)
  email.include?('@')
end

# Dangerous methods end with !
def update_username!(new_username)
  @username = new_username
  save!
end

# BAD - camelCase or PascalCase
def CalculateTotalPrice(items)
end

def isValidEmail(email)
end
```

### Constants
```ruby
# GOOD - SCREAMING_SNAKE_CASE for constants
MAX_RETRY_ATTEMPTS = 3
DEFAULT_TIMEOUT = 30
API_BASE_URL = 'https://api.example.com'

module Config
  DATABASE_URL = ENV['DATABASE_URL']
  JWT_SECRET = ENV['JWT_SECRET']
end

# BAD - camelCase or PascalCase
MaxRetryAttempts = 3
max_retry_attempts = 3
```

## Code Structure

### Class Organization
```ruby
# user_service.rb
class UserService
  # 1. Constants
  MAX_USERNAME_LENGTH = 50
  
  # 2. Class variables and methods
  @@instances = []
  
  def self.all_instances
    @@instances
  end
  
  # 3. Attribute accessors
  attr_reader :repository
  attr_accessor :cache_enabled
  
  # 4. Initialize method
  def initialize(repository, cache_enabled: true)
    @repository = repository
    @cache_enabled = cache_enabled
    @@instances << self
  end
  
  # 5. Public instance methods
  def create_user(username:, email:)
    validate_input!(username, email)
    
    user = User.new(
      username: username,
      email: email,
      created_at: Time.now
    )
    
    repository.save(user)
  end
  
  def find_by_email(email)
    repository.find_by(email: email)
  end
  
  # 6. Private methods
  private
  
  def validate_input!(username, email)
    raise ValidationError, 'Username is required' if username.nil? || username.empty?
    raise ValidationError, 'Invalid email' unless valid_email?(email)
  end
  
  def valid_email?(email)
    email =~ /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
  end
end
```

## Ruby Idioms and Best Practices

### Blocks, Procs, and Lambdas
```ruby
# GOOD - Use blocks for simple iteration
items.each do |item|
  process_item(item)
end

# One-liner blocks use braces
items.map { |item| item.price * 2 }

# Lambdas for reusable logic
multiply_by_two = ->(x) { x * 2 }
doubled_prices = items.map(&multiply_by_two)

# Procs for callbacks
callback = proc { |result| puts "Result: #{result}" }
process_async(&callback)

# Symbol-to-proc
usernames = users.map(&:username)
active_users = users.select(&:active?)
```

### String Interpolation and Symbols
```ruby
# GOOD - String interpolation
name = 'John'
age = 30
message = "User #{name} is #{age} years old"

# Multi-line strings
sql = <<~SQL
  SELECT users.*
  FROM users
  WHERE email = ?
  ORDER BY created_at DESC
SQL

# Use symbols for hash keys
user = {
  name: 'John',
  email: 'john@example.com',
  age: 30
}

# BAD - String concatenation
message = 'User ' + name + ' is ' + age.to_s + ' years old'

# Don't use strings as hash keys
user = {
  'name' => 'John',
  'email' => 'john@example.com'
}
```

### Truthiness and Nil Handling
```ruby
# GOOD - Safe navigation operator (&.)
email = user&.profile&.email

# Use || for default values
username = params[:username] || 'guest'

# Use unless for negative conditions
redirect_to login_path unless logged_in?

# Ternary operator for simple conditions
status = active? ? 'Active' : 'Inactive'

# BAD - Explicit nil checks everywhere
if user != nil && user.profile != nil
  email = user.profile.email
end
```

### Enumerable Methods
```ruby
# GOOD - Use enumerable methods
# Map
doubled = numbers.map { |n| n * 2 }

# Select/filter
evens = numbers.select { |n| n.even? }

# Reject
odds = numbers.reject { |n| n.even? }

# Find
first_even = numbers.find { |n| n.even? }

# Reduce
sum = numbers.reduce(0) { |acc, n| acc + n }
# or
sum = numbers.sum

# Each with object
grouped = items.each_with_object({}) do |item, hash|
  hash[item.category] ||= []
  hash[item.category] << item
end

# Group by
by_status = orders.group_by(&:status)
```

## Rails Specific Patterns

### Models (ActiveRecord)
```ruby
# GOOD - Clean model with validations and scopes
class User < ApplicationRecord
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments
  belongs_to :organization, optional: true
  
  # Validations
  validates :username, presence: true, length: { minimum: 3, maximum: 50 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :age, numericality: { greater_than_or_equal_to: 0, less_than: 150 }, allow_nil: true
  
  # Callbacks
  before_save :normalize_email
  after_create :send_welcome_email
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_organization, ->(org_id) { where(organization_id: org_id) }
  
  # Class methods
  def self.find_by_email_case_insensitive(email)
    find_by('LOWER(email) = ?', email.downcase)
  end
  
  # Instance methods
  def full_name
    "#{first_name} #{last_name}".strip
  end
  
  def active?
    active && !deleted_at
  end
  
  private
  
  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
  
  def send_welcome_email
    UserMailer.welcome_email(self).deliver_later
  end
end
```

### Controllers
```ruby
# GOOD - RESTful controller with proper error handling
class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update, :destroy]
  
  # GET /users
  def index
    @users = User.active.recent.page(params[:page])
    render json: @users
  end
  
  # GET /users/:id
  def show
    render json: @user
  end
  
  # POST /users
  def create
    @user = User.new(user_params)
    
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /users/:id
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /users/:id
  def destroy
    @user.destroy
    head :no_content
  end
  
  private
  
  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end
  
  def user_params
    params.require(:user).permit(:username, :email, :first_name, :last_name)
  end
end
```

### Services and POROs
```ruby
# GOOD - Service objects for business logic
class UserRegistrationService
  class RegistrationError < StandardError; end
  
  def initialize(user_params)
    @user_params = user_params
  end
  
  def call
    ActiveRecord::Base.transaction do
      create_user!
      create_profile!
      send_welcome_email
      @user
    end
  rescue ActiveRecord::RecordInvalid => e
    raise RegistrationError, e.message
  end
  
  private
  
  attr_reader :user_params
  
  def create_user!
    @user = User.create!(
      username: user_params[:username],
      email: user_params[:email],
      password: user_params[:password]
    )
  end
  
  def create_profile!
    @user.create_profile!(
      first_name: user_params[:first_name],
      last_name: user_params[:last_name]
    )
  end
  
  def send_welcome_email
    UserMailer.welcome_email(@user).deliver_later
  end
end

# Usage
service = UserRegistrationService.new(params)
user = service.call
```

## Security Patterns

### SQL Injection Prevention
```ruby
# GOOD - Use ActiveRecord query interface
def find_by_email(email)
  User.where(email: email).first
end

# Parameterized queries
User.where('email = ?', email)

# Named placeholders
User.where('email = :email AND active = :active', email: email, active: true)

# BAD - String interpolation (SQL INJECTION RISK)
def find_by_email_unsafe(email)
  User.where("email = '#{email}'").first
  # Attacker can inject: ' OR '1'='1
end
```

### Mass Assignment Protection
```ruby
# GOOD - Use strong parameters
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    # Only permitted attributes are set
  end
  
  private
  
  def user_params
    params.require(:user).permit(:username, :email, :first_name, :last_name)
  end
end

# Model with attr_accessible (older Rails)
class User < ApplicationRecord
  attr_accessible :username, :email  # Only these can be mass-assigned
end

# BAD - Directly using params
def create_unsafe
  @user = User.new(params[:user])  # Allows any attribute!
end
```

### Authentication and Authorization
```ruby
# GOOD - Use Devise for authentication
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end

# Authorization with Pundit
class UserPolicy
  attr_reader :current_user, :user
  
  def initialize(current_user, user)
    @current_user = current_user
    @user = user
  end
  
  def update?
    current_user.admin? || current_user == user
  end
  
  def destroy?
    current_user.admin?
  end
end

# Controller
class UsersController < ApplicationController
  def update
    @user = User.find(params[:id])
    authorize @user  # Checks UserPolicy#update?
    
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end
end
```

### Environment Variables and Secrets
```ruby
# GOOD - Use Rails credentials or environment variables
# config/credentials.yml.enc
# api_key: xxx
# secret_key: yyy

# Access in code
Rails.application.credentials.api_key

# Or environment variables
API_KEY = ENV.fetch('API_KEY')
DATABASE_URL = ENV.fetch('DATABASE_URL')

# Validate required env vars at boot
%w[API_KEY DATABASE_URL JWT_SECRET].each do |var|
  raise "Environment variable #{var} is required" unless ENV[var]
end

# BAD - Hardcoded secrets
API_KEY = 'sk-1234567890'  # NEVER DO THIS!
JWT_SECRET = 'my-secret-key'
```

### CSRF Protection
```ruby
# GOOD - Rails has built-in CSRF protection
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  
  # For API-only apps
  protect_from_forgery with: :null_session
end

# In forms
<%= form_with model: @user do |f| %>
  <%= f.text_field :username %>
  <%= f.submit %>
<% end %>
# Automatically includes CSRF token
```

## Testing Standards (RSpec)

### Model Specs
```ruby
# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:username) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
    it { should validate_length_of(:username).is_at_least(3).is_at_most(50) }
  end
  
  describe 'associations' do
    it { should have_many(:posts) }
    it { should have_many(:comments) }
    it { should belong_to(:organization).optional }
  end
  
  describe '#full_name' do
    it 'returns the full name' do
      user = User.new(first_name: 'John', last_name: 'Doe')
      expect(user.full_name).to eq('John Doe')
    end
    
    it 'handles missing names' do
      user = User.new(first_name: 'John')
      expect(user.full_name).to eq('John')
    end
  end
  
  describe '.find_by_email_case_insensitive' do
    let!(:user) { create(:user, email: 'Test@Example.COM') }
    
    it 'finds user regardless of case' do
      result = User.find_by_email_case_insensitive('test@example.com')
      expect(result).to eq(user)
    end
  end
end
```

### Controller Specs
```ruby
# spec/controllers/users_controller_spec.rb
require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:valid_attributes) do
    {
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123'
    }
  end
  
  let(:invalid_attributes) do
    {
      username: '',
      email: 'invalid'
    }
  end
  
  describe 'GET #index' do
    it 'returns a success response' do
      create_list(:user, 3)
      get :index
      expect(response).to be_successful
    end
  end
  
  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new User' do
        expect {
          post :create, params: { user: valid_attributes }
        }.to change(User, :count).by(1)
      end
      
      it 'returns a created status' do
        post :create, params: { user: valid_attributes }
        expect(response).to have_http_status(:created)
      end
    end
    
    context 'with invalid params' do
      it 'does not create a new User' do
        expect {
          post :create, params: { user: invalid_attributes }
        }.not_to change(User, :count)
      end
      
      it 'returns an unprocessable entity status' do
        post :create, params: { user: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
```

### FactoryBot
```ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "user#{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'SecurePass123' }
    first_name { 'John' }
    last_name { 'Doe' }
    active { true }
    
    trait :inactive do
      active { false }
    end
    
    trait :admin do
      role { 'admin' }
    end
    
    factory :admin_user, traits: [:admin]
  end
end

# Usage
user = create(:user)
admin = create(:admin_user)
inactive_user = create(:user, :inactive)
```

## RuboCop Configuration

### .rubocop.yml
```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.1
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'vendor/**/*'
    - 'node_modules/**/*'

Layout/LineLength:
  Max: 120

Metrics/BlockLength:
  Exclude:
    - 'spec/**/*'
    - 'config/**/*'

Metrics/MethodLength:
  Max: 15
  Exclude:
    - 'db/migrate/*'

Style/Documentation:
  Enabled: false

Style/FrozenStringLiteralComment:
  Enabled: true
  
Style/StringLiterals:
  EnforcedStyle: single_quotes

Style/HashSyntax:
  EnforcedStyle: ruby19

Rails/Output:
  Exclude:
    - 'db/seeds.rb'
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Ruby Linting and Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 3.3
        bundler-cache: true
    
    - name: Run RuboCop
      run: bundle exec rubocop
    
    - name: Setup database
      env:
        RAILS_ENV: test
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      run: |
        bundle exec rails db:create
        bundle exec rails db:schema:load
    
    - name: Run tests
      env:
        RAILS_ENV: test
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      run: bundle exec rspec
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage.xml
```

## Common Anti-Patterns

### Not Using Safe Navigation
```ruby
# BAD
email = user.profile.email if user && user.profile

# GOOD
email = user&.profile&.email
```

### Unnecessary Conditionals
```ruby
# BAD
def active?
  if active == true
    true
  else
    false
  end
end

# GOOD
def active?
  active
end
```

### Not Using Blocks
```ruby
# BAD
file = File.open('data.txt')
data = file.read
file.close

# GOOD
data = File.open('data.txt') { |file| file.read }
```

## Code Review Checklist

- [ ] Follows Ruby Style Guide
- [ ] RuboCop passes with no offenses
- [ ] Uses strong parameters
- [ ] No SQL injection vulnerabilities
- [ ] Validations on models
- [ ] Tests cover new code (>= 90%)
- [ ] No hardcoded secrets
- [ ] Proper error handling
- [ ] Callbacks used appropriately
- [ ] Database queries optimized (N+1 prevention)

---

**Enforcement:** These rules are automatically enforced through RuboCop and CI/CD pipelines.
