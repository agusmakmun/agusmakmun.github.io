---
layout: post
title:  "Replacing @mui/icons-material barrel imports can halve your Vitest run time"
date:   2026-10-17 20:00:00 +0700
categories: [javascript, testing, react]
---

A Vitest suite can drop to **less than half** of its run time after one boring find-and-replace.

### Finding the cause

Vitest can report how long each import takes:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    experimental: { importDurations: true },
  },
});
```

The profile can be surprising: the vast majority of test time is spent *importing modules*, not running tests.
The top offender is often the `@mui/icons-material` barrel. The package has ~2000 icon modules, and

```ts
import { Edit, Delete } from "@mui/icons-material";
```

loads the whole index. Bundlers tree-shake it for production builds, but the test runner transforms and evaluates it,
in every test file that touches such a component. That can cost tens of seconds per affected file.

### The fix

Use per-icon paths:

```ts
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
```

Most of the codebase already did this; only some files still use the barrel. Convert those and ban the
barrel with ESLint so it can't come back:

```js
// eslint config
rules: {
  "no-restricted-imports": ["error", {
    paths: [{
      name: "@mui/icons-material",
      message: "Import icons by path: @mui/icons-material/<IconName>",
    }],
  }],
},
```

### Takeaways

- If tests are slow, profile **imports** before optimising tests.
- Barrel files (`index.ts` re-exporting everything) are cheap for bundlers and expensive for test runners and dev servers.
- When you fix a convention, add a lint rule in the same PR, or it will regress.
