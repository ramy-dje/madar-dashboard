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
import {
  useDeleteService,
  useDeleteServices,
  useGetAllServices,
} from "../service_hooks";
import {
  ServiceFilters,
  ServiceInterface,
} from "@/interfaces/service_interface";
import { Service_TableColumns } from "@/app/(dashboard)/services/_components/columns";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DataTableViewMode from "@/components/data-table/data-table-view-mode";
import QueryGrid from "@/components/query-grid";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import Image from "next/image";
import { formatDate } from "date-fns";

export default function ServiceTable() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    size: 10,
  });

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
  const deleteServiceMutation = useDeleteService();
  const deleteServicesMutation = useDeleteServices();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });
  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete service",
      description:
        "Please be sure before you delete this service because this action can not be undone.",
      handleDelete: () => handleDeleteService(id), // Pass the ID directly
    });
  };
  const handleUpdate = (id: string) => {
    router.push(`/services/update/${id}`);
  };
  const handleView = (id: string) => {
    router.push(`/services/${id}`);
  };
  const tableParams = useQueryTable<ServiceInterface, undefined>({
    useGetData: useGetAllServices,
    columns: Service_TableColumns,
    isSortingEnabled: true,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });

  const handleDeleteService = async (serviceId?: string) => {
    // Use the passed serviceId or fallback to state

    if (!serviceId) {
      console.error("No service ID available for deletion");
      return;
    }

    try {
      await deleteServiceMutation.mutateAsync({
        serviceId: serviceId,
      });
      setDeletePopupProps((prev) => ({ ...prev, open: false }));
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to delete Service",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteServicesMutation.mutateAsync({
        serviceIds: tableParams.table
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
            setFilters((prev) => ({
              ...prev,
              search: value || undefined,
              page: 1, // Reset to first page on search
            }));
          }}
        />
        <div className="flex items-center gap-2">
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
        <QueryTable<ServiceInterface>
          {...tableParams}
          selectedRowsActions={
            <>
              {has(["service:delete"]) ? (
                <Button
                  size="xs"
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setDeletePopupProps({
                      open: true,
                      title: "Delete services",
                      description:
                        "Please be sure before you delete this service because this action can not be undone.",
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
              {has(["service:update"]) ? (
                <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                  <HiOutlinePencil className="mr-2 h-4 w-4" />
                  Edit
                </ContextMenuItem>
              ) : null}
              {has(["service:delete"]) ? (
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
        <QueryGrid<ServiceInterface>
          {...tableParams}
          showContent={(service) => (
            <>
              {/* Media Preview */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <Image
                  src={
                    service.media[0]?.presignedUrl || "/36304133_8271520(2).jpg"
                  }
                  width={800}
                  height={450}
                  alt={service.media[0]?.alt || service.title.en}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {service.categories?.slice(0, 2).map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {category.name.en}
                    </Badge>
                  ))}
                  {service.categories && service.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.categories.length - 2}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  <Link href={`/services/${service.id}`}>
                    {service.title.en}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div
                  className="text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: service.content.en,
                  }}
                />

                {/* Key Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                    <div className="space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-accent-foreground"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-700 flex-shrink-0" />
                          <span>
                            {feature.key}: {feature.value}
                          </span>
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <div className="text-xs text-accent-foreground ml-5">
                          +{service.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-accent-foreground mb-4 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(service.createdAt, "PPP")}
                  </span>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/services/${service.id}`}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </>
          )}
        />
      )}
      <DataTablePagination
        pageSize={filters.size || 10}
        setPageSize={(size) =>
          setFilters((prev) => ({
            ...prev,
            size,
            page: 1, // Reset to first page on size change
          }))
        }
        pageIndex={filters.page! - 1} // Convert from 1-based to 0-based
        setPageIndex={(index) =>
          setFilters((prev) => ({
            ...prev,
            page: index + 1, // Convert from 0-based to 1-based
          }))
        } // Convert back to 1-based
        totalPages={tableParams.paginationData?.totalPages || 1}
        canPreviousPage={tableParams.paginationData?.hasPrev || false}
        canNextPage={tableParams.paginationData?.hasNext || false}
      />
      {has(["service:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deleteServiceMutation.isPending || deleteServicesMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
