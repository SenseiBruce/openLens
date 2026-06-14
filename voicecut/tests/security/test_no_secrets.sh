#!/bin/bash
# Security test to scan for hardcoded secrets

echo "Scanning for hardcoded secrets in codebase..."

# Scan the 'voicecut' directory
# Fails if it finds matches for common secret patterns, excluding dependencies
if grep -riE --exclude-dir="node_modules" --exclude-dir=".venv" --exclude-dir="__pycache__" "api[_-]?key\s*=\s*['\"][a-zA-Z0-9]+['\"]" voicecut/ || \
   grep -riE --exclude-dir="node_modules" --exclude-dir=".venv" --exclude-dir="__pycache__" "password\s*=\s*['\"][a-zA-Z0-9]+['\"]" voicecut/ || \
   grep -riE --exclude-dir="node_modules" --exclude-dir=".venv" --exclude-dir="__pycache__" "sk-[a-zA-Z0-9]{20,}" voicecut/ || \
   grep -riE --exclude-dir="node_modules" --exclude-dir=".venv" --exclude-dir="__pycache__" "aws_[a-zA-Z0-9_]*_key\s*=\s*['\"][a-zA-Z0-9]+['\"]" voicecut/; then
    echo "ERROR: Hardcoded secrets detected!"
    exit 1
fi

echo "✅ No hardcoded secrets found."
exit 0
