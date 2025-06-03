# Lexical Development Guidelines

This document provides essential information for developers working on the Lexical project. It covers build configuration, testing, and development practices specific to this project.

## Build and Configuration

### Monorepo Structure

Lexical is organized as a monorepo using npm workspaces:

- **Core package**: `packages/lexical`
- **Feature packages**: Various packages in the `packages/` directory (e.g., `lexical-react`, `lexical-list`, etc.)
- **Private packages**: Some packages are marked as private and not published to npm (e.g., `lexical-playground`, `lexical-website`)

### Build Commands

- **Build all packages**: `npm run build`
- **Production build**: `npm run build-prod`
- **Build with release codes**: `npm run build-release`
- **Clean build artifacts**: `npm run clean`
- **Build TypeScript types**: `npm run build-types`

### Package Management

- **Update package configurations**: `npm run update-packages` - Updates versions, TypeScript configs, Flow configs, and documentation
- **Prepare for release**: `npm run prepare-release` - Builds packages and prepares npm artifacts

## Testing

### Testing Infrastructure

Lexical uses multiple testing approaches:

1. **Unit Tests** (Jest):
   - Located in `packages/[package-name]/src/__tests__/unit/`
   - Run with: `npm run test-unit [pattern]`
   - Example: `npm run test-unit -- LexicalEditor` to run tests matching "LexicalEditor"

2. **Integration Tests** (Jest):
   - Located in `scripts/__tests__/integration/`
   - Run with: `npm run test-integration [pattern]`

3. **E2E Tests** (Playwright):
   - Located in `packages/lexical-playground/__tests__/`
   - Supports multiple browsers: Chromium, Firefox, WebKit
   - Run with: `npm run test-e2e-[browser]`
   - Example: `npm run test-e2e-chromium`
   - Variants for different editor modes: plain text, rich text, collaborative

### Creating a Unit Test

Here's how to create a simple unit test:

1. Create a test file in the appropriate package's `__tests__/unit/` directory
2. Use the `initializeUnitTest` helper to set up the Lexical editor environment
3. Write your test cases using Jest's `describe` and `it` functions

Example:

```typescript
import {initializeUnitTest} from 'lexical/src/__tests__/utils';

describe('My Test Suite', () => {
  // Simple test without Lexical editor
  it('should pass a simple assertion', () => {
    expect(1 + 1).toBe(2);
  });

  // Test with Lexical editor
  initializeUnitTest((testEnv) => {
    it('should initialize a Lexical editor', async () => {
      expect(testEnv.editor).toBeDefined();
      // Access the editor instance via testEnv.editor
      // Access the DOM container via testEnv.container
    });
  });
});
```

### Running Tests

- **Unit tests**: `npm run test-unit [pattern]`
- **E2E tests**: `npm run test-e2e-[browser]`
- **Debug tests**: `npm run debug-test-unit` or `npm run debug-test-e2e-[browser]`

## Development Guidelines

### Code Quality

- **Type checking**: 
  - TypeScript: `npm run tsc`
  - Flow: `npm run flow`
- **Linting**: `npm run lint`
- **Formatting**: `npm run prettier`
- **Comprehensive check**: `npm run ci-check` - Runs TypeScript, Flow, Prettier, and ESLint checks

### Creating New Packages

1. Initialize the package: `npm init -w packages/lexical-[package-name]`
2. Create the source directory: `mkdir -p packages/lexical-[package-name]/src`
3. Create the entry point: `packages/lexical-[package-name]/src/index.ts`
4. Run `npm run update-packages` to generate boilerplate configs and docs
5. Create unit tests in `packages/lexical-[package-name]/src/__tests__/unit/`

### Dependency Management

- When adding new dependencies, ensure they're compatible with the project's requirements
- Some dependencies like `prismjs` may need to be installed manually if working with code highlighting features

### Release Process

- Monthly releases with minor version increments
- Patch releases for bug fixes
- Breaking changes must be clearly marked in PR titles with `[Breaking Change]`
- Release process is managed through GitHub Actions workflows

## Additional Resources

- **Project website**: [lexical.dev](https://lexical.dev/)
- **Playground**: [playground.lexical.dev](https://playground.lexical.dev/)
- **GitHub repository**: [facebook/lexical](https://github.com/facebook/lexical)