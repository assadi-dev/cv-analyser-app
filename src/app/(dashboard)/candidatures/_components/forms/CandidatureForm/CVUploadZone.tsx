"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Upload, LoaderCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useUploadCv } from "@/app/(dashboard)/parametres/_hooks/useUploadCv"
import type { CandidatureFormValues } from "../../../_lib/candidature.schema"

const MAX_MB = 2
const MAX_BYTES = MAX_MB * 1024 * 1024

function validatePDF(f: File): boolean {
  if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
    toast.error("Format invalide", { description: "Seuls les fichiers PDF sont acceptés." })
    return false
  }
  if (f.size > MAX_BYTES) {
    toast.error("Fichier trop volumineux", {
      description: `La taille maximum est de ${MAX_MB} Mo.`,
    })
    return false
  }
  return true
}

/**
 * "Import a new CV" — the divider and the PDF dropzone.
 *
 * A dropped file is imported at once: the API keeps it with the user's other
 * CVs, and the new CV becomes the one linked to the candidature. The form
 * only ever holds the CV's id, never the file.
 */
export function CVUploadZone() {
  const form = useFormContext<CandidatureFormValues>()
  const { mutateAsync: upload, isPending } = useUploadCv()
  const [uploadingName, setUploadingName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback(
    async (f: File) => {
      if (isPending || !validatePDF(f)) return
      setUploadingName(f.name)
      try {
        // `mutateAsync` rather than `mutate` callbacks: those are skipped when
        // this step has unmounted, and the CV must still end up linked.
        const cv = await upload(f)
        form.setValue("cv_id", cv.id, { shouldDirty: true })
      } catch {
        // Already reported: useUploadCv logs it and shows the error toast.
      } finally {
        setUploadingName(null)
      }
    },
    [form, isPending, upload]
  )

  // ── Paste global ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = e.clipboardData?.files[0]
      if (f) void handleFile(f)
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [handleFile])

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    // Ignore if leaving to a child element
    if (zoneRef.current?.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) void handleFile(f)
  }

  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-[#E2E8F0]" />
        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
          ou importer un nouveau CV
        </span>
        <Separator className="flex-1 bg-[#E2E8F0]" />
      </div>

      {isPending ? (
        <div
          role="status"
          className="flex items-center gap-3 h-[72px] px-4 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]"
        >
          <LoaderCircle size={16} className="animate-spin text-[#7C3AED] shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#374151] truncate">{uploadingName}</p>
            <p className="text-[10px] text-[#94A3B8]">Importation en cours…</p>
          </div>
        </div>
      ) : (
        /* Dropzone */
        <div
          ref={zoneRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-1 h-[72px] rounded-[10px]",
            "border-2 border-dashed cursor-pointer select-none transition-all duration-150",
            isDragging
              ? "border-[#7C3AED] bg-[#EDE9FE]/40 scale-[0.99]"
              : "border-[#C7D2FE] bg-[#F8FAFC] hover:border-[#A78BFA] hover:bg-[#EDE9FE]/20"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleFile(f)
              e.target.value = ""
            }}
          />

          <div className="flex items-center gap-2">
            <Upload
              size={16}
              className={cn(
                "transition-colors",
                isDragging ? "text-[#7C3AED]" : "text-[#A78BFA]"
              )}
            />
            <span className="text-[12px] font-medium text-[#7C3AED]">
              {isDragging
                ? "Déposer le fichier ici..."
                : "Glisser, cliquer ou coller un PDF"}
            </span>
          </div>

          <span className="text-[10px] text-[#94A3B8]">
            PDF uniquement · max {MAX_MB} Mo
          </span>
        </div>
      )}
    </>
  )
}
