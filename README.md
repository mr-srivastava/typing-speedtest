# Octane Type - Next.js Typing Speed Test App

## Overview

Octane Type is a Next.js application that provides a typing speed test experience. The app features a modern UI with dark mode support, animated components, and real-time typing statistics with local session persistence.

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # Home page
│   └── octane/page.tsx     # Typing test page
├── features/               # Screen-level UI composition
│   ├── home/               # HomeScreen, HeroSection
│   ├── metrics/            # MetricsModal, charts, display
│   └── typing-test/        # TestScreen, TypingSurface, toolbar
├── modules/                # Domain logic (no UI)
│   ├── typing-test/        # Engine, state machine, hook
│   ├── session/            # Persistence, aggregation, context
│   └── metrics/            # WPM/accuracy calculations, display model
└── shared/                 # Reusable UI, layout, hooks, lib
```

## Key Components

### Pages

- **Home** ([`src/app/page.tsx`](src/app/page.tsx)): Landing page with hero CTA and overall stats when a prior session exists.
- **Octane** ([`src/app/octane/page.tsx`](src/app/octane/page.tsx)): Main typing test page.

### Features

- `HomeScreen` ([`src/features/home/HomeScreen.tsx`](src/features/home/HomeScreen.tsx)): Home layout, session-aware hero, cumulative metrics modal.
- `TestScreen` ([`src/features/typing-test/TestScreen.tsx`](src/features/typing-test/TestScreen.tsx)): Orchestrates the typing test, timer, and results modal.
- `TypingSurface` ([`src/features/typing-test/TypingSurface.tsx`](src/features/typing-test/TypingSurface.tsx)): Live character highlighting and hidden textarea input.
- `MetricsModal` / `MetricsDisplay`: WPM, accuracy, and letter-level keyboard chart.

### Domain

- `typing-engine` ([`src/modules/typing-test/typing-engine.ts`](src/modules/typing-test/typing-engine.ts)): Pure word/letter accuracy and finish snapshot logic.
- `createTypingTest` ([`src/modules/typing-test/create-typing-test.ts`](src/modules/typing-test/create-typing-test.ts)): Test state machine (idle → active → finished).
- `useTypingTest` ([`src/modules/typing-test/use-typing-test.ts`](src/modules/typing-test/use-typing-test.ts)): React hook wrapping the state machine.
- `SessionProvider` / `useSession` ([`src/modules/session/`](src/modules/session/)): Persist last session and cumulative stats in localStorage.
- `resolveMetricsDisplay` ([`src/modules/metrics/resolve-display.ts`](src/modules/metrics/resolve-display.ts)): Live vs cumulative metrics display policy.

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

## Scripts

| Command          | Description           |
| ---------------- | --------------------- |
| `pnpm dev`       | Start dev server      |
| `pnpm build`     | Production build      |
| `pnpm test`      | Run Vitest unit tests |
| `pnpm typecheck` | TypeScript check      |
| `pnpm lint`      | ESLint                |

## How It Works

1. Users start on the home page and click the CTA to begin.
2. They are taken to `/octane` where a random passage is displayed.
3. As the user types, input is compared to the reference text in real time.
4. A countdown (default 60s) begins on the first keystroke.
5. When the timer expires or the passage is completed, metrics are shown and saved locally.

## Customization

- **Passages**: [`src/modules/typing-test/text-provider.ts`](src/modules/typing-test/text-provider.ts)
- **Timer duration**: `defaultTimer` in [`src/app/octane/page.tsx`](src/app/octane/page.tsx)
- **Styling**: Tailwind CSS and theme utilities under `src/shared/lib/`
