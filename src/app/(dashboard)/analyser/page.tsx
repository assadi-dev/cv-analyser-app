import { AnalyserClientProvider } from "./_components/AnalyseClientProvider"
import { AnalyserClient } from "./_components/AnalyserClient"
export const dynamic = 'force-dynamic'

interface AnalyserPageProps {
  searchParams: Promise<{
    conversation_id?: string
    analyse_id?: string
    /** Set when opened from a candidature: the analysis gets attached to it. */
    candidature_id?: string
  }>
}
export default async function AnalyserPage({ searchParams }: AnalyserPageProps) {
  const { conversation_id, analyse_id, candidature_id } = await searchParams

  return <AnalyserClientProvider conversation_id={conversation_id} analyse_id={analyse_id}>
    <AnalyserClient candidatureId={candidature_id} />
  </AnalyserClientProvider>
}
