import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

/**
 * Guards a one-line convention with app-wide reach.
 *
 * Without `@custom-variant dark`, Tailwind v4 resolves `dark:` to
 * `@media (prefers-color-scheme: dark)`. Every `dark:` class carried by the
 * vendored shadcn/registry components then fires as soon as the OS is in dark
 * theme — in an app that has no dark palette at all, `body` being painted
 * light unconditionally.
 *
 * It cost us the board: `KanbanColumn` ships `dark:bg-zinc-900`, which
 * repainted the five columns in the same zinc and wiped out their colours.
 * The failure is invisible to a component test — the class is on the element
 * either way, only the compiled selector differs — so the check has to happen
 * here, on the stylesheet.
 */
const CSS = readFileSync(
  resolve(__dirname, "../../app/globals.css"),
  "utf-8"
)

describe("dark variant", () => {
  it("is bound to a class, not to the OS setting", () => {
    expect(CSS).toMatch(/@custom-variant\s+dark\s*\(/)
  })

  it("is declared before any utility can use it", () => {
    // Tailwind reads variants in source order: declared after the first rule
    // that uses `dark:`, it would silently keep the media-query fallback.
    expect(CSS.indexOf("@custom-variant dark")).toBeLessThan(
      CSS.indexOf("@theme")
    )
  })

  it("never applies, since nothing sets the class", () => {
    // The app has no dark palette to switch to. The day it gets one, `.dark`
    // goes on <html> and this expectation is the thing to revisit.
    const source = readFileSync(
      resolve(__dirname, "../../app/layout.tsx"),
      "utf-8"
    )
    expect(source).not.toMatch(/className=["'`][^"'`]*\bdark\b/)
  })
})
