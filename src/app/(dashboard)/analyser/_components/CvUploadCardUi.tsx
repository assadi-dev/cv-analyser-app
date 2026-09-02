"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader } from "@/components/ui/Card"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
} from "@/components/ui/file-upload"
import { FileIcon, FileText, Upload, X } from "lucide-react"
import { useMemo, useState } from "react"

interface CvUploadCardProps {
  onSelect: (file: File | null) => void
  cvFile: File | null
}
export function CvUploadCardUi({ onSelect, cvFile }: CvUploadCardProps) {

  const handleChangeFile = (files: File[]) => {
    onSelect(files[0] || null)
  }

  const files = useMemo(() => cvFile ? [cvFile] : [], [cvFile])

  return (
    <Card>
      <CardHeader
        icon={<FileText size={15} className="text-[var(--color-primary)]" />}
        title="CV du Candidat"
        action={<Badge variant="purple">PDF</Badge>}
      />
      <FileUpload value={files} onValueChange={handleChangeFile}
        accept=".pdf"
        maxSize={5 * 1024 * 1024} // 5MB
        maxFiles={1}
        multiple={false}
      >
        <FileUploadDropzone className="border border-slate-300">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-1">
              <Upload className="size-5 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Cliquez ou glisser-déposez ici</p>
            <p className="text-muted-foreground text-xs">
              PDF (max 5 Mo)
            </p>
          </div>

          <FileUploadTrigger />
        </FileUploadDropzone>






      </FileUpload>
      {files.map((file, index) => (
        <FilePreview key={`${file.name}-${index}`} cvFile={file} onClear={() => {
          onSelect(null)
        }} />
      ))}
    </Card>
  )
}

const FilePreview = ({ cvFile, onClear }: { cvFile: File, onClear: () => void }) => {
  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex items-center gap-2">
        <FileIcon className="w-5 h-5" />
        <span className="text-sm font-medium truncate">{cvFile.name}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} className="hover:text-red-500 transition-colors hover:bg-red-500/20 rounded-full p-2" >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}