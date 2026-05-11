"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { FileText, Upload, X, CheckCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

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

export function CVSection() {
  const form = useFormContext<AddCandidatureFormValues>()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback((f: File) => {
    if (validatePDF(f)) setFile(f)
  }, [])

  // ── Paste global ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = e.clipboardData?.files[0]
      if (f) handleFile(f)
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
    if (f) handleFile(f)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">CV utilisé</p>

      {/* Existing CV selector */}
      <FormField
        control={form.control}
        name="cv_id"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-[44px] rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={16} className="text-[#7C3AED] shrink-0" />
                    <SelectValue placeholder="Sélectionner un CV existant" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]">
                <SelectItem
                  value="none"
                  className="text-[12px] text-[#94A3B8] focus:bg-[#EDE9FE]"
                >
                  Aucun CV sélectionné
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-[#E2E8F0]" />
        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">
          ou importer un nouveau CV
        </span>
        <Separator className="flex-1 bg-[#E2E8F0]" />
      </div>

      {/* File preview */}
      {file ? (
        <div className="flex items-center gap-3 h-[64px] px-4 rounded-[10px] bg-[#F0FDF4] border border-[#A7F3D0]">
          <CheckCircle size={16} className="text-[#10B981] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#065F46] truncate">{file.name}</p>
            <p className="text-[10px] text-[#34D399]">
              {(file.size / 1024 / 1024).toFixed(2)} Mo
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center hover:bg-[#A7F3D0] transition-colors shrink-0"
            aria-label="Supprimer le fichier"
          >
            <X size={12} className="text-[#065F46]" />
          </button>
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
              if (f) handleFile(f)
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
    </div>
  )
}
