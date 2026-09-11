# Octane Type

Octane Type is a browser-based typing test for physical keyboards. Take a test
at [octane-type.vercel.app](https://octane-type.vercel.app/). You don't need to
clone this repository or run the project locally.

## About

Open the site on a desktop or laptop with a physical keyboard, then type the
displayed passage. The 60-second countdown starts with your first keystroke.
When the test ends, you get your words per minute (WPM), accuracy, and a
letter-by-letter view of your results.

Your cumulative results stay in that browser on that device.

## Features

The test keeps the interface simple and focuses on the essentials.

- Type what you see and get immediate feedback on each character
- See WPM, accuracy, and letter-level accuracy when the test ends
- Keep cumulative stats in local browser storage
- Switch between light and dark themes

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

## Feedback and contributions

Found a bug or have an idea for Octane Type? [Open an
issue](https://github.com/mr-srivastava/typing-speedtest/issues). To contribute
code, follow the local setup steps above and include the relevant checks with
your change.

## Project structure

The app keeps routes, screen-level UI, and domain logic in separate layers.

```text
src/
├── app/       # Next.js routes
├── features/  # Screen-level UI composition
├── modules/   # Typing test, session, and metrics logic
└── shared/    # Reusable UI and utilities
```
