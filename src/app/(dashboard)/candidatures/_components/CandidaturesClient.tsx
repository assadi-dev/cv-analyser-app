"use client"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModal"
import { useCandidaturesParams } from "../_hooks/useCandidaturesParams"
import { useCandidatures } from "../_hooks/useCandidatures"
import { useAddCandidature } from "../_hooks/useAddCandidature"
import { useDeleteCandidature } from "../_hooks/useDeleteCandidature"
import { useUpdateCandidature } from "../_hooks/useUpdateCandidature"
import { CandidaturesHeader } from "./CandidaturesHeader"
import { FilterBar } from "./FilterBar/FilterBar"
import { StatusTabs } from "./StatusTabs/StatusTabs"
import { CandidaturesTable } from "./CandidaturesTable/CandidaturesTable"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"
import { AddCandidatureModal } from "./modals/AddCandidatureModal"
import { EditCandidatureModal } from "./modals/EditCandidatureModal"
import type { UpdateCandidaturePayload } from "../_api/candidatures.api"
import type { CandidatureFormValues } from "../_lib/candidature.schema"

export function CandidaturesClient() {
  const { page, status, search, setPage, setStatus, setSearch } = useCandidaturesParams()
  const { candidatures, total, isLoading } = useCandidatures({ page, status })
  const { mutate: addMutation, isPending: isAdding } = useAddCandidature()
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteCandidature()
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateCandidature()
  const router = useRouter()
  const deleteModal = useModal<string>()
  const addModal = useModal()
  const editModal = useModal<string>()

  const filtered = useMemo(
    () =>
      search
        ? candidatures.filter(
          (c) =>
            c.company_name.toLowerCase().includes(search.toLowerCase()) ||
            c.job_title.toLowerCase().includes(search.toLowerCase())
        )
        : candidatures,
    [candidatures, search, isLoading]
  )



  const handleDeleteRequest = useCallback((id: string) => deleteModal.open(id), [deleteModal.open])

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModal.modalProps) return
    deleteMutation([deleteModal.modalProps], { onSuccess: deleteModal.close })
  }, [deleteModal.modalProps, deleteModal.close, deleteMutation])

  const handleView = useCallback((_id: string) => {
    // TODO: navigate to candidature detail
  }, [])

  const handleEditRequest = useCallback((id: string) => editModal.open(id), [editModal.open])

  const handleEditSubmit = useCallback(
    (id: string, payload: UpdateCandidaturePayload) => {
      // Nothing changed: no request, no "modified" toast for an untouched form.
      if (Object.keys(payload).length === 0) {
        editModal.close()
        return
      }
      updateMutation({ id, payload }, { onSuccess: editModal.close })
    },
    [editModal.close, updateMutation]
  )

  // The analysis itself runs on the Analyser page, which needs the CV and the
  // offer text — neither is stored on the candidature. The id travels along so
  // the result is attached to it.
  const handleAnalyse = useCallback(
    (id: string) => router.push(`/analyser?candidature_id=${id}`),
    [router]
  )

  const handleAdd = useCallback(() => addModal.open(), [addModal.open])

  const handleAddSubmit = useCallback((values: CandidatureFormValues) => {
    addMutation(values, { onSuccess: addModal.close })
  }, [addMutation, addModal.close])

  return (
    // h-full: the page fills the window so the table can take what is left.
    <div className="flex h-full min-h-0 flex-col gap-5 p-4 sm:p-8">
      <CandidaturesHeader onAdd={handleAdd} />

      <FilterBar search={search} onSearchChange={setSearch} />

      <StatusTabs active={status} total={total} onTabChange={setStatus} />
      <CandidaturesTable
        items={filtered}
        isLoading={isLoading}
        page={page}
        total={total}
        onPageChange={setPage}
        onDelete={handleDeleteRequest}
        onView={handleView}
        onEdit={handleEditRequest}
        onAnalyse={handleAnalyse}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />

      <AddCandidatureModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onSubmit={handleAddSubmit}
        isPending={isAdding}
      />

      <EditCandidatureModal
        candidatureId={editModal.modalProps}
        onClose={editModal.close}
        onSubmit={handleEditSubmit}
        isPending={isUpdating}
      />
    </div>
  )
}
