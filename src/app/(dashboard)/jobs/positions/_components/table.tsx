"use client";

import { useEffect, useRef, useState } from "react";
import { Jobs_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";

import JobInterface, { JobFiltersInterface } from "@/interfaces/job.interface";
import useAccess from "@/hooks/use-access";
import JobPositionsPageFiltering from "./filtering";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import QueryTable from "@/components/query-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import TableSkeleton from "@/components/table-skeleton";
import { useQueryTable } from "@/hooks/use-query-table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useDeleteJob, useDeleteJobs, useGetAllJobs } from "../job-hooks";

// The jobs table and filters section

export default function JobsTable() {
  const { toast } = useToast();
  const router = useRouter();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<JobFiltersInterface>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteJobMutation = useDeleteJob();
  const deleteJobsMutation = useDeleteJobs();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete job",
      description:
        "Please be sure before you delete this job because this action can not be undone.",
      handleDelete: () => handleDeleteJob(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/jobs/positions/update/${id}`);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllJobs,
    filters,
    columns: Jobs_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
    },
  });

  const handleDeleteJob = async (jobId?: string) => {
    // Use the passed jobId or fallback to state

    if (!jobId) {
      console.error("No job ID available for deletion");
      return;
    }

    try {
      await deleteJobMutation.mutateAsync({
        jobId: jobId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete Job",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteJobsMutation.mutateAsync({
        jobIds: tableParams.table
          .getSelectedRowModel()
          .rows.map((row) => row.original.id),
      });
      tableParams.table.resetRowSelection();
      setDeletePopupProps((prev) => ({ ...prev, open: false })); // Fixed: preserve other properties
      toast({
        title: "Success",
        description: "Selected items deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ??
          "Failed to delete some items",
      });
    }
  };
  // Don't render anything until client-side
  if (!isClient) {
    return <TableSkeleton />;
  }

  return (
    <>
      {/* Filtering place */}
      <PageLayoutFilteringHeader>
        <div className="w-full lg:w-[22em]">
          {/* searching */}
          <TableSearchInput
            ref={searchInputRef}
            initialValue={filters?.name || ""}
            placeholder="Search by position title..."
            onChange={(value) => {
              setFilters((prev) => {
                const newFilters = {
                  ...prev,
                  name: value || "",
                  page: 0, // Reset to first page on search
                };
                return newFilters;
              });
            }}
          />
        </div>
        {/* filtering and toggling */}
        <div className="flex items-center max-sm:flex-row gap-2">
          <JobPositionsPageFiltering
            filters={filters}
            setFilters={setFilters}
          />
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<JobInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["job_position:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete jobs",
                    description:
                      "Please be sure before you delete this jobs because this action can not be undone.",
                    handleDelete: handleBulkDelete,
                  })
                }
                className="flex-1 w-full"
              >
                Delete them
              </Button>
            ) : null}
          </>
        }
        contextMenuContent={(row) => (
          <>
            {has(["job_position:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            ) : null}
            {has(["job_position:delete"]) ? (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => handleDelete(row.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <HiOutlineTrash className="mr-2 h-4 w-4 text-destructive" />
                  Delete
                </ContextMenuItem>
              </>
            ) : null}
          </>
        )}
      />
      <DataTablePagination
        pageSize={filters.size || 10}
        setPageSize={(size) =>
          setFilters((prev) => ({
            ...prev,
            size,
            page: 0, // Reset to first page on size change
          }))
        }
        pageIndex={filters.page!}
        setPageIndex={(index) =>
          setFilters((prev) => ({
            ...prev,
            page: index,
          }))
        }
        totalPages={tableParams.paginationData?.totalPages || 1}
        canPreviousPage={filters.page! > 0}
        canNextPage={
          filters.page! < (tableParams.paginationData?.totalPages ?? 0) - 1
        }
      />
      {has(["job_position:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteJobMutation.isPending || deleteJobsMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
