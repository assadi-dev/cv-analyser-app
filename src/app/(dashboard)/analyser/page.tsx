import { AnalyserClientProvider } from "./_components/AnalyseClientProvider"
import { AnalyserClient } from "./_components/AnalyserClient"
export const dynamic = 'force-dynamic'

interface AnalyserPageProps {
  searchParams: Promise<{ conversation_id?: string; analyse_id?: string }>
}
export default async function AnalyserPage({ searchParams }: AnalyserPageProps) {
  const { conversation_id, analyse_id } = await searchParams

  return <AnalyserClientProvider conversation_id={conversation_id} analyse_id={analyse_id}>
    <AnalyserClient />
  </AnalyserClientProvider>
}
