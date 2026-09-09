# Octane Type - Next.js Typing Speed Test App

## Overview

Octane Type is a Next.js application that provides a typing speed test
experience for physical keyboards. The app features a modern UI with dark mode
support, animated components, and real-time typing statistics with local
session persistence.

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
│   └── page.tsx            # Home page (renders TestScreen directly)
├── features/               # Screen-level UI composition
│   ├── home/                # TestIntro, ComingSoonStrip, MobileDesktopNotice
│   ├── metrics/              # MetricsModal, charts, display
│   └── typing-test/          # TestScreen, TestPanel, TypingSurface, toolbar
├── modules/                # Domain logic (no UI)
│   ├── typing-test/          # Engine, state machine, word lists
│   ├── session/                # Persistence, aggregation, context
│   └── metrics/                 # WPM/accuracy calculations, display model
└── shared/                  # Reusable UI, layout, hooks, lib
```

### Layer boundaries

Imports flow downward only. oxlint enforces these rules:

| Layer      | Can import from      | Cannot import from    |
| ---------- | -------------------- | --------------------- |
| `app/`     | `features`, `shared` | —                     |
| `features` | `modules`, `shared`  | other `features`      |
| `modules`  | `shared` (lib only)  | `features`            |
| `shared`   | external packages    | `features`, `modules` |

## Key components

### Pages

- **Home** ([`src/app/page.tsx`](src/app/page.tsx)): The only route; renders
  `TestScreen` directly.

### Features

- `TestIntro`
  ([`src/features/home/TestIntro.tsx`](src/features/home/TestIntro.tsx)):
  Session-aware hero and overall stats toggle.
- `ComingSoonStrip`
  ([`src/features/home/ComingSoonStrip.tsx`](src/features/home/ComingSoonStrip.tsx)):
  Placeholder strip for upcoming features.
- `MobileDesktopNotice`
  ([`src/features/home/MobileDesktopNotice.tsx`](src/features/home/MobileDesktopNotice.tsx)):
  Non-interactive mobile state with a desktop-only message and a compact local
  progress summary.
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
- `TypingTestProvider`
  ([`src/features/typing-test/typing-test-react.tsx`](src/features/typing-test/typing-test-react.tsx)):
  React context bridging the state machine into components.
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
8. Desktop and laptop keyboard support

## Device support

Octane Type is designed for physical keyboards. You must use a desktop or
laptop browser to take a typing test.

On viewports below the `md` breakpoint, the typing surface and detailed
analytics are unavailable. Mobile visitors see a concise desktop-only message
and, when available, their local WPM average, accuracy, and completed-test
count. The hidden test input does not receive focus, so the mobile keyboard
does not open.

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Start dev server                 |
| `pnpm build`      | Production build                 |
| `pnpm start`      | Serve production build           |
| `pnpm test`       | Run Vitest unit tests            |
| `pnpm test:watch` | Run Vitest in watch mode         |
| `pnpm typecheck`  | TypeScript check                 |
| `pnpm lint`       | Lint with oxlint                 |
| `pnpm lint:fix`   | Lint and auto-fix with oxlint    |
| `pnpm fmt`        | Format code with oxfmt           |
| `pnpm fmt:check`  | Check formatting without writing |

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

1. On a desktop or laptop browser, users land on the home page, where a random
   passage is displayed.
2. As the user types, input is compared to the reference text in real time.
3. A countdown (default 60s) begins on the first keystroke.
4. When the timer expires or the passage is completed, metrics are shown and
   saved locally.

## Customization

- **Passages**:
  [`src/modules/typing-test/text-provider.ts`](src/modules/typing-test/text-provider.ts)
- **Timer duration**: `defaultTimer` in
  [`src/app/page.tsx`](src/app/page.tsx)
- **Styling**: Tailwind CSS and theme utilities under `src/shared/lib/`
