export function CandidaturesTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 border-b animate-pulse"
          style={{
            borderColor: "var(--color-border-muted)",
            background: i % 2 ? "var(--color-surface-muted)" : "white",
          }}
        />
      ))}
    </>
  )
}
