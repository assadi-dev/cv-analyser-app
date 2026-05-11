"use client"

import { useMemo } from "react"
import { useModal } from "@/hooks/useModal"
import { useCandidaturesParams } from "../_hooks/useCandidaturesParams"
import { useCandidatures } from "../_hooks/useCandidatures"
import { useDeleteCandidature } from "../_hooks/useDeleteCandidature"
import { CandidaturesHeader } from "./CandidaturesHeader"
import { FilterBar } from "./FilterBar/FilterBar"
import { StatusTabs } from "./StatusTabs/StatusTabs"
import { CandidaturesTable } from "./CandidaturesTable/CandidaturesTable"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

export function CandidaturesClient() {
  const { page, status, search, setPage, setStatus, setSearch } = useCandidaturesParams()
  const { candidatures, total, isLoading } = useCandidatures({ page, status })
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteCandidature()
  const deleteModal = useModal<string>()

  const filtered = useMemo(
    () =>
      search
        ? candidatures.filter(
            (c) =>
              c.company_name.toLowerCase().includes(search.toLowerCase()) ||
              c.job_title.toLowerCase().includes(search.toLowerCase())
          )
        : candidatures,
    [candidatures, search]
  )

  const handleDeleteRequest = (id: string) => deleteModal.open(id)

  const handleDeleteConfirm = () => {
    if (!deleteModal.modalProps) return
    deleteMutation(deleteModal.modalProps, { onSuccess: deleteModal.close })
  }

  const handleView = (_id: string) => {
    // TODO: navigate to candidature detail
  }

  const handleAdd = () => {
    // TODO: open add candidature modal
  }

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
    </div>
  )
}
