# Octane Type - Next.js Typing Speed Test App

## Overview

Octane Type is a Next.js application that provides a typing speed test experience. The app features a modern UI with dark mode support, animated components, and real-time typing statistics with local session persistence.

## Key Components

### Pages

- `Home` ([`src/app/page.tsx`](src/app/page.tsx)): Landing page with hero CTA and overall stats when a prior session exists.
- `Octane` ([`src/app/octane/page.tsx`](src/app/octane/page.tsx)): Main typing test page.

### Screens & sections

- `HomeScreen` ([`src/screens/HomeScreen.tsx`](src/screens/HomeScreen.tsx)): Home layout, session-aware hero, cumulative metrics modal.
- `TestScreen` ([`src/screens/TestScreen.tsx`](src/screens/TestScreen.tsx)): Orchestrates the typing test, timer, and results modal.
- `HeroSection`, `TypingSection`, `TestControlSection` under [`src/sections/`](src/sections/).

### Domain & hooks

- `typing-engine` ([`src/lib/typing-engine.ts`](src/lib/typing-engine.ts)): Pure word/letter accuracy and finish snapshot logic.
- `metrics-utils` ([`src/lib/metrics-utils.ts`](src/lib/metrics-utils.ts)): WPM/accuracy helpers and session building.
- `useTypingTest` ([`src/hooks/complex/useTypingTest.ts`](src/hooks/complex/useTypingTest.ts)): Test state orchestration.
- `useSessionStorage` / `SessionProvider` ([`src/hooks/complex/useSession.ts`](src/hooks/complex/useSession.ts), [`src/contexts/SessionContext.tsx`](src/contexts/SessionContext.tsx)): Persist last session and cumulative stats in localStorage.

### UI highlights

- `TypingTestInterface` / `TextPreview` / `TypingInput`: live feedback while typing.
- `MetricsModal` / `MetricsDisplay`: WPM, accuracy, and letter-level charts.
- `ThemeProvider` + `ThemeToggle`: dark mode via `next-themes`.

## Features

1. Animated UI elements for an engaging user experience
2. Dark mode support
3. Real-time typing feedback with character highlighting
4. Countdown timer
5. Calculation of typing speed (WPM) and accuracy
6. Letter-level accuracy keyboard visualization
7. Local cumulative stats across tests
8. Responsive design for various screen sizes

## Setup and Configuration

The project uses Next.js with TypeScript and Tailwind CSS. UI libraries include:

- `@radix-ui` for UI primitives
- `class-variance-authority` for managing component variants
- `framer-motion` for animations
- `next-themes` for theme management
- `recharts` for radial and pie charts

```bash
pnpm install
pnpm dev
```

## How It Works

1. Users start on the home page and click the CTA to begin.
2. They are taken to `/octane` where a random passage is displayed.
3. As the user types, input is compared to the reference text in real time.
4. A countdown (default 60s) begins on the first keystroke.
5. When the timer expires or the passage is completed, metrics are shown and saved locally.

## Customization

- Passages: [`src/lib/text.ts`](src/lib/text.ts)
- Timer duration: `defaultTimer` in [`src/app/octane/page.tsx`](src/app/octane/page.tsx) or `TestScreen`
- Styling: Tailwind config and theme utilities under `src/lib/`
