"use client";

import { useEffect, useRef, useState } from "react";
import { Users_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { TableSearchInputRef } from "@/components/debounced-input";
import { UserFilters, UserInterface } from "@/interfaces/user.interfaces";
import useAccess from "@/hooks/use-access";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import QueryTable from "@/components/query-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import TableSkeleton from "@/components/table-skeleton";
import { useQueryTable } from "@/hooks/use-query-table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ActiveUserPopup from "./active-user-popup";
import { useDeleteUser, useDeleteUsers, useGetAllUsers } from "../user-hooks";
import { UsersTableToolbar } from "./table-toolbar";

// The users table and filters section

export default function UsersTable() {
  const router = useRouter();
  const { toast } = useToast();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  const [activeDialogOpen, setActiveDialogOpen] = useState(false);
  const [activeSelected, setActiveSelected] = useState<{
    id: string;
    name: string;
    active: boolean;
  } | null>(null);

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteUserMutation = useDeleteUser();
  const deleteUsersMutation = useDeleteUsers();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete user",
      description:
        "Please be sure before you delete this user because this action can not be undone.",
      handleDelete: () => handleDeleteUser(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/roles-permissions/users/update/${id}`);
    }
  };
  // handle active
  const handleActive = (user: {
    id: string;
    name: string;
    active: boolean;
  }) => {
    if ((user.id, user.name)) {
      setActiveSelected(user);
      setActiveDialogOpen(true);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllUsers,
    filters,
    columns: Users_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleActive,
      handleUpdate,
    },
  });

  const handleDeleteUser = async (userId?: string) => {
    // Use the passed userId or fallback to state

    if (!userId) {
      console.error("No user ID available for deletion");
      return;
    }

    try {
      await deleteUserMutation.mutateAsync({
        userId: userId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete User",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteUsersMutation.mutateAsync({
        userIds: tableParams.table
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
        <UsersTableToolbar
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
      <QueryTable<UserInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["user:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete users",
                    description:
                      "Please be sure before you delete this users because this action can not be undone.",
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
            {!row.access.isAdmin && has(["user:activation"]) ? (
              <ContextMenuItem
                onClick={() =>
                  handleActive({
                    name: row.profileInfo.username,
                    id: row.id,
                    active: row.access.active,
                  })
                }
              >
                <HiOutlineLockClosed className="mr-2 h-4 w-4" />
                Activate/Deactivate
              </ContextMenuItem>
            ) : null}
            {!row.access.isAdmin && has(["user:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Update
              </ContextMenuItem>
            ) : null}
            {!row.access.isAdmin && has(["user:delete"]) ? (
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
      {/* active user dialog */}
      {has(["user:activation"]) ? (
        <ActiveUserPopup
          user={activeSelected}
          open={activeDialogOpen}
          setOpen={setActiveDialogOpen}
        />
      ) : null}
      {has(["user:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteUserMutation.isPending || deleteUsersMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
