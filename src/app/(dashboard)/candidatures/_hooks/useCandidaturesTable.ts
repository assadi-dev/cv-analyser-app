"use client"

import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  type PaginationState,
} from "@tanstack/react-table"
import type { CandidatureSummary } from "@/types"
import { PAGE_SIZE } from "../_api/candidatures.api"
import { createColumns } from "../_lib/columns"

interface UseCandidaturesTableOptions {
  data: CandidatureSummary[]
  total: number
  page: number
  onPageChange: (page: number) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export function useCandidaturesTable({
  data,
  total,
  page,
  onPageChange,
  onDelete,
  onView,
}: UseCandidaturesTableOptions) {
  const columns = useMemo(
    () => createColumns({ onDelete, onView }),
    [onDelete, onView]
  )

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: PAGE_SIZE,
  }

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / PAGE_SIZE),
    state: { pagination },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater
      onPageChange(next.pageIndex + 1)
    },
  })
}
