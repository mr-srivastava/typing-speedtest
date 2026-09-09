# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

```bash
pnpm dev             # start dev server (http://localhost:3000)
pnpm build           # production build
pnpm typecheck       # tsc --noEmit
pnpm lint            # oxlint .
pnpm lint:fix        # oxlint . --fix
pnpm format          # oxfmt
pnpm format:check    # oxfmt --check
pnpm test            # vitest run (all tests, once)
pnpm test:watch      # vitest watch mode
```

Run a single test file: `pnpm test src/modules/typing-test/scoring.test.ts` (or `pnpm test:watch <path>` to iterate). Vitest runs in a `node` environment with the `@` alias resolved to `src/`.

## Architecture

Octane Type is a Next.js 16 (App Router) + React 19 typing speed test. The codebase is organized into three strictly layered directories under `src/`, enforced by `oxlint`'s `no-restricted-imports` rule (see `.oxlintrc.json`):

```
app/       Next.js routes only, thin, delegates to features
features/  Screen-level UI composition (one feature must not import another feature)
modules/   Domain logic, no UI (typing-test engine, session persistence, metrics)
shared/    Reusable UI/layout/lib, no upward imports
```

Import direction is one-way: `app → features → modules → shared`. `modules/` may only import from `shared/lib`; `shared/` may not import from `features/` or `modules/` at all. This fails lint, not just review, so check `.oxlintrc.json` overrides before adding a new cross-layer import.

There is a single route (`src/app/page.tsx`) that renders `TestScreen` directly. There is no separate `/octane` page anymore (older docs or history may still reference one; it got folded into the home page).

### Device support

Octane Type is a physical-keyboard typing test. Keep the test available only at
the `md` breakpoint and above unless the user explicitly changes that product
decision.

- Below `md`, `TestScreen` renders `MobileDesktopNotice` instead of the
  interactive test surface and detailed metrics.
- Mobile may show only the compact local progress summary: WPM average,
  accuracy, and completed-test count.
- Don't autofocus the hidden typing input on mobile. `TypingSurface` checks
  that its input is visible before it moves focus, which prevents the software
  keyboard from opening.

### Typing test core

The test itself is a state machine, not ad-hoc React state:

- `src/modules/typing-test/create-typing-test.ts` is the pure state machine (`idle → active → finished`) and the source of truth for test phase transitions.
- `src/modules/typing-test/typing-test-machine.ts` is an xstate wrapper around it.
- `src/features/typing-test/typing-test-react.tsx` is the React context/provider (`TypingTestProvider`, `useTypingTestActions`, `useTypingTestAnalytics`) that bridges the machine into components. `TestScreen.tsx` composes this provider with `TestPanel` (toolbar, timer, `TypingSurface`) and the results flow.
- `src/modules/typing-test/analytics.ts` derives live WPM/analytics while typing.
- `src/modules/typing-test/scoring.ts` / `result.ts` turn a finished snapshot into a `TypingTestResult`.
- `src/modules/typing-test/index.ts` is the module's public surface. Prefer importing from there over deep-importing individual files.

### Session & metrics

- `src/modules/session/` persists the last test and cumulative stats. `session-provider.tsx` + `use-session.ts` expose `useSession()`; storage sits behind an adapter interface (`adapters/local-storage.ts`, `adapters/in-memory.ts` for tests).
- `src/modules/metrics/build-test-session.ts` converts a finished typing-test snapshot into the session record. `resolve-display.ts` decides live-vs-cumulative metrics display policy.
- `src/features/metrics/` renders these as `MetricsModal`/`MetricsDisplay`/charts (Recharts-based, lazy-loaded via `next/dynamic` in `TestScreen.tsx` since the modal isn't needed on first paint).

### Word lists / reference text

`src/modules/typing-test/word-lists/` holds per-language word lists (`english.json` + loader); `text-provider.ts` and `generate-reference-text.ts` build the passage shown to the user.

## Testing

Tests are colocated with source as `*.test.ts`/`*.spec.ts`. Coverage is concentrated in `modules/` domain logic and a few `features/*-utils.ts` helpers; UI components themselves are not unit tested.
