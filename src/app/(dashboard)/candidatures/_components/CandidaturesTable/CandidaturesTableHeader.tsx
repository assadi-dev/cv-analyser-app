export const TABLE_GRID = "220px 1fr 110px 110px 120px 140px 80px"

export function CandidaturesTableHeader() {
  return (
    <div
      className="grid text-[11px] font-bold tracking-wide h-11 px-5 items-center border-b"
      style={{
        gridTemplateColumns: TABLE_GRID,
        borderColor: "var(--color-border)",
        background: "var(--color-surface-muted)",
        color: "var(--color-text-subtle)",
      }}
    >
      <span>Entreprise</span>
      <span>Poste</span>
      <span>Score</span>
      <span>ATS</span>
      <span>Date</span>
      <span>Statut</span>
      <span className="text-center">Actions</span>
    </div>
  )
}
