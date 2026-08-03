# Octane Type - Next.js Typing Speed Test App

## Overview

Octane Type is a Next.js application that provides a typing speed test
experience. The app features a modern UI with dark mode support, animated
components, and real-time typing statistics with local session persistence.

## Tech stack

- **Next.js 16** with the App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript 7**
- **Vitest** for unit tests
- **oxlint** and **oxfmt** for linting and formatting

## Project structure

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # Home page
│   └── octane/page.tsx     # Typing test page
├── features/               # Screen-level UI composition
│   ├── home/               # HomeScreen, HeroSection
│   ├── metrics/            # MetricsModal, charts, display
│   └── typing-test/        # TestScreen, TestPanel, TypingSurface, toolbar
├── modules/                # Domain logic (no UI)
│   ├── typing-test/        # Engine, state machine, hook
│   ├── session/            # Persistence, aggregation, context
│   └── metrics/            # WPM/accuracy calculations, display model
└── shared/                 # Reusable UI, layout, hooks, lib
```

### Layer boundaries

Imports flow downward only. oxlint enforces these rules:

| Layer     | Can import from              | Cannot import from   |
| --------- | ---------------------------- | -------------------- |
| `app/`    | `features`, `shared`         | —                    |
| `features`| `modules`, `shared`          | other `features`     |
| `modules` | `shared` (lib only)          | `features`           |
| `shared`  | external packages            | `features`, `modules`|

## Key components

### Pages

- **Home** ([`src/app/page.tsx`](src/app/page.tsx)): Landing page with hero
  CTA and overall stats when a prior session exists.
- **Octane** ([`src/app/octane/page.tsx`](src/app/octane/page.tsx)): Main
  typing test page.

### Features

- `HomeScreen`
  ([`src/features/home/HomeScreen.tsx`](src/features/home/HomeScreen.tsx)):
  Home layout, session-aware hero, cumulative metrics modal.
- `TestScreen`
  ([`src/features/typing-test/TestScreen.tsx`](src/features/typing-test/TestScreen.tsx)):
  Orchestrates the typing test, timer, and results modal.
- `TestPanel`
  ([`src/features/typing-test/TestPanel.tsx`](src/features/typing-test/TestPanel.tsx)):
  Card layout combining toolbar, timer, and typing surface.
- `TypingSurface`
  ([`src/features/typing-test/TypingSurface.tsx`](src/features/typing-test/TypingSurface.tsx)):
  Live character highlighting and hidden textarea input.
- `MetricsModal` / `MetricsDisplay`: WPM, accuracy, and letter-level
  keyboard chart.

### Domain

- `typing-engine`
  ([`src/modules/typing-test/typing-engine.ts`](src/modules/typing-test/typing-engine.ts)):
  Pure word/letter accuracy and finish snapshot logic.
- `createTypingTest`
  ([`src/modules/typing-test/create-typing-test.ts`](src/modules/typing-test/create-typing-test.ts)):
  Test state machine (idle → active → finished).
- `useTypingTest`
  ([`src/modules/typing-test/use-typing-test.ts`](src/modules/typing-test/use-typing-test.ts)):
  React hook wrapping the state machine.
- `SessionProvider` / `useSession`
  ([`src/modules/session/`](src/modules/session/)): Persist last session and
  cumulative stats in localStorage.
- `resolveMetricsDisplay`
  ([`src/modules/metrics/resolve-display.ts`](src/modules/metrics/resolve-display.ts)):
  Live vs cumulative metrics display policy.

### UI

- `ThemeProvider` + `ThemeToggle`: dark mode via `next-themes`.
- `AppShell` + `AmbientBackground`: shared page layout.

## Features

1. Animated UI elements for an engaging user experience
2. Dark mode support
3. Real-time typing feedback with character highlighting
4. Countdown timer (starts on first keystroke)
5. WPM and accuracy calculation
6. Letter-level accuracy keyboard visualization
7. Local cumulative stats across tests
8. Responsive design

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start dev server                   |
| `pnpm build`       | Production build                   |
| `pnpm start`       | Serve production build             |
| `pnpm test`        | Run Vitest unit tests              |
| `pnpm test:watch`  | Run Vitest in watch mode           |
| `pnpm typecheck`   | TypeScript check                   |
| `pnpm lint`        | Lint with oxlint                   |
| `pnpm lint:fix`    | Lint and auto-fix with oxlint      |
| `pnpm fmt`         | Format code with oxfmt             |
| `pnpm fmt:check`   | Check formatting without writing   |

Lint and format config live in [`.oxlintrc.json`](.oxlintrc.json) and
[`.oxfmtrc.json`](.oxfmtrc.json).

## Testing

Unit tests use Vitest with a Node environment. Test files are colocated with
source as `*.test.ts` or `*.spec.ts` under `src/`.

```bash
pnpm test
```

Current coverage focuses on domain logic:

- `src/modules/typing-test/create-typing-test.test.ts`
- `src/modules/metrics/resolve-display.test.ts`
- `src/modules/session/session-store.test.ts`
- `src/features/typing-test/typing-surface-utils.test.ts`

## How it works

1. Users start on the home page and click the CTA to begin.
2. They are taken to `/octane` where a random passage is displayed.
3. As the user types, input is compared to the reference text in real time.
4. A countdown (default 60s) begins on the first keystroke.
5. When the timer expires or the passage is completed, metrics are shown and
   saved locally.

## Customization

- **Passages**:
  [`src/modules/typing-test/text-provider.ts`](src/modules/typing-test/text-provider.ts)
- **Timer duration**: `defaultTimer` in
  [`src/app/octane/page.tsx`](src/app/octane/page.tsx)
- **Styling**: Tailwind CSS and theme utilities under `src/shared/lib/`
