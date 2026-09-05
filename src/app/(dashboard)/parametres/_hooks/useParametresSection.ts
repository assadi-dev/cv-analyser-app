"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import type { SettingsSectionId } from "../_types"

const SECTIONS = ["profile", "cvs", "ai", "platforms", "data"] as const

export function useParametresSection() {
  const [section, setSection] = useQueryState(
    "section",
    parseAsStringLiteral(SECTIONS).withDefault("profile")
  )

  return {
    section: section as SettingsSectionId,
    setSection: (value: SettingsSectionId) => setSection(value),
  }
}
