import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { UseQueryResult } from "@tanstack/react-query";

interface UseQueryTableProps<T, F = Record<string, any>> {
  useGetData: (filters?: F) => UseQueryResult<
    {
      data: T[];
      page?: number;
      total?: number;
      size?: number;
      totalPages?: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    },
    unknown
  >;
  filters?: F;
  columns: ColumnDef<T, any>[];
  metaTableConfig?: Record<string, unknown>;
  isSortingEnabled?: boolean;
  isManualPagination?: boolean;
}

export function useQueryTable<T, F = Record<string, any> | undefined>({
  useGetData,
  filters,
  columns,
  metaTableConfig,
  isSortingEnabled = true,
  isManualPagination = true,
}: UseQueryTableProps<T, F>) {
  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetData(memoizedFilters);
  const displayedData = useMemo(() => data?.data || [], [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Memoize the table configuration to prevent unnecessary re-renders
  const tableConfig = useMemo(
    () => ({
      data: displayedData,
      columns,
      state: {
        sorting: isSortingEnabled ? sorting : undefined,
        columnFilters,
        pagination,
      },
      onSortingChange: isSortingEnabled ? setSorting : undefined,
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: isSortingEnabled ? getSortedRowModel() : undefined,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: isManualPagination
        ? getPaginationRowModel()
        : undefined,
      meta: metaTableConfig,
    }),
    [
      displayedData,
      columns,
      sorting,
      columnFilters,
      pagination,
      isSortingEnabled,
      isManualPagination,
      metaTableConfig,
    ]
  );

  const table = useReactTable(tableConfig);

  return {
    table,
    data: displayedData,
    paginationData:
      data?.page !== undefined
        ? {
            page: data?.page,
            total: data?.total,
            size: data?.size,
            totalPages: data?.totalPages,
            hasNext: data?.hasNext,
            hasPrev: data?.hasPrev,
          }
        : undefined,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
    colsLength: columns.length,
  };
}
