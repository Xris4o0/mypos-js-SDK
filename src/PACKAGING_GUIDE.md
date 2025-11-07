# V2 Package Distribution Guide

This guide explains how to package and distribute the v2 SDK as an npm package that can be installed and used in other projects.

## 📦 Table of Contents

1. [Package Structure](#package-structure)
2. [Package Configuration](#package-configuration)
3. [Building for Distribution](#building-for-distribution)
4. [Local Testing](#local-testing)
5. [Publishing to npm](#publishing-to-npm)
6. [Usage in Other Projects](#usage-in-other-projects)
7. [Version Management](#version-management)
8. [Best Practices](#best-practices)

---

## Package Structure

### Current Structure
```
mypos-js-SDK/
├── src/                   # Current implementation (renamed from v2)
│   ├── config/
│   ├── core/
│   ├── checkout/
│   ├── utils/
│   ├── __tests__/
│   ├── index.js
│   ├── client.js
│   └── package.json       # Will create this
├── package.json           # Root package.json
└── README.md
```

### Options for Distribution

#### Option 1: Separate Package (Recommended)
Publish v2 as a separate npm package:
- Package name: `@mypos/checkout-sdk-v2`
- Allows v1 users to continue using old version
- Clean separation of versions

#### Option 2: Major Version Bump
Publish as version 2.0.0 of existing package:
- Package name: `@mypos/JS-checkout-SDK`
- Breaking changes in major version
- Natural upgrade path

#### Option 3: Dual Export
Keep both v1 and v2 in same package:
- `require('@mypos/JS-checkout-SDK')` = v1
- `require('@mypos/JS-checkout-SDK')` = v2
- Allows gradual migration

**This guide covers Option 3 (recommended for smooth migration)**

---

## Package Configuration

### 1. Update Root package.json

**File**: `package.json` (root)

```json
{
  "name": "@mypos/JS-checkout-SDK",
  "version": "1.1.0",
  "description": "NodeJS SDK for myPOS Checkout API with v1 (legacy) and v2 (modern) implementations",
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./v2": "./src/index.js",
    "./src/*": "./src/*.js",
    "./v2/*": "./src/*.js"
  },
  "scripts": {
    "test": "jest --config src/jest.config.js",
    "test:unit": "jest --config src/jest.config.js src/__tests__/unit",
    "test:integration": "jest --config src/jest.config.js src/__tests__/integration",
    "test:coverage": "jest --config src/jest.config.js --coverage",
    "test:all": "npm test",
    "prepublishOnly": "npm run test:all",
    "start": "node examples/checkout.js",
    "demo": "node examples/demo-app.js"
  },
  "keywords": [
    "mypos",
    "checkout",
    "payments",
    "sdk",
    "ecommerce",
    "nodejs",
    "api",
    "v2"
  ],
  "author": "myPOS",
  "license": "ISC",
  "dependencies": {
    "node-rsa": "^1.0.6",
    "uuid": "^11.1.0",
    "dotenv": "^16.5.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "express": "^5.1.0"
  },
  "files": [
    "src",
    "README.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/developermypos/mypos-js.git"
  },
  "bugs": {
    "url": "https://github.com/developermypos/mypos-js/issues"
  },
  "homepage": "https://github.com/developermypos/mypos-js#readme",
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Key package.json Fields Explained

#### `main`
- Entry point for default import
- Points to v1 for backward compatibility

#### `exports`
- Modern Node.js way to specify entry points
- Allows both v1 and v2 access:
  ```javascript
  require('@mypos/JS-checkout-SDK')      // v1
  require('@mypos/JS-checkout-SDK')   // v2
  ```

#### `files`
- Specifies which files to include in npm package
- Excludes: tests, examples (unless listed)
- Includes: src, v2, LICENSE, README

#### `scripts`
- `prepublishOnly`: Runs before publishing (safety check)
- `test:all`: Tests both v1 and v2

#### `engines`
- Specifies required Node.js version
- v2 uses modern features (async/await)

### 2. Create .npmignore

**File**: `.npmignore` (root)

```
# Development files
__tests__
*.test.js
.env
.env.example
example.env.txt

# Build artifacts
coverage
.nyc_output

# Development tools
.eslintrc
.prettierrc
.vscode
.idea

# Examples (optional - remove if you want to include them)
examples/
demo-app.js

# Git files
.git
.gitignore
.github

# CI/CD
.travis.yml
.circleci

# Documentation (keep only essential)
src/FLOW_DOCUMENTATION.md
src/IMPLEMENTATION_SUMMARY.md
src/PACKAGING_GUIDE.md

# Private keys (IMPORTANT!)
private_key*.pem
*.key
*.p12
*.pfx

# Test keys
private_key.txt
public_certificate.txt

# Temporary files
*.tmp
*.log
node_modules
.DS_Store
```

### 3. Update README

Add v2 section to root README:

```markdown
# myPOS Checkout SDK

## Version 2 (Recommended)

Modern, clean implementation with async/await:

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');

const result = await purchase({
  cart: [{name: 'Item', price: 50, quantity: 1}],
  customer: {email: 'user@example.com'}
});
```

See [src/README.md](src/README.md) for complete documentation.

## Version 1 (Legacy)

Callback-based implementation:

```javascript
const purchase = require('@mypos/JS-checkout-SDK');

purchase(params, (response) => {
  console.log(response);
});
```

## Migration

To migrate from v1 to v2, see [src/README.md#migration-from-v1](src/README.md#migration-from-v1).
```

---

## Building for Distribution

### 1. Pre-Publish Checklist

```bash
# 1. Run all tests
npm run test:all

# 2. Check for linting issues (if you have linter)
npm run lint

# 3. Verify package contents
npm pack --dry-run

# 4. Check package size
npm pack
# Creates: mypos-JS-checkout-SDK-1.1.0.tgz
# Check size - should be < 1MB typically
```

### 2. Test Package Locally

Before publishing, test the package:

```bash
# Create tarball
npm pack

# This creates: mypos-JS-checkout-SDK-1.1.0.tgz
```

### 3. Clean Build

Make sure no unnecessary files are included:

```bash
# Check what will be published
npm pack --dry-run

# Output shows all files that will be included
```

---

## Local Testing

### Method 1: npm link (Recommended)

**In SDK project**:
```bash
cd /path/to/mypos-js-SDK
npm link
```

**In test project**:
```bash
cd /path/to/test-project
npm link @mypos/JS-checkout-SDK
```

**Usage in test project**:
```javascript
// Test v1
const v1 = require('@mypos/JS-checkout-SDK');

// Test v2
const { purchase } = require('@mypos/JS-checkout-SDK');

const result = await purchase({
  cart: [{name: 'Test', price: 10, quantity: 1}],
  customer: {email: 'test@example.com'}
});

console.log('Success!', result.redirectUrl);
```

**Cleanup**:
```bash
# In test project
npm unlink @mypos/JS-checkout-SDK

# In SDK project
npm unlink
```

### Method 2: Local Install

**Create package**:
```bash
cd /path/to/mypos-js-SDK
npm pack
# Creates: mypos-JS-checkout-SDK-1.1.0.tgz
```

**Install in test project**:
```bash
cd /path/to/test-project
npm install /path/to/mypos-js-SDK/mypos-JS-checkout-SDK-1.1.0.tgz
```

### Method 3: File Path Install

```bash
cd /path/to/test-project
npm install file:../mypos-js-SDK
```

### Test Project Example

**File**: `test-project/package.json`
```json
{
  "name": "mypos-test",
  "version": "1.0.0",
  "dependencies": {
    "@mypos/JS-checkout-SDK": "file:../mypos-js-SDK"
  }
}
```

**File**: `test-project/test.js`
```javascript
require('dotenv').config();

async function test() {
  try {
    // Test v2
    const { purchase, refund } = require('@mypos/JS-checkout-SDK');
    
    console.log('Testing v2 purchase...');
    const result = await purchase({
      cart: [
        { name: 'Test Product', price: 10, quantity: 1 }
      ],
      customer: {
        email: 'test@example.com'
      }
    });
    
    console.log('✓ Purchase successful!');
    console.log('Redirect URL:', result.redirectUrl);
    console.log('Form length:', result.rawResponse.length);
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

test();
```

**Run test**:
```bash
cd test-project
node test.js
```

---

## Publishing to npm

### 1. Prerequisites

```bash
# 1. Create npm account (if needed)
# Visit: https://www.npmjs.com/signup

# 2. Login to npm
npm login

# 3. Verify login
npm whoami
```

### 2. Verify Package Scope

If using scoped package (`@mypos/...`):

```bash
# Check if organization exists
npm org ls @mypos

# If organization doesn't exist, use unscoped name
# Or create organization on npmjs.com
```

### 3. Version Management

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

```bash
# Bump version automatically
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Or manually edit package.json
```

### 4. Publish

```bash
# Dry run (see what would be published)
npm publish --dry-run

# Publish to npm
npm publish

# For scoped packages (first time)
npm publish --access public
```

### 5. Verify Publication

```bash
# Check on npm
npm view @mypos/JS-checkout-SDK

# Test installation
mkdir test-install
cd test-install
npm install @mypos/JS-checkout-SDK
node -e "console.log(require('@mypos/JS-checkout-SDK'))"
```

---

## Usage in Other Projects

### Installation

```bash
npm install @mypos/JS-checkout-SDK
```

### Using V2 (Recommended)

**Functional API**:
```javascript
const { purchase, refund } = require('@mypos/JS-checkout-SDK');

async function checkout() {
  const result = await purchase({
    cart: [
      { name: 'Product', price: 50, quantity: 1 }
    ],
    customer: {
      email: 'customer@example.com'
    }
  });
  
  return result.rawResponse;
}
```

**Class-Based API**:
```javascript
const { MyPOSCheckout } = require('@mypos/JS-checkout-SDK');

const checkout = new MyPOSCheckout({
  environment: 'sandbox',
  sid: process.env.MYPOS_SID,
  clientNumber: process.env.MYPOS_CLIENT_NUMBER,
  privateKey: process.env.MYPOS_PRIVATE_KEY
});

async function processPayment() {
  return await checkout.purchase({
    cart: [...],
    customer: {...}
  });
}
```

### Using V1 (Legacy)

```javascript
const purchase = require('@mypos/JS-checkout-SDK');

purchase(params, (response) => {
  console.log(response);
});
```

### Configuration in Consumer Project

**File**: `.env`
```env
MYPOS_ENVIRONMENT=sandbox
MYPOS_SID_SANDBOX=000000000000010
MYPOS_CLIENT_NUMBER_SANDBOX=61938166610
MYPOS_PRIVATE_KEY_SANDBOX=-----BEGIN RSA PRIVATE KEY-----...
```

**File**: `server.js`
```javascript
require('dotenv').config();
const express = require('express');
const { purchase } = require('@mypos/JS-checkout-SDK');

const app = express();
app.use(express.json());

app.post('/checkout', async (req, res) => {
  try {
    const result = await purchase({
      cart: req.body.cart,
      customer: req.body.customer
    });
    
    res.send(result.rawResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

---

## Version Management

### Git Tags

Tag releases in git:

```bash
# Create annotated tag
git tag -a v1.1.0 -m "Release v1.1.0 with v2 implementation"

# Push tags to remote
git push origin v1.1.0

# Or push all tags
git push --tags
```

### Changelog

Maintain a CHANGELOG.md:

```markdown
# Changelog

## [1.1.0] - 2024-01-15

### Added
- V2 implementation with modern async/await API
- All 28 checkout operations
- Comprehensive test suite
- Dual API support (functional + class-based)

### Changed
- Updated package.json exports
- Added v2 documentation

### Fixed
- Fixed typo: mandateManagment → mandateManagement

## [1.0.1] - 2023-12-01
...
```

### npm Tags

Manage distribution tags:

```bash
# Publish as latest (default)
npm publish

# Publish as beta
npm publish --tag beta

# Publish as next
npm publish --tag next

# Install specific tag
npm install @mypos/JS-checkout-SDK@beta
```

---

## Best Practices

### 1. Semantic Versioning

- **Breaking changes**: Major version (1.x.x → 2.0.0)
- **New features**: Minor version (1.0.x → 1.1.0)
- **Bug fixes**: Patch version (1.0.0 → 1.0.1)

### 2. Testing Before Publish

```bash
# Always run tests before publishing
npm run test:all

# Use prepublishOnly script
"scripts": {
  "prepublishOnly": "npm run test:all"
}
```

### 3. Documentation

- Keep README.md updated
- Document breaking changes
- Provide migration guides
- Include examples

### 4. Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check before publishing
npm run test:all && npm audit
```

### 5. File Inclusion

**Only include necessary files**:
- Source code
- README, LICENSE
- Type definitions (if any)

**Exclude**:
- Tests
- Examples (unless needed)
- Development configs
- Private keys
- .env files

### 6. Package Size

Keep package small:

```bash
# Check size
npm pack
ls -lh *.tgz

# Aim for < 1MB if possible
# Check what's included
tar -tzf mypos-JS-checkout-SDK-1.1.0.tgz
```

---

## Continuous Integration

### GitHub Actions Example

**File**: `.github/workflows/publish.yml`

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run test:all
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Automated Version Bumps

```bash
# Create release script
# File: scripts/release.sh

#!/bin/bash
set -e

echo "Running tests..."
npm run test:all

echo "Which version bump? (patch/minor/major)"
read version_type

npm version $version_type -m "Release %s"
git push && git push --tags
npm publish
```

---

## Troubleshooting

### Common Issues

#### 1. "Package already exists"

```bash
# Check existing versions
npm view @mypos/JS-checkout-SDK versions

# Bump version
npm version patch
npm publish
```

#### 2. "Access denied"

```bash
# Login again
npm logout
npm login

# Check permissions
npm owner ls @mypos/JS-checkout-SDK
```

#### 3. "Files not included"

Check `.npmignore` and `files` field in package.json:

```bash
# Test what will be published
npm pack --dry-run
```

#### 4. "Module not found" after install

Check `exports` field in package.json:

```json
"exports": {
  ".": "./src/index.js",
  "./v2": "./src/index.js"
}
```

---

## Summary

To package and distribute v2:

1. ✅ **Update package.json** with exports field
2. ✅ **Create .npmignore** to exclude unnecessary files
3. ✅ **Test locally** using npm link or npm pack
4. ✅ **Run all tests** with `npm run test:all`
5. ✅ **Bump version** following semver
6. ✅ **Publish** with `npm publish`
7. ✅ **Verify** installation in test project
8. ✅ **Tag release** in git
9. ✅ **Update documentation**

Your package is now available for installation:

```bash
npm install @mypos/JS-checkout-SDK
```

And can be used in projects:

```javascript
const { purchase } = require('@mypos/JS-checkout-SDK');
```

🎉 Happy publishing!

