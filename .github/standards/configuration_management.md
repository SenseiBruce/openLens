# Configuration Management Standard
**For: All AgentBase Development Projects**  
**Purpose:** Eliminate hardcoded values and ensure maintainable, environment-aware applications

---

## Core Principle

**ZERO HARDCODED VALUES IN CODE**

All configuration must be:
- ✅ Externalized to config files
- ✅ Environment-aware (dev/staging/prod)
- ✅ Version controlled (with examples)
- ✅ Validated at startup
- ✅ Documented

---

## 1. Configuration File Structure

### Standard Configuration Layout

```
config/
├── default.json          # Default values (committed)
├── development.json      # Dev overrides (committed)
├── staging.json          # Staging overrides (committed)
├── production.json       # Prod overrides (committed)
├── local.json           # Local overrides (gitignored)
├── secrets.json.example  # Template (committed)
└── secrets.json         # Actual secrets (gitignored)
```

### Configuration Hierarchy

**Loading order (later overrides earlier):**
1. `default.json` - Base configuration
2. `{environment}.json` - Environment-specific
3. `local.json` - Developer local overrides
4. Environment variables - Highest priority
5. Secrets Manager - Production secrets

---

## 2. What to Configure

### Application Settings

**Model/AI Configuration:**
```json
{
  "models": {
    "bedrock": {
      "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "region": "us-east-1",
      "temperature": 0.0,
      "max_tokens": 4096
    },
    "vertex_ai": {
      "model_id": "gemini-2.0-flash-exp",
      "project_id": "${GCP_PROJECT_ID}",
      "location": "us-central1",
      "temperature": 0.1
    }
  }
}
```

**API Configuration:**
```json
{
  "api": {
    "rate_limits": {
      "anonymous": 10,
      "authenticated": 100,
      "premium": 1000
    },
    "pagination": {
      "default_page_size": 20,
      "max_page_size": 100
    },
    "timeout_seconds": 30
  }
}
```

**Database Configuration:**
```json
{
  "database": {
    "pool_size": 10,
    "max_overflow": 20,
    "pool_timeout": 30,
    "pool_recycle": 3600,
    "echo": false,
    "retry_attempts": 3
  }
}
```

**Business Logic Configuration:**
```json
{
  "classification": {
    "confidence_threshold": 0.7,
    "ensemble_weights": {
      "bedrock": 0.6,
      "vertex_ai": 0.4
    },
    "require_visual_check_below": 0.7
  },
  "retention": {
    "evidence_days": 180,
    "exports_days": 30,
    "classifications_days": 365
  }
}
```

**Feature Flags:**
```json
{
  "features": {
    "vertex_ai_enabled": true,
    "batch_processing_enabled": true,
    "expert_feedback_enabled": true,
    "export_formats": ["json", "csv", "pdf"]
  }
}
```

### Prompts and Templates

**Store prompts in config, NOT code:**

```json
{
  "prompts": {
    "piracy_classification": {
      "system": "You are an expert at identifying piracy websites...",
      "temperature": 0.0,
      "indicators": {
        "piracy": [
          "torrent",
          "magnet links",
          "watch free",
          "download free"
        ],
        "legitimate": [
          "official brand",
          "payment required",
          "licensing info"
        ]
      }
    },
    "visual_analysis": {
      "system": "Analyze this screenshot for piracy indicators...",
      "temperature": 0.1
    }
  }
}
```

**Better yet: External files for long prompts:**

```
config/prompts/
├── piracy_classification_system.txt
├── piracy_classification_user.txt
├── visual_analysis_system.txt
└── visual_analysis_user.txt
```

---

## 3. Implementation Patterns

### Python (Lambda/Backend)

**config_loader.py:**
```python
"""Configuration loader with environment support"""
import json
import os
from pathlib import Path
from typing import Any, Dict

class Config:
    _instance = None
    _config: Dict[str, Any] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_config()
        return cls._instance
    
    def _load_config(self):
        """Load configuration from files and environment"""
        config_dir = Path(__file__).parent / 'config'
        env = os.getenv('ENVIRONMENT', 'development')
        
        # Load in order (later overrides earlier)
        configs = [
            config_dir / 'default.json',
            config_dir / f'{env}.json',
            config_dir / 'local.json'
        ]
        
        for config_file in configs:
            if config_file.exists():
                with open(config_file) as f:
                    data = json.load(f)
                    self._merge_config(data)
        
        # Override with environment variables
        self._apply_env_overrides()
    
    def _merge_config(self, new_config: Dict):
        """Deep merge configuration"""
        self._config = self._deep_merge(self._config, new_config)
    
    def _deep_merge(self, base: Dict, update: Dict) -> Dict:
        """Recursively merge dictionaries"""
        result = base.copy()
        for key, value in update.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value
        return result
    
    def _apply_env_overrides(self):
        """Apply environment variable overrides"""
        # Example: MODEL_BEDROCK_MODEL_ID -> models.bedrock.model_id
        for key, value in os.environ.items():
            if key.startswith('MODEL_') or key.startswith('API_'):
                # Parse key and set value
                pass
    
    def get(self, key: str, default=None):
        """Get config value using dot notation"""
        keys = key.split('.')
        value = self._config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default

# Global config instance
config = Config()
```

