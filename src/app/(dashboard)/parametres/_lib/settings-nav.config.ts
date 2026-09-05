import { User, FileText, Cpu, Layers, Shield, type LucideIcon } from "lucide-react"
import type { SettingsSectionId } from "../_types"

export interface SettingsNavItem {
  id: SettingsSectionId
  label: string
  icon: LucideIcon
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "cvs", label: "Mes CV", icon: FileText },
  { id: "ai", label: "IA & Providers", icon: Cpu },
  { id: "platforms", label: "Plateformes favorites", icon: Layers },
  { id: "data", label: "Données & Confidentialité", icon: Shield },
]
