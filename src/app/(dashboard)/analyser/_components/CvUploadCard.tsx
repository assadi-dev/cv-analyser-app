"use client"

import { FileIcon, FileText, Upload, UploadCloud, X } from "lucide-react"
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

  const hoverStyle = "hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"

  return (
    <label htmlFor="cv-file" className="flex flex-col gap-4 justify-center place-items-center p-3">
      <div className={`flex flex-col items-center gap-2 w-full h-fit border-1 border-dashed rounded-lg p-4 border-gray-400 cursor-pointer ${hoverStyle}`}>
        <div className="flex items-center justify-center rounded-full border p-2">
          <Upload className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-medium text-sm">Cliquez ou glisser-déposez ici</p>
          <p className="text-muted-foreground text-xs">
            PDF (max 5 Mo)
          </p>
        </div>
      </div>

      {cvFile ? (
        <FilePreview cvFile={cvFile} onClear={clearFile} />
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
      <Button variant="ghost" size="sm" onClick={onClear} className="hover:text-red-500 transition-colors hover:bg-red-500/20 p-2 rounded-full" >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}