import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import BoardView from "@/app/(dashboard)/dashboard/_components/Board/BoardView"
import {
  MOCK_BOARD,
  EMPTY_BOARD,
} from "@/app/(dashboard)/dashboard/_lib/kanban.mock"

describe("BoardView", () => {
  it("renders every column, including the empty ones", () => {
    render(<BoardView columns={MOCK_BOARD} />)
    for (const label of ["À envoyer", "Envoyée", "Entretien", "Refusée", "Acceptée"]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it("places each card in its own column", () => {
    render(<BoardView columns={MOCK_BOARD} />)
    expect(screen.getByText("Datameid")).toBeInTheDocument()
    expect(screen.getByText("Qonto")).toBeInTheDocument()
    expect(screen.getByText("Payfit")).toBeInTheDocument()
  })

  it("shows a drop hint where a column is empty", () => {
    render(<BoardView columns={MOCK_BOARD} />)
    // Two empty columns in the fixture: rejected and accepted.
    expect(screen.getAllByText("Déposez une candidature ici")).toHaveLength(2)
  })

  it("keeps all five columns droppable on an empty board", () => {
    render(<BoardView columns={EMPTY_BOARD} />)
    expect(screen.getAllByText("Déposez une candidature ici")).toHaveLength(5)
  })

  it("counts the cards of each column", () => {
    render(<BoardView columns={MOCK_BOARD} />)
    const heading = screen.getByText("À envoyer").parentElement
    expect(within(heading as HTMLElement).getByText("3")).toBeInTheDocument()
  })

  it("gives every card its own drag handle", () => {
    render(<BoardView columns={MOCK_BOARD} />)
    // 6 cards in the fixture, each with a labelled handle.
    expect(screen.getAllByLabelText(/^Déplacer la candidature/)).toHaveLength(6)
  })

  it("wires the drag listeners onto the handle", () => {
    /**
     * The regression this catches: KanbanItem only attaches dnd-kit's
     * listeners to itself when `asHandle` is set — otherwise they live on the
     * handle alone. A handle that is missing, hidden or wrongly nested leaves
     * the card looking draggable while nothing happens on drag.
     *
     * `aria-roledescription="sortable"` is set by useSortable's attributes,
     * so its presence proves the wiring reached the DOM.
     */
    render(<BoardView columns={MOCK_BOARD} />)
    const handle = screen.getByLabelText("Déplacer la candidature Datameid")
    expect(handle).toHaveAttribute("aria-roledescription", "sortable")
    expect(handle).toHaveAttribute("tabindex", "0")
  })

  it("keeps the handle usable without hovering the card", () => {
    /**
     * A handle revealed only on hover reads as "drag and drop is broken":
     * there is nothing to grab until the pointer is already on the card, and
     * it never appears at all on touch.
     */
    render(<BoardView columns={MOCK_BOARD} />)
    const handle = screen.getByLabelText("Déplacer la candidature Datameid")
    expect(handle.className).not.toMatch(/opacity-0/)
  })

  it("separates clicking from dragging", () => {
    /**
     * The "Revoir" button lives inside a draggable card. Without a dedicated
     * handle, dnd-kit would claim the pointer and the click would never fire.
     */
    const onOpenCard = vi.fn()
    render(<BoardView columns={MOCK_BOARD} onOpenCard={onOpenCard} />)

    screen
      .getByRole("button", { name: "Revoir la candidature Datameid" })
      .click()

    expect(onOpenCard).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111101"
    )
  })

  it("gives each column its own surface", () => {
    /**
     * Dice UI's column ships `bg-zinc-100 dark:bg-zinc-900` and a bare
     * `border`. tailwind-merge drops the light background in favour of ours,
     * but only because the palette class is actually there — lose it and the
     * five columns silently fall back to the same zinc.
     */
    const { container } = render(<BoardView columns={MOCK_BOARD} />)
    const surfaces = Array.from(
      container.querySelectorAll('[data-slot="kanban-column"]')
    ).map(
      (column) =>
        Array.from(column.classList).find((name) =>
          name.startsWith("bg-kanban-")
        ) ?? null
    )

    expect(surfaces).toHaveLength(5)
    expect(surfaces).not.toContain(null)
    expect(new Set(surfaces).size).toBe(5)
  })

  it("leaves no dark background for the column to fall back on", () => {
    /**
     * The colours have to survive the `dark` variant compiling either way.
     * globals.css binds it to a class nobody sets, but that is a stylesheet
     * fix — and a stale build cache has already been caught serving an older
     * compilation of it. Declaring our own `dark:` background makes
     * tailwind-merge strip `dark:bg-zinc-900` from the markup, which no build
     * cache can undo.
     */
    const { container } = render(<BoardView columns={MOCK_BOARD} />)
    for (const column of container.querySelectorAll(
      '[data-slot="kanban-column"]'
    )) {
      expect(column.className).not.toMatch(/dark:bg-zinc/)
      expect(column.className).toMatch(/dark:bg-kanban-/)
    }
  })

  it("neutralises the border colour the component leaves at currentColor", () => {
    /**
     * `border` alone is a width: Tailwind v4's preflight resets borders to
     * `0 solid`, so the colour falls through to `currentColor` — a near-black
     * outline around every column, which the design never had.
     */
    const { container } = render(<BoardView columns={MOCK_BOARD} />)
    for (const column of container.querySelectorAll(
      '[data-slot="kanban-column"]'
    )) {
      expect(column.classList).toContain("border-transparent")
    }
  })

  it("re-syncs when the server sends a new board", () => {
    const { rerender } = render(<BoardView columns={MOCK_BOARD} />)
    expect(screen.getByText("Datameid")).toBeInTheDocument()

    rerender(<BoardView columns={EMPTY_BOARD} />)
    expect(screen.queryByText("Datameid")).not.toBeInTheDocument()
  })
})
