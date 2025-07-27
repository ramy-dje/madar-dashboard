"use client";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { PageLayoutFilteringHeader } from "@/components/page-layout";

import useAccess from "@/hooks/use-access";

import { TableSearchInput } from "@/components/debounced-input";
import { useEffect, useState } from "react";
import QueryTable from "@/components/query-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { useQueryTable } from "@/hooks/use-query-table";

import TableSkeleton from "@/components/table-skeleton";
import { TenderInterface } from "@/interfaces/tender_interface";
import {
  useDeleteTender,
  useDeleteTenders,
  useGetAllTenders,
} from "../tenders_hooks";
import { Tender_TableColumns } from "./columns";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function TendersTable() {
  const { toast } = useToast();
  // access
  const { has } = useAccess();

  const router = useRouter();

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteTenderMutation = useDeleteTender();
  const deleteTendersMutation = useDeleteTenders();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete tender",
      description:
        "Please be sure before you delete this tender because this action can not be undone.",
      handleDelete: () => handleDeleteTender(id), // Pass the ID directly
    });
  };
  const handleUpdate = (id: string) => {
    router.push(`/tenders/update/${id}`);
  };
  const handleView = (id: string) => {
    router.push(`/tenders/${id}`);
  };

  const tableParams = useQueryTable<TenderInterface, undefined>({
    useGetData: useGetAllTenders,
    columns: Tender_TableColumns,
    isSortingEnabled: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeleteTender = async (tenderId?: string) => {
    // Use the passed tenderId or fallback to state

    if (!tenderId) {
      console.error("No tender ID available for deletion");
      return;
    }

    try {
      await deleteTenderMutation.mutateAsync({
        tenderId: tenderId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Tender deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete tender",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteTendersMutation.mutateAsync({
        tenderIds: tableParams.table
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
        {/* searching */}
        <TableSearchInput
          onChange={(value) => {
            tableParams.table.getColumn("title")?.setFilterValue(value);
          }}
        />
        <div className="flex items-center gap-2">
          {/* The visibalt */}
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<TenderInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["tender:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete tenders",
                    description:
                      "Please be sure before you delete this tenders because this action can not be undone.",
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
            <ContextMenuItem onClick={() => handleView(row.id)}>
              <HiOutlineEye className="mr-2 h-4 w-4" />
              View Details
            </ContextMenuItem>
            {has(["tender:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            ) : null}
            {has(["tender:delete"]) ? (
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
      <DataTablePagination table={tableParams.table} />
      {has(["tender:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteTenderMutation.isPending || deleteTendersMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
