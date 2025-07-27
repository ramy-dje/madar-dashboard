"use client";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { PageLayoutFilteringHeader } from "@/components/page-layout";

import useAccess from "@/hooks/use-access";

import { DebouncedSearchInput } from "@/components/debounced-input";
import { useMemo, useState, useEffect } from "react";
import QueryTable from "@/components/query-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { useQueryTable } from "@/hooks/use-query-table";

import TableSkeleton from "@/components/table-skeleton";
import TagInterface from "@/interfaces/tag.interface";
import { useDeleteTag, useDeleteTags, useGetAllTags } from "../api-hooks";
import { Tags_TableColumns } from "../columns";
import { TagFormModal } from "./tag-form-modal";
import { CategoryType } from "@/interfaces/categories.interface";

export default function TagsTable({ type }: { type: CategoryType }) {
  const { toast } = useToast();
  // access
  const { has } = useAccess();

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteTagsMutation = useDeleteTags();
  const deleteTagMutation = useDeleteTag();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TagInterface>();
  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const tableParams = useQueryTable<TagInterface, { type?: CategoryType }>({
    useGetData: useGetAllTags,
    filters: { type },
    columns: Tags_TableColumns,
    isSortingEnabled: true,
    metaTableConfig: {
      has,
      handleDelete: (id: string) => {
        setDeletePopupProps({
          open: true,
          title: "Delete tag",
          description:
            "Please be sure before you delete this tag because this action can not be undone.",
          handleDelete: () => handleDeleteTag(id), // Pass the ID directly
        });
      },
      handleUpdate: (tag: TagInterface) => {
        setOpen(true);
        setSelectedItem(tag);
      },
    },
  });

  const searchInput = useMemo(
    () => (
      <DebouncedSearchInput
        className="w-[22em] max-sm:w-full"
        onDebouncedValueChange={(e) =>
          tableParams.table.getColumn("name")?.setFilterValue(e as string)
        }
        placeholder="Search by tag name.."
      />
    ),
    [tableParams.table] // Only depend on the table instance, not on filter values
  );

  const handleDeleteTag = async (tagId?: string) => {
    // Use the passed tagId or fallback to state

    if (!tagId) {
      console.error("No tag ID available for deletion");
      return;
    }

    try {
      await deleteTagMutation.mutateAsync({
        tagId: tagId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete tag",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteTagsMutation.mutateAsync({
        tags: tableParams.table
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
        {searchInput}
        <div className="flex items-center gap-2">
          {/* The visibalt */}
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<TagInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["tag:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete tags",
                    description:
                      "Please be sure before you delete this tags because this action can not be undone.",
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
      />
      <DataTablePagination table={tableParams.table} />
      {has(["tag:update"]) ? (
        <TagFormModal
          open={open}
          setOpen={setOpen}
          type={type}
          mode="update"
          initialValues={selectedItem}
        />
      ) : null}
      {has(["tag:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteTagsMutation.isPending || deleteTagMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
