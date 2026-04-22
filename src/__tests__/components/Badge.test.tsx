import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Badge, ScoreBadge, StatusBadge } from "@/components/ui/Badge"

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hello</Badge>)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("renders with dot when dot=true", () => {
    const { container } = render(<Badge dot variant="success">Active</Badge>)
    const dot = container.querySelector("span > span")
    expect(dot).toBeInTheDocument()
  })
})

describe("ScoreBadge", () => {
  it("renders success for score >= 80", () => {
    const { container } = render(<ScoreBadge score={85} />)
    expect(screen.getByText("85%")).toBeInTheDocument()
  })

  it("renders warning for score 60-79", () => {
    render(<ScoreBadge score={72} />)
    expect(screen.getByText("72%")).toBeInTheDocument()
  })

  it("renders neutral for score < 60", () => {
    render(<ScoreBadge score={45} />)
    expect(screen.getByText("45%")).toBeInTheDocument()
  })
})

describe("StatusBadge", () => {
  it("renders correct label for each status", () => {
    const cases = [
      ["to_send",   "À envoyer"],
      ["sent",      "Envoyée"],
      ["interview", "Entretien"],
      ["rejected",  "Refusée"],
      ["accepted",  "Acceptée"],
    ] as const

    for (const [status, label] of cases) {
      const { unmount } = render(<StatusBadge status={status} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    }
  })
})
