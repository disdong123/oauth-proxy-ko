# Convention

## Conventional Commits
### Settings
```
# Install dependencies
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# Configure commitlint
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Install husky
npx husky init

# Configure commit-msg
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# Remove pre-commit if you don't need
rm .husky/pre-commit
```

### References
- https://www.conventionalcommits.org/en/v1.0.0/
- https://medium.com/@abpeter14/how-to-install-commitlint-husky-2024-f1157f14006f

## Versioning
