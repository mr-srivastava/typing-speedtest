/** Non-fatal warnings (e.g. localStorage). Suppressed in production. */
export function logWarning(message: string, error?: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  /* eslint-disable no-console -- intentional dev-only logging */
  if (error !== undefined) {
    console.warn(message, error);
  } else {
    console.warn(message);
  }
  /* eslint-enable no-console */
}
