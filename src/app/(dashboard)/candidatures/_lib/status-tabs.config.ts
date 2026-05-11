import type { StatusTab } from "../_types"

export const STATUS_TABS: StatusTab[] = [
  { value: "all",       label: "Toutes" },
  { value: "to_send",   label: "À envoyer" },
  { value: "sent",      label: "Envoyée" },
  { value: "interview", label: "Entretien" },
  { value: "accepted",  label: "Acceptée" },
]
