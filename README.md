# Octane Type

Take the typing test at [Octane Type](https://octane-type.vercel.app/). Open
the site in your browser. You don't need to clone this repository or run it
locally.

## Take the test

Open [octane-type.vercel.app](https://octane-type.vercel.app/) on a desktop or
laptop with a physical keyboard. Start typing the displayed passage to begin
the 60-second countdown. When the test ends, Octane Type shows your words per
minute (WPM), accuracy, and letter-level keyboard results.

Your cumulative results stay in that browser on that device.

## Features

Here's what the test tracks:

- Real-time character feedback while you type
- A 60-second test that starts on your first keystroke
- WPM, accuracy, and letter-level accuracy results
- Local cumulative statistics across completed tests
- Light and dark themes

## Device support

Use a desktop or laptop with a physical keyboard. On smaller screens, you can
see your local progress summary, but you can't take a test or view the detailed
analytics.

## Develop locally

Only set up the project locally if you're contributing or running it from
source. It requires Node.js 24 and pnpm 11.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open [localhost:3000](http://localhost:3000) in your browser.

## Development commands

Use these commands when working on the project locally.

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start the development server            |
| `pnpm build`        | Create a production build               |
| `pnpm start`        | Serve the production build              |
| `pnpm test`         | Run unit tests                          |
| `pnpm test:watch`   | Run unit tests in watch mode            |
| `pnpm typecheck`    | Run the TypeScript type check           |
| `pnpm lint`         | Lint the project with oxlint            |
| `pnpm lint:fix`     | Lint and fix supported issues           |
| `pnpm format`       | Format the project with oxfmt           |
| `pnpm format:check` | Check formatting without changing files |

## Project structure

The app keeps routes, screen-level UI, and domain logic in separate layers.

```text
src/
├── app/       # Next.js routes
├── features/  # Screen-level UI composition
├── modules/   # Typing test, session, and metrics logic
└── shared/    # Reusable UI and utilities
```
