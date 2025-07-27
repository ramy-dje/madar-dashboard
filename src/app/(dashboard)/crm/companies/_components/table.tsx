"use client";

import { useEffect, useRef, useState } from "react";
import { CRMCompanies_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import useAccess from "@/hooks/use-access";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import QueryTable from "@/components/query-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import TableSkeleton from "@/components/table-skeleton";
import { useQueryTable } from "@/hooks/use-query-table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  useDeleteCompanies,
  useDeleteCompany,
  useGetAllCompanies,
} from "../company-hooks";
import CRMCompaniesPageFiltering from "./filtering";
import { CRMCompanyFilters } from "@/interfaces/crm-company.interface";

// The crm companies table and filters section

export default function CRMCompaniesTable() {
  const { toast } = useToast();
  const router = useRouter();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<CRMCompanyFilters>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteCompanyMutation = useDeleteCompany();
  const deleteCompaniesMutation = useDeleteCompanies();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete company",
      description:
        "Please be sure before you delete this company because this action can not be undone.",
      handleDelete: () => handleDeleteCompany(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/crm/companies/update/${id}`);
    }
  };

  // handle View
  const handleView = (id: string) => {
    if (id) {
      router.push(`/crm/companies/${id}`);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllCompanies,
    filters,
    columns: CRMCompanies_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeleteCompany = async (companyId?: string) => {
    // Use the passed companyId or fallback to state

    if (!companyId) {
      console.error("No company ID available for deletion");
      return;
    }

    try {
      await deleteCompanyMutation.mutateAsync({
        companyId: companyId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete Company",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteCompaniesMutation.mutateAsync({
        companyIds: tableParams.table
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
            placeholder="Search by company first/last name, bio"
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
          <CRMCompaniesPageFiltering
            filters={filters}
            setFilters={setFilters}
          />
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<any>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["crm_company:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete companies",
                    description:
                      "Please be sure before you delete this companies because this action can not be undone.",
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
            {has(["crm_company:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            ) : null}
            {has(["crm_company:delete"]) ? (
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
      {has(["crm_company:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteCompanyMutation.isPending || deleteCompaniesMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