**Usage in Lambda:**
```python
from config_loader import config

# Instead of hardcoded values
MODEL_ID = config.get('models.bedrock.model_id')
TEMPERATURE = config.get('models.bedrock.temperature')
CONFIDENCE_THRESHOLD = config.get('classification.confidence_threshold')

# Load prompt from file
def get_prompt(prompt_type: str) -> str:
    prompt_file = Path(__file__).parent / 'config' / 'prompts' / f'{prompt_type}.txt'
    return prompt_file.read_text()

SYSTEM_PROMPT = get_prompt('piracy_classification_system')
```

### JavaScript/TypeScript (Frontend)

**config.ts:**
```typescript
interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  models: {
    displayNames: Record<string, string>;
  };
  ui: {
    theme: string;
    pagination: {
      defaultPageSize: number;
      pageSizeOptions: number[];
    };
  };
}

const environments: Record<string, Config> = {
  development: {
    api: {
      baseUrl: 'http://localhost:3000',
      timeout: 30000
    },
    models: {
      displayNames: {
        'anthropic.claude-3-5-sonnet': 'Claude 3.5 Sonnet',
        'gemini-2.0-flash-exp': 'Gemini 2.0 Pro'
      }
    },
    ui: {
      theme: 'light',
      pagination: {
        defaultPageSize: 20,
        pageSizeOptions: [10, 20, 50, 100]
      }
    }
  },
  production: {
    api: {
      baseUrl: import.meta.env.VITE_API_ENDPOINT,
      timeout: 10000
    },
    // ... prod overrides
  }
};

const env = import.meta.env.MODE || 'development';
export const config: Config = environments[env];
```

**Usage:**
```typescript
import { config } from './config';

// Instead of hardcoded
const response = await fetch(`${config.api.baseUrl}/classifications`);

// Display model names
const modelName = config.models.displayNames[model_id];
```

---

## 4. Environment-Specific Configuration

### Development

**config/development.json:**
```json
{
  "models": {
    "bedrock": {
      "model_id": "anthropic.claude-3-sonnet-20240229-v1:0",
      "temperature": 0.2
    }
  },
  "api": {
    "rate_limits": {
      "anonymous": 1000
    }
  },
  "database": {
    "echo": true,
    "pool_size": 5
  },
  "features": {
    "debug_logging": true,
    "mock_external_apis": true
  }
}
```

### Production

**config/production.json:**
```json
{
  "models": {
    "bedrock": {
      "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "temperature": 0.0
    }
  },
  "api": {
    "rate_limits": {
      "anonymous": 10,
      "authenticated": 100
    }
  },
  "database": {
    "echo": false,
    "pool_size": 20
  },
  "features": {
    "debug_logging": false,
    "mock_external_apis": false
  }
}
```

---

## 5. Configuration Validation

### Startup Validation

**validate_config.py:**
```python
from typing import List, Optional
from pydantic import BaseModel, validator

class BedrockConfig(BaseModel):
    model_id: str
    region: str
    temperature: float
    max_tokens: int
    
    @validator('temperature')
    def validate_temperature(cls, v):
        if not 0.0 <= v <= 1.0:
            raise ValueError('Temperature must be between 0 and 1')
        return v
    
    @validator('model_id')
    def validate_model_id(cls, v):
        valid_prefixes = ['anthropic.', 'meta.', 'cohere.']
        if not any(v.startswith(p) for p in valid_prefixes):
            raise ValueError(f'Invalid model ID: {v}')
        return v

class ModelsConfig(BaseModel):
    bedrock: BedrockConfig
    vertex_ai: dict

class AppConfig(BaseModel):
    models: ModelsConfig
    api: dict
    database: dict
    classification: dict
    
    class Config:
        extra = 'forbid'  # Reject unknown fields

# Validate on startup
def validate_config(config_dict: dict) -> AppConfig:
    try:
        return AppConfig(**config_dict)
    except Exception as e:
        raise ValueError(f"Invalid configuration: {e}")
```

**Usage:**
```python
# In Lambda handler or app initialization
from config_loader import config
from validate_config import validate_config

# Validate configuration
try:
    app_config = validate_config(config._config)
    logger.info("Configuration validated successfully")
except ValueError as e:
    logger.error(f"Configuration error: {e}")
    raise
```

---

## 6. Migration from Hardcoded Values

### Step 1: Identify Hardcoded Values

**Scan for hardcoded values:**
```bash
# Find hardcoded strings
grep -r '"anthropic\.' src/
grep -r '"gemini-' src/
grep -r 'us-east-1' src/
grep -r 'us-central1' src/
grep -r '0\.[0-9]' src/  # Temperatures, thresholds

# Find hardcoded numbers (thresholds, timeouts)
grep -r 'confidence.*[0-9]\.[0-9]' src/
grep -r 'timeout.*[0-9]' src/
```

### Step 2: Extract to Config

