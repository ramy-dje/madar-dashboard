"use client";
import { useEffect, useRef, useState } from "react";
import { JobSubmissions_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { TableSearchInputRef } from "@/components/debounced-input";
import useAccess from "@/hooks/use-access";
import TableSkeleton from "@/components/table-skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryTable } from "@/hooks/use-query-table";
import QueryTable from "@/components/query-table";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import JobSubmissionInterface, {
  JobSubmissionFilters,
} from "@/interfaces/job-submission.interface";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  useDeleteSubmission,
  useDeleteSubmissions,
  useGetAllSubmissions,
} from "../submission-hooks";
import { JobSubmissionsTableToolbar } from "./table-toolbar";
import ReviewJobSubmissionPopup from "./view-job-submission-popup";

// The job submissions table and filters section

export default function JobSubmissionsTable() {
  const { toast } = useToast();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  // selected department to review and delete
  const [reviewSelected, setReviewSelected] =
    useState<JobSubmissionInterface | null>(null);
  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<JobSubmissionFilters>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteSubmissionMutation = useDeleteSubmission();
  const deleteSubmissionsMutation = useDeleteSubmissions();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete submission",
      description:
        "Please be sure before you delete this submission because this action can not be undone.",
      handleDelete: () => handleDeleteSubmission(id), // Pass the ID directly
    });
  };

  // handle View
  const handleReview = (sub: JobSubmissionInterface) => {
    if (sub) {
      setReviewSelected(sub);
      setReviewDialogOpen(true);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllSubmissions,
    filters,
    columns: JobSubmissions_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleReview,
    },
  });

  const handleDeleteSubmission = async (submissionId?: string) => {
    // Use the passed submissionId or fallback to state

    if (!submissionId) {
      console.error("No submission ID available for deletion");
      return;
    }

    try {
      await deleteSubmissionMutation.mutateAsync({
        submissionId: submissionId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ??
          "Failed to delete Submission",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteSubmissionsMutation.mutateAsync({
        submissionIds: tableParams.table
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
        <JobSubmissionsTableToolbar
          filters={filters}
          setFilters={setFilters}
          searchInputRef={searchInputRef}
        />
        {/* filtering and toggling */}
        <div className="flex items-center max-sm:flex-row gap-2">
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<JobSubmissionInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["job_submission:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete submissions",
                    description:
                      "Please be sure before you delete this submissions because this action can not be undone.",
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
            <ContextMenuItem onClick={() => handleReview(row)}>
              <HiOutlineEye className="mr-2 h-4 w-4" />
              View Details
            </ContextMenuItem>
            {has(["job_submission:delete"]) ? (
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
      {/* the review submission dialog */}
      <ReviewJobSubmissionPopup
        data={reviewSelected}
        open={reviewDialogOpen}
        setOpen={setReviewDialogOpen}
      />
      {has(["job_submission:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteSubmissionMutation.isPending ||
            deleteSubmissionsMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
