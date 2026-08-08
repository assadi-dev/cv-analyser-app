import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "sonner"
import { QueryProvider } from "@/components/providers/QueryProvider"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"

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
        <Toaster richColors position="bottom-right" />
        <TooltipProvider>
          <NuqsAdapter>
            <QueryProvider>
              {children}
            </QueryProvider>
          </NuqsAdapter>
        </TooltipProvider>
      </body>
    </html>
  )
}