**Before (Hardcoded):**
```python
MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0"
TEMPERATURE = 0.0
CONFIDENCE_THRESHOLD = 0.7

SYSTEM_PROMPT = """You are an expert at identifying piracy websites.

PIRACY INDICATORS:
1. Torrents and magnet links
2. Free streaming...
"""
```

**After (Configured):**
```python
from config_loader import config

MODEL_ID = config.get('models.bedrock.model_id')
TEMPERATURE = config.get('models.bedrock.temperature')
CONFIDENCE_THRESHOLD = config.get('classification.confidence_threshold')

def get_system_prompt():
    prompt_file = Path(__file__).parent / 'config' / 'prompts' / 'piracy_classification.txt'
    return prompt_file.read_text()

SYSTEM_PROMPT = get_system_prompt()
```

**config/default.json:**
```json
{
  "models": {
    "bedrock": {
      "model_id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "temperature": 0.0
    }
  },
  "classification": {
    "confidence_threshold": 0.7
  }
}
```

**config/prompts/piracy_classification.txt:**
```
You are an expert at identifying piracy websites.

PIRACY INDICATORS:
1. Torrents and magnet links
2. Free streaming...
```

### Step 3: Update Terraform

**Instead of hardcoded in Lambda environment:**
```terraform
environment {
  variables = {
    BEDROCK_MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0"  # Hardcoded
  }
}
```

**Use variables:**
```terraform
environment {
  variables = {
    BEDROCK_MODEL_ID = var.bedrock_model_id
    ENVIRONMENT      = var.environment
  }
}
```

**variables.tf:**
```terraform
variable "bedrock_model_id" {
  description = "Bedrock model ID"
  type        = string
  default     = "anthropic.claude-3-5-sonnet-20241022-v2:0"
}
```

---

## 7. Configuration Best Practices

### DO ✅

1. **Use hierarchical config** - default → environment → local → env vars
2. **Validate on startup** - Catch config errors before they cause issues
3. **Document all options** - Comments in config files
4. **Version control examples** - Commit .example files
5. **Environment-specific values** - Different settings per environment
6. **Externalize prompts** - Store in separate files
7. **Use types/schemas** - Pydantic, JSON Schema, TypeScript interfaces

### DON'T ❌

1. **Hardcode values** - Ever, for any reason
2. **Commit secrets** - Use .gitignore + Secrets Manager
3. **Use magic numbers** - Give everything a name and meaning
4. **Duplicate config** - Single source of truth
5. **Ignore validation** - Always validate configuration
6. **Mix config and code** - Separate concerns

---

## 8. Configuration Checklist

### For Every Project

**Setup:**
- [ ] Create `config/` directory
- [ ] Create `default.json` with all base settings
- [ ] Create environment-specific files (dev, staging, prod)
- [ ] Create `*.example` files for secrets
- [ ] Add `local.json` and `secrets.json` to .gitignore
- [ ] Create `config_loader.py` or equivalent
- [ ] Create `validate_config.py` with schemas

**Migration:**
- [ ] Scan code for hardcoded values
- [ ] Extract all strings, numbers, thresholds
- [ ] Move prompts to external files
- [ ] Update all imports and references
- [ ] Test in each environment
- [ ] Document all configuration options

**Validation:**
- [ ] Configuration validates on startup
- [ ] All required fields present
- [ ] All values within acceptable ranges
- [ ] Environment-specific overrides work
- [ ] Secrets loaded correctly

---

## 9. Example Project Structure

```
project/
├── config/
│   ├── default.json
│   ├── development.json
│   ├── production.json
│   ├── local.json.example
│   ├── secrets.json.example
│   └── prompts/
│       ├── piracy_classification_system.txt
│       ├── piracy_classification_user.txt
│       └── visual_analysis_system.txt
├── src/
│   ├── config_loader.py
│   ├── validate_config.py
│   └── lambda/
│       ├── classification/
│       │   └── main.py  # Uses config, no hardcoded values
│       └── vertex_ai/
│           └── main.py  # Uses config, no hardcoded values
├── infrastructure/
│   └── terraform/
│       ├── variables.tf  # All configurable values
│       └── lambda.tf     # References variables
├── .gitignore
│   # config/local.json
│   # config/secrets.json
└── README.md
    # Configuration section
```

---

## 10. Quick Reference

### Common Configuration Categories

| Category | Examples | Storage |
|----------|----------|---------|
| **Model Settings** | Model IDs, temperatures, max tokens | config/default.json |
| **API Config** | Rate limits, timeouts, pagination | config/default.json |
| **Database** | Pool size, timeouts, retry logic | config/{env}.json |
| **Business Logic** | Thresholds, weights, rules | config/default.json |
| **Feature Flags** | Enable/disable features | config/{env}.json |
| **Prompts** | System prompts, templates | config/prompts/*.txt |
| **Secrets** | API keys, passwords | Secrets Manager |
| **Infrastructure** | Region, instance types | terraform/variables.tf |

### Priority Order (Highest to Lowest)

1. Environment variables (runtime override)
2. Secrets Manager (production secrets)
3. `local.json` (developer overrides, gitignored)
4. `{environment}.json` (environment-specific)
5. `default.json` (base configuration)

---

**This standard eliminates hardcoded values and ensures maintainable, environment-aware applications.**
