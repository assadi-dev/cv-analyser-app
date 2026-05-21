"use client"

import { useCallback, useMemo } from "react"
import { useModal } from "@/hooks/useModal"
import { useCandidaturesParams } from "../_hooks/useCandidaturesParams"
import { useCandidatures } from "../_hooks/useCandidatures"
import { useAddCandidature } from "../_hooks/useAddCandidature"
import { useDeleteCandidature } from "../_hooks/useDeleteCandidature"
import { CandidaturesHeader } from "./CandidaturesHeader"
import { FilterBar } from "./FilterBar/FilterBar"
import { StatusTabs } from "./StatusTabs/StatusTabs"
import { CandidaturesTable } from "./CandidaturesTable/CandidaturesTable"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"
import { AddCandidatureModal } from "./modals/AddCandidatureModal"
import type { AddCandidatureFormValues } from "../_lib/add-candidature.schema"

export function CandidaturesClient() {
  const { page, status, search, setPage, setStatus, setSearch } = useCandidaturesParams()
  const { candidatures, total, isLoading } = useCandidatures({ page, status })
  const { mutate: addMutation, isPending: isAdding } = useAddCandidature()
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteCandidature()
  const deleteModal = useModal<string>()
  const addModal = useModal()

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

  const handleAdd = useCallback(() => addModal.open(), [addModal.open])

  const handleAddSubmit = useCallback((values: AddCandidatureFormValues) => {
    addMutation(values, { onSuccess: addModal.close })
  }, [addMutation, addModal.close])

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-8">
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
    </div>
  )
}
