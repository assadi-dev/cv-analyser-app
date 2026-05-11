export function KanbanColumnSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2].map((i) => (
        <div key={i} className="h-[70px] rounded-[10px] bg-white/60 animate-pulse" />
      ))}
    </div>
  )
}
