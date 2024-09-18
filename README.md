# Octane Type - Next.js Typing Speed Test App

## Overview

Octane Type is a Next.js application that provides a typing speed test experience. The app features a modern UI with dark mode support, animated components, and real-time typing statistics.

## Key Components

### Pages

- `Home` (`src/app/page.tsx`): The landing page with an animated background and a call-to-action button to start the typing test.
- `Octane` (`src/app/octane/page.tsx`): The main typing test page where users can take the test and view their results.

### UI Components

- `Header` (`src/components/header.tsx`): Displays the app logo and a timer.
- `Preview` (`src/components/preview.tsx`): Shows the text to be typed with real-time highlighting.
- `TypingStats` (`src/components/stats.tsx`): Displays typing statistics after the test is completed.
- `Clock` (`src/components/clock.tsx`): A countdown timer component.
- `BackgroundBeams` (`src/components/ui/background-beams.tsx`): Creates an animated background effect.
- `Button` (`src/components/ui/moving-border.tsx`): A custom button component with animated borders.

### Utilities

- `getText` (`src/lib/text.ts`): Provides random text passages for the typing test.
- `utils` (`src/lib/utils.ts`): Contains utility functions for styling and class name management.

## Features

1. Animated UI elements for an engaging user experience
2. Dark mode support
3. Real-time typing feedback with character highlighting
4. Countdown timer
5. Calculation of typing speed (WPM) and accuracy
6. Responsive design for various screen sizes

## Setup and Configuration

The project uses Next.js 14 with TypeScript and Tailwind CSS for styling. It also incorporates various UI libraries and animation frameworks:

- `@radix-ui` for UI primitives
- `class-variance-authority` for managing component variants
- `framer-motion` for animations
- `next-themes` for theme management

## How It Works

1. Users start on the home page and click the "Think You're Fast? Prove It!" button.
2. They are taken to the Octane page where a random text is displayed.
3. As the user types, their input is compared to the original text in real-time.
4. A 60-second countdown begins when the user starts typing.
5. After completion or when the timer runs out, typing statistics are displayed.

## Customization

The app can be easily customized by modifying the text passages in `getText`, adjusting the styling in the Tailwind configuration, or changing the timer duration in the `Octane` component.
