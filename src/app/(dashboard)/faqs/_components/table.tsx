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
import { FAQInterface } from "@/interfaces/faq_interface";
import {
  useDeleteFAQ,
  useDeleteFAQs,
  useGetAllFAQs,
} from "@/app/(dashboard)/faqs/faq_hooks";
import { FAQ_TableColumns } from "@/app/(dashboard)/faqs/_components/columns";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DataTableViewMode from "@/components/data-table/data-table-view-mode";
import QueryGrid from "@/components/query-grid";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FaqStatus from "./faq-status";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { formatDate } from "date-fns";

export default function FAQTable() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  // access
  const { has } = useAccess();

  const router = useRouter();

  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // query hooks
  const deleteFAQMutation = useDeleteFAQ();
  const deleteFAQsMutation = useDeleteFAQs();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });
  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete FAQ",
      description:
        "Please be sure before you delete this FAQ because this action can not be undone.",
      handleDelete: () => handleDeleteFAQ(id), // Pass the ID directly
    });
  };
  const handleUpdate = (id: string) => {
    router.push(`/faqs/update/${id}`);
  };
  const handleView = (id: string) => {
    router.push(`/faqs/${id}`);
  };
  const tableParams = useQueryTable<FAQInterface, undefined>({
    useGetData: useGetAllFAQs,
    columns: FAQ_TableColumns,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeleteFAQ = async (faqId?: string) => {
    // Use the passed faqId or fallback to state

    if (!faqId) {
      console.error("No faq ID available for deletion");
      return;
    }

    try {
      await deleteFAQMutation.mutateAsync({
        faqId: faqId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete FAQ",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteFAQsMutation.mutateAsync({
        faqIds: tableParams.table
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
        <div className="flex items-center max-sm:flex-row gap-2 justify-end">
          {/* The visibalt */}
          {viewMode === "list" && (
            <div className="flex justify-end">
              <DataTableViewOptions table={tableParams.table} />
            </div>
          )}
          <DataTableViewMode viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table */}
      {viewMode === "list" ? (
        <QueryTable<FAQInterface>
          {...tableParams}
          selectedRowsActions={
            <>
              {has(["faq:delete"]) ? (
                <Button
                  size="xs"
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setDeletePopupProps({
                      open: true,
                      title: "Delete FAQs",
                      description:
                        "Please be sure before you delete this FAQS because this action can not be undone.",
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
              {has(["faq:update"]) ? (
                <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                  <HiOutlinePencil className="mr-2 h-4 w-4" />
                  Edit
                </ContextMenuItem>
              ) : null}
              {has(["faq:delete"]) ? (
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
      ) : (
        <QueryGrid<FAQInterface>
          {...tableParams}
          showContent={(faq) => (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <FaqStatus status={faq.status} />
                  <span className="text-xs text-accent-foreground">
                    {faq.qaPairs.length} questions
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  <Link href={`/faqs/${faq.id}`}>{faq.title}</Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                {/* Preview of first few questions */}
                <div className="space-y-2 mb-4">
                  {faq.qaPairs.slice(0, 2).map((qa) => (
                    <div key={qa._id} className="text-sm">
                      <p className="font-medium line-clamp-1">
                        Q: {qa.question}
                      </p>
                      <p className="line-clamp-2 mt-1">A: {qa.answer}</p>
                    </div>
                  ))}
                  {faq.qaPairs.length > 2 && (
                    <p className="text-xs text-accent-foreground">
                      +{faq.qaPairs.length - 2} more questions
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-accent-foreground mb-4 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(faq.createdAt, "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {faq.qaPairs.length} Q&A
                  </span>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/faqs/${faq.id}`}>Manage Questions</Link>
                </Button>
              </CardContent>
            </>
          )}
        />
      )}
      <DataTablePagination table={tableParams.table} />
      {has(["faq:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteFAQMutation.isPending || deleteFAQsMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
