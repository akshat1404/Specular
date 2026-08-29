import { defineConfig } from "vitest/config";

/**
 * Several test files drive a real Playwright browser (sample.test.ts,
 * pipeline.test.ts, sample-accessibility.test.ts, audit.test.ts,
 * summary-render.test.ts) and run fine well within Vitest's 10s default
 * hook/test timeout in isolation, but `vitest run`'s default parallel-file
 * execution launches several of these browsers concurrently — under that
 * contention, a `beforeAll` browser launch can genuinely take longer than
 * 10s. Per-hook timeout overrides (`beforeAll(fn, timeout)`) didn't
 * reliably apply under this contention either, so this raises the timeout
 * globally instead of fighting that per test file.
 */
export default defineConfig({
  test: {
    hookTimeout: 60_000,
    testTimeout: 60_000,
  },
});
