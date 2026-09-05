interface ProviderBadgeProps {
  label: string
  color: string
  size?: "sm" | "md"
}

const SIZES = {
  sm: "w-[26px] h-[26px] rounded-[6px] text-[10px]",
  md: "w-10 h-10 rounded-[10px] text-[14px]",
}

export function ProviderBadge({ label, color, size = "sm" }: ProviderBadgeProps) {
  return (
    <div
      className={`${SIZES[size]} flex items-center justify-center shrink-0 font-black text-white`}
      style={{ background: color }}
    >
      {label.slice(0, 2)}
    </div>
  )
}
