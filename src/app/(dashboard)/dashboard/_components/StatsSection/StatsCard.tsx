import { Card } from "@/components/ui/Card"

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  iconBg: string
  iconColor: string
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  iconColor,
}: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>

      <span
        className="text-[30px] font-black"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </span>

      {sub && (
        <span
          className="text-[11px]"
          style={{
            color: sub.includes("cours")
              ? "var(--color-success-text)"
              : "var(--color-text-subtle)",
          }}
        >
          {sub}
        </span>
      )}
    </Card>
  )
}
