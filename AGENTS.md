# Repository Guidelines

## Project Structure

This repository is a single Vite + React application organized by responsibility:

- `src/app`: application bootstrap, providers, router, and global styles
- `src/routes`: thin TanStack Router file-route definitions
- `src/layouts`: page shells shared by routes
- `src/features`: domain-oriented API, model, query, component, and page code
- `src/pages`: standalone pages that do not belong to a feature package
- `src/shared`: feature-independent API infrastructure, configuration, UI, and utilities
- `src/stores`: Zustand client state
- `src/mocks`: MSW handlers, fixtures, and mock response helpers
- `src/test`: cross-cutting Vitest setup and tooling tests
- `e2e`: Playwright browser journeys

Start with `docs/README.md` for the documentation reading order. Check
`docs/feature-addition-checklist.md` before completing a feature.

## Build, Test, and Development Commands

Use `mise` or the equivalent pnpm scripts:

- `mise run dev`: generate routes and start the Vite development server
- `mise run test`: run the Vitest suite
- `mise run coverage`: run Vitest with enforced coverage thresholds
- `mise run test-e2e`: run Playwright end-to-end tests
- `mise run build-storybook`: build the Storybook catalog
- `mise run validate`: run typecheck, lint, format check, coverage tests, and build
- `mise run verify`: run validate, Storybook build, and Playwright E2E

Use the narrowest focused test during development, then run `pnpm validate`.
Run `pnpm verify` before handing off a change that can affect browser behavior,
Storybook, routing, or the full template workflow.

## Coding Style and Dependency Boundaries

Use TypeScript with 2-space indentation and Prettier formatting. Prefer `@/`
imports for source modules. Keep route files thin and place feature behavior under
`src/features/<feature>`.

Leave exactly one blank line after an import block. ESLint checks and fixes this
spacing; generated route and worker files remain excluded.

ESLint enforces these minimum dependency directions:

- `src/shared` cannot depend on application, route, page, layout, or feature code.
- feature `api`, `model`, and `queries` code cannot depend on application UI or
  global stores.
- feature components and pages may consume stores when the state is genuinely
  client-side UI state.

Use TanStack Query for server state, Zustand for client UI/auth/toast state,
React Hook Form for forms, and Zod at input and API response boundaries.

## Testing Guidelines

Use Vitest and Testing Library for unit, component, and MSW-backed integration
tests. Use Playwright for browser journeys. Name tests `*.test.ts` or
`*.test.tsx`; E2E files use `*.e2e.ts`.

- Test behavior through accessible roles, labels, and visible outcomes.
- Exercise feature API functions through real `fetch` calls intercepted by MSW.
- Add a failing test before implementing behavior changes.
- Add or update a Storybook story when shared UI or reusable visual components
  change.
- Preserve coverage thresholds unless a measured and documented reason requires a
  separate change.

## Generated Files and Outputs

Do not manually edit `src/routeTree.gen.ts` or `public/mockServiceWorker.js`.
Regenerate them with the project scripts. Do not lint, format, review, or commit
generated output directories such as `dist/`, `coverage/`, `storybook-static/`,
`playwright-report/`, and `test-results/`.

## Commit and Pull Request Guidelines

Recent history uses Conventional Commits such as `feat:`, `fix:`, `test:`,
`docs:`, `build:`, `ci:`, and `chore:`. Keep each commit focused. Pull requests
should explain what changed and why, list verification evidence, and include
screenshots or Storybook/route details for user-visible changes.
