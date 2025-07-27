"use client";

import JobDepartmentInterface from "@/interfaces/job-department.interface";
import { useEffect, useRef, useState } from "react";
import { JobDepartments_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import useAccess from "@/hooks/use-access";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import UpdateJobDepartmentPopup from "./update-job-department-popup";
import { useQueryTable } from "@/hooks/use-query-table";
import TableSkeleton from "@/components/table-skeleton";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import QueryTable from "@/components/query-table";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteDepartment,
  useDeleteDepartments,
  useGetAllDepartments,
} from "../department-hooks";

// The job departments table and filters section

export default function JobDepartmentsTable() {
  const { toast } = useToast();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  // selected department to update and delete
  const [updateSelected, setUpdateSelected] = useState<{
    name: string;
    id: string;
  } | null>(null);

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<{
    page: number;
    size: number;
    name?: string;
  }>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteDepartmentMutation = useDeleteDepartment();
  const deleteDepartmentsMutation = useDeleteDepartments();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete department",
      description:
        "Please be sure before you delete this department because this action can not be undone.",
      handleDelete: () => handleDeleteDepartment(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string, name: string) => {
    if (id && name) {
      setUpdateSelected({ id, name });
      setUpdateDialogOpen(true);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllDepartments,
    filters,
    columns: JobDepartments_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
    },
  });

  const handleDeleteDepartment = async (departmentId?: string) => {
    // Use the passed departmentId or fallback to state

    if (!departmentId) {
      console.error("No department ID available for deletion");
      return;
    }

    try {
      await deleteDepartmentMutation.mutateAsync({
        departmentId: departmentId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ??
          "Failed to delete Department",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteDepartmentsMutation.mutateAsync({
        departmentIds: tableParams.table
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
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<JobDepartmentInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["job_department:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete departments",
                    description:
                      "Please be sure before you delete this departments because this action can not be undone.",
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
            {has(["job_department:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id, row.name)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            ) : null}
            {has(["job_department:delete"]) ? (
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
      {/* the update category dialog */}
      {has(["job_department:update"]) ? (
        <UpdateJobDepartmentPopup
          data={updateSelected}
          open={updateDialogOpen}
          setOpen={setUpdateDialogOpen}
        />
      ) : null}
      {has(["job_department:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteDepartmentMutation.isPending ||
            deleteDepartmentsMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
