"use client";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { PageLayoutFilteringHeader } from "@/components/page-layout";

import useAccess from "@/hooks/use-access";

import { TableSearchInput } from "@/components/debounced-input";
import { useEffect, useState } from "react";
import QueryTable from "@/components/query-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Portfolio_TableColumns } from "./columns";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { useQueryTable } from "@/hooks/use-query-table";

import TableSkeleton from "@/components/table-skeleton";
import {
  useDeletePortfolio,
  useDeletePortfolios,
  useGetAllPortfolios,
} from "../api-hooks";
import { PortfolioInterface } from "@/interfaces/portfolio.interface";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DataTableViewMode from "@/components/data-table/data-table-view-mode";
import QueryGrid from "@/components/query-grid";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Calendar, ExternalLink } from "lucide-react";

export default function PortfolioTable() {
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
  const deletePortfolioMutation = useDeletePortfolio();
  const deletePortfoliosMutation = useDeletePortfolios();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });
  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete portfolio",
      description:
        "Please be sure before you delete this portfolio because this action can not be undone.",
      handleDelete: () => handleDeletePortfolio(id), // Pass the ID directly
    });
  };
  const handleUpdate = (id: string) => {
    router.push(`/portfolio/update/${id}`);
  };
  const handleView = (id: string) => {
    router.push(`/portfolio/${id}`);
  };

  const tableParams = useQueryTable<PortfolioInterface, undefined>({
    useGetData: useGetAllPortfolios,
    columns: Portfolio_TableColumns,
    isSortingEnabled: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeletePortfolio = async (portfolioId?: string) => {
    // Use the passed portfolioId or fallback to state

    if (!portfolioId) {
      console.error("No portfolio ID available for deletion");
      return;
    }

    try {
      await deletePortfolioMutation.mutateAsync({
        portfolioId: portfolioId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ??
          "Failed to delete Portfolio",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deletePortfoliosMutation.mutateAsync({
        portfolioIds: tableParams.table
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
        <QueryTable<PortfolioInterface>
          {...tableParams}
          selectedRowsActions={
            <>
              {has(["portfolio:delete"]) ? (
                <Button
                  size="xs"
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setDeletePopupProps({
                      open: true,
                      title: "Delete portfolios",
                      description:
                        "Please be sure before you delete this portfolios because this action can not be undone.",
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
              {has(["portfolio:update"]) ? (
                <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                  <HiOutlinePencil className="mr-2 h-4 w-4" />
                  Edit
                </ContextMenuItem>
              ) : null}
              {has(["portfolio:delete"]) ? (
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
        <QueryGrid<PortfolioInterface>
          {...tableParams}
          showContent={(item) => (
            <>
              {/* Media Preview */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <Image
                  src={
                    item.media[0]?.presignedUrl || "/36304133_8271520(2).jpg"
                  }
                  width={800}
                  height={450}
                  alt={item.media[0]?.alt || item.title.en}
                  className="w-full h-full object-cover"
                />

                {item.media.length > 1 && (
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary">
                      +{item.media.length - 1} more
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.categories.slice(0, 2).map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {category.name.en}
                    </Badge>
                  ))}
                  {item.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.categories.length - 2}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  <Link href={`/portfolio/${item.id}`}>{item.title.en}</Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex-col">
                <p className="text-accent-foreground text-sm mb-4 line-clamp-3">
                  {item.summary.en}
                </p>

                {/* Key Features */}
                {item.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 2).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature.key}: {feature.value}
                        </Badge>
                      ))}
                      {item.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-accent-foreground mb-4 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.createdAt, "PPP")}
                  </span>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/portfolio/${item.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Project
                  </Link>
                </Button>
              </CardContent>
            </>
          )}
        />
      )}
      <DataTablePagination table={tableParams.table} />
      {has(["portfolio:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deletePortfolioMutation.isPending ||
            deletePortfoliosMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
