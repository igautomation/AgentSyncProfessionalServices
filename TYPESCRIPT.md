# TypeScript Support for AgentSync Professional Services

This package now includes TypeScript declarations to improve developer experience when using the framework with TypeScript projects.

## Usage

The TypeScript declarations are automatically included when you install the package. No additional steps are required to use them.

## Declaration File

The declaration file (`src/index.d.ts`) provides type definitions for the main module exports and all submodules exported in the package.json.

## Alternative Solution

If you're still experiencing TypeScript errors, you can also create a declaration file in your project:

1. Create a file named `agentsync.d.ts` in your project's source directory
2. Add the following content:

```typescript
declare module '@igautomation/agentsyncprofessionalservices';
declare module '@igautomation/agentsyncprofessionalservices/*';
```

3. Make sure this file is included in your TypeScript compilation by adding it to the `include` section of your `tsconfig.json`:

```json
{
  "include": [
    "src/**/*.ts",
    "agentsync.d.ts"
  ]
}
```

## Issues

If you encounter any issues with the TypeScript declarations, please report them to the framework maintainers.