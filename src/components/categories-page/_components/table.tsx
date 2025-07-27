"use client";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import {
  useDeleteCategories,
  useDeleteCategory,
  useGetAllCategories,
} from "@/components/categories-page/api-hooks";

import useAccess from "@/hooks/use-access";

import { DebouncedSearchInput } from "@/components/debounced-input";
import { useMemo, useState, useEffect } from "react";
import QueryTable from "@/components/query-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Categories_TableColumns } from "../columns";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CategoryFormModal } from "./category-form-modal";
import CategoryInterface, {
  CategoryType,
} from "@/interfaces/categories.interface";
import { useQueryTable } from "@/hooks/use-query-table";

import TableSkeleton from "@/components/table-skeleton";

export default function CategoriesTable({ type }: { type: CategoryType }) {
  const { toast } = useToast();
  // access
  const { has } = useAccess();

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteCategoriesMutation = useDeleteCategories();
  const deleteCategoryMutation = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CategoryInterface>();
  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const tableParams = useQueryTable<CategoryInterface, { type?: CategoryType }>(
    {
      useGetData: useGetAllCategories,
      filters: { type },
      columns: Categories_TableColumns,
      isSortingEnabled: true,
      metaTableConfig: {
        has,
        handleDelete: (id: string) => {
          setDeletePopupProps({
            open: true,
            title: "Delete category",
            description:
              "Please be sure before you delete this category because this action can not be undone.",
            handleDelete: () => handleDeleteCategory(id), // Pass the ID directly
          });
        },
        handleUpdate: (category: CategoryInterface) => {
          setOpen(true);
          setSelectedItem(category);
        },
      },
    }
  );

  const searchInput = useMemo(
    () => (
      <DebouncedSearchInput
        className="w-[22em] max-sm:w-full"
        onDebouncedValueChange={(e) =>
          tableParams.table.getColumn("name")?.setFilterValue(e as string)
        }
        placeholder="Search by category name.."
      />
    ),
    [tableParams.table] // Only depend on the table instance, not on filter values
  );

  const handleDeleteCategory = async (categoryId?: string) => {
    // Use the passed categoryId or fallback to state

    if (!categoryId) {
      console.error("No category ID available for deletion");
      return;
    }

    try {
      await deleteCategoryMutation.mutateAsync({
        categoryId: categoryId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete category",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteCategoriesMutation.mutateAsync({
        categories: tableParams.table
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
      <QueryTable<CategoryInterface>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["category:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete categories",
                    description:
                      "Please be sure before you delete this categories because this action can not be undone.",
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
      {has(["category:update"]) ? (
        <CategoryFormModal
          open={open}
          setOpen={setOpen}
          type={type}
          mode="update"
          initialValues={selectedItem}
        />
      ) : null}
      {has(["category:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteCategoriesMutation.isPending ||
            deleteCategoryMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
