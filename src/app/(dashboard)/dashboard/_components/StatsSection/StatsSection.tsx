import { FolderOpen, Send, CalendarCheck, Star } from "lucide-react"
import { StatsCard } from "./StatsCard"
import type { DashboardStats } from "../../_types"

interface StatsSectionProps {
  stats: DashboardStats
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={FolderOpen}
        label="Offres enregistrées"
        value={stats.total}
        sub="offres analysées"
        iconBg="var(--color-primary-light)"
        iconColor="var(--color-primary)"
      />
      <StatsCard
        icon={Send}
        label="Candidatures envoyées"
        value={stats.sent}
        sub={`sur ${stats.total} offres`}
        iconBg="var(--color-info-light)"
        iconColor="var(--color-info-text)"
      />
      <StatsCard
        icon={CalendarCheck}
        label="Entretiens obtenus"
        value={stats.interview}
        sub="en cours"
        iconBg="var(--color-success-light)"
        iconColor="var(--color-success-text)"
      />
      <StatsCard
        icon={Star}
        label="Score moyen"
        value="—"
        sub="de compatibilité"
        iconBg="var(--color-warning-light)"
        iconColor="var(--color-warning-text)"
      />
    </div>
  )
}
