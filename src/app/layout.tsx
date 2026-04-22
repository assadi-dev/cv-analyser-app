import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "MatchCV", template: "%s | MatchCV" },
  description: "Analysez la compatibilité de votre CV avec chaque offre d'emploi.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
