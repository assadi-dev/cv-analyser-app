"use client"

import { useCallback, useState } from "react"
import type { CandidatureMovePayload } from "@/types"
import BoardView from "../../_components/Board/BoardView"
import { MOCK_BOARD } from "../../_lib/kanban.mock"
import { moveCard, locateCard, type KanbanColumns } from "../../_lib/board"

interface LoggedMove {
  at: string
  cardId: string
  company: string
  payload: CandidatureMovePayload
}

/**
 * Drag & drop harness, running on fixtures instead of the API.
 *
 * Exists to answer one question before wiring the real thing: does a drop
 * produce the payload the server expects? Every move is echoed verbatim, so
 * the neighbours sent can be checked against what is on screen.
 */
export default function BoardSandbox() {
  const [board, setBoard] = useState<KanbanColumns>(MOCK_BOARD)
  const [log, setLog] = useState<LoggedMove[]>([])

  const handleMove = useCallback(
    (cardId: string, payload: CandidatureMovePayload) => {
      // Stands in for the API round trip: apply what the server would apply.
      setBoard((current) => {
        const location = locateCard(current, cardId)
        return location ? moveCard(current, cardId, payload.status, location.index) : current
      })

      const company =
        Object.values(board)
          .flat()
          .find((c) => c.id === cardId)?.company_name ?? cardId

      setLog((entries) =>
        [
          {
            at: new Date().toLocaleTimeString("fr-FR"),
            cardId,
            company,
            payload,
          },
          ...entries,
        ].slice(0, 12)
      )
    },
    [board]
  )

  const label = (id: string | null) => {
    if (!id) return "null"
    const card = Object.values(board).flat().find((c) => c.id === id)
    return card ? card.company_name : id.slice(0, 8)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
          Bac à sable · données simulées
        </span>
        <h1 className="text-[22px] font-bold text-slate-900">
          Vérification du drag &amp; drop
        </h1>
        <p className="max-w-[62ch] text-[13px] text-slate-500">
          Aucun appel réseau. Déplacez une carte : le payload envoyé au serveur
          s&apos;affiche ci-dessous, avec les voisins tels que le board les a
          résolus. Ils doivent correspondre aux cartes qui encadrent la carte
          déposée.
        </p>
      </header>

      <BoardView columns={board} onMove={handleMove} />

      <section className="flex flex-col gap-3">
        <h2 className="text-[15px] font-bold text-slate-900">
          Payloads émis{" "}
          <span className="font-normal text-slate-400">({log.length})</span>
        </h2>

        {log.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-slate-200 px-4 py-8 text-center text-[13px] text-slate-400">
            Déplacez une carte pour voir le payload correspondant.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {log.map((entry, index) => (
              <li
                key={`${entry.at}-${index}`}
                className="overflow-x-auto rounded-[10px] border border-border bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] text-slate-400">
                    {entry.at}
                  </span>
                  <span className="text-[13px] font-semibold text-slate-900">
                    {entry.company}
                  </span>
                  <span className="text-[12px] text-slate-500">
                    → colonne{" "}
                    <code className="font-mono text-slate-700">
                      {entry.payload.status}
                    </code>
                  </span>
                </div>
                <pre className="mt-2 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-slate-600">
{`PATCH /api/candidature/${entry.cardId}/move
{
  "status":    "${entry.payload.status}",
  "before_id": ${entry.payload.before_id ? `"${entry.payload.before_id}"` : "null"},   // ${label(entry.payload.before_id)}
  "after_id":  ${entry.payload.after_id ? `"${entry.payload.after_id}"` : "null"}   // ${label(entry.payload.after_id)}
}`}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
