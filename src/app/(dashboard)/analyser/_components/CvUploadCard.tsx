"use client"

import { FileIcon, FileText, UploadCloud, X } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Card, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useRef } from "react"


interface CvUploadCardProps {
  onSelect: (file: File | null) => void
  cvFile: File | null
}

export function CvUploadCard({ onSelect, cvFile }: CvUploadCardProps) {
  return (
    <Card>
      <CardHeader
        icon={<FileText size={15} className="text-[var(--color-primary)]" />}
        title="CV du Candidat"
        action={<Badge variant="purple">PDF</Badge>}
      />

      <InputFileUpload cvFile={cvFile} onSelect={onSelect} />

    </Card>
  )
}


const InputFileUpload = ({ cvFile, onSelect }: { cvFile: File | null, onSelect: (file: File | null) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onSelect(null)
  }


  return (
    <label htmlFor="cv-file" className="flex flex-col gap-4 justify-center place-items-center p-3">
      <div className="rounded-full p-3 place-items-center bg-accent w-fit">
        <UploadCloud className="w-6 h-6 " />
      </div>
      {cvFile ? (
        <FilePreview cvFile={cvFile} onSelect={onSelect} onClear={clearFile} />
      ) : (
        <p className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier</p>
      )}
      <input ref={inputRef} id="cv-file" type="file" accept=".pdf" className="hidden" onChange={(e) => onSelect(e.target.files?.[0] || null)} />
    </label>
  )
}


const FilePreview = ({ cvFile, onClear }: { cvFile: File, onClear: () => void }) => {
  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-2">
        <FileIcon className="w-5 h-5" />
        <span className="text-sm font-medium truncate">{cvFile.name}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} className="hover:text-red-500 transition-colors hover:bg-red-500/20" >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}