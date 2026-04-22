/**
 * Vitest global setup — runs before every test file.
 *
 * Extends Vitest's expect with @testing-library/jest-dom matchers:
 * toBeInTheDocument(), toHaveClass(), toHaveValue(), etc.
 */
import "@testing-library/jest-dom/vitest"
