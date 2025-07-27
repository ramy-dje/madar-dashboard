"use client";

import { useEffect, useRef, useState } from "react";
import { CRMContacts_TableColumns } from "./columns";
import { PageLayoutFilteringHeader } from "@/components/page-layout";
import useAccess from "@/hooks/use-access";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/table-skeleton";
import { useQueryTable } from "@/hooks/use-query-table";
import {
  useDeleteContact,
  useDeleteContacts,
  useGetAllContacts,
} from "../contact-hooks";
import { useToast } from "@/hooks/use-toast";
import QueryTable from "@/components/query-table";
import { Button } from "@/components/ui/button";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { CRMContactFilters } from "@/interfaces/crm-contact.interface";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import CRMContactsPageFiltering from "./filtering";

// The crm contacts table and filters section

export default function CRMContactsTable() {
  const { toast } = useToast();
  const router = useRouter();
  // access
  const { has } = useAccess();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<CRMContactFilters>({
    page: 0,
    size: 10,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteContactMutation = useDeleteContact();
  const deleteContactsMutation = useDeleteContacts();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete contact",
      description:
        "Please be sure before you delete this contact because this action can not be undone.",
      handleDelete: () => handleDeleteContact(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/crm/contacts/update/${id}`);
    }
  };

  // handle View
  const handleView = (id: string) => {
    if (id) {
      router.push(`/crm/contacts/${id}`);
    }
  };

  const tableParams = useQueryTable({
    useGetData: useGetAllContacts,
    filters,
    columns: CRMContacts_TableColumns,
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeleteContact = async (contactId?: string) => {
    // Use the passed contactId or fallback to state

    if (!contactId) {
      console.error("No contact ID available for deletion");
      return;
    }

    try {
      await deleteContactMutation.mutateAsync({
        contactId: contactId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete Contact",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteContactsMutation.mutateAsync({
        contactIds: tableParams.table
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
            placeholder="Search by contact first/last name, bio"
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
          <CRMContactsPageFiltering filters={filters} setFilters={setFilters} />
          <DataTableViewOptions table={tableParams.table} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      <QueryTable<any>
        {...tableParams}
        selectedRowsActions={
          <>
            {has(["crm_contacts:delete"]) ? (
              <Button
                size="xs"
                type="button"
                variant="destructive"
                onClick={() =>
                  setDeletePopupProps({
                    open: true,
                    title: "Delete contacts",
                    description:
                      "Please be sure before you delete this contacts because this action can not be undone.",
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
            {has(["crm_contacts:update"]) ? (
              <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            ) : null}
            {has(["crm_contacts:delete"]) ? (
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
      {has(["crm_contacts:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteContactMutation.isPending || deleteContactsMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
