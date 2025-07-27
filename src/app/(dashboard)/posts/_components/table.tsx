"use client";

import { PageLayoutFilteringHeader } from "@/components/page-layout";
import { PostFilters, PostInterface } from "@/interfaces/post.interface";
import { useDeletePost, useDeletePosts, useGetAllPosts } from "../api-hooks";
import useAccess from "@/hooks/use-access";

import { useEffect, useRef, useState } from "react";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Posts_TableColumns } from "./columns";
import QueryTable from "@/components/query-table";
import { useQueryTable } from "@/hooks/use-query-table";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostTableToolbar } from "./table-toolbar";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { TableSearchInputRef } from "@/components/debounced-input";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DataTableViewMode from "@/components/data-table/data-table-view-mode";
import QueryGrid from "@/components/query-grid";
import { Badge } from "@/components/ui/badge";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import { formatDate } from "date-fns";
import Image from "next/image";
import { AVAILABLE_LANGUAGES } from "@/components/form-sections/title-content-multi-lang.section";

export default function PostsTable() {
  const { toast } = useToast();
  const { push } = useRouter();
  const searchInputRef = useRef<TableSearchInputRef>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<PostFilters>({
    type: "post",
    page: 1,
    size: 10,
  });

  // query hooks
  const deletePostsMutation = useDeletePosts();
  const deletePostMutation = useDeletePost();

  const [deletePopupProps, setDeletePopupProps] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    handleDelete?: any;
  }>({ open: false });
  // Add client-side only state to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = (id: string) => {
    setDeletePopupProps({
      open: true,
      title: "Delete post",
      description:
        "Please be sure before you delete this post because this action can not be undone.",
      handleDelete: () => handleDeletePost(id), // Pass the ID directly
    });
  };

  const handleUpdate = (id: string) => {
    // Navigate to the update page for the selected post
    push(`/posts/update/${id}`);
  };
  const handleView = (id: string) => {
    // Navigate to the details page for the selected post
    push(`/posts/${id}`);
  };

  // access info
  const { has } = useAccess();
  const tableParams = useQueryTable({
    useGetData: useGetAllPosts,
    filters,
    columns: Posts_TableColumns(filters.type || "post"),
    isSortingEnabled: false,
    isManualPagination: true,
    metaTableConfig: {
      has,
      handleDelete,
      handleUpdate,
      handleView,
    },
  });
  // Don't render anything until client-side
  if (!isClient) {
    return <TableSkeleton />;
  }

  const handleDeletePost = async (postId?: string) => {
    // Use the passed postId or fallback to state

    if (!postId) {
      console.error("No category ID available for deletion");
      return;
    }

    try {
      await deletePostMutation.mutateAsync({
        postId: postId,
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
      await deletePostsMutation.mutateAsync({
        postIds: tableParams.table
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
  return (
    <>
      <Tabs
        value={filters.type}
        onValueChange={(value) => {
          searchInputRef.current?.clear();
          setFilters((prev) => ({
            ...prev,
            type: value as PostFilters["type"],
            page: 1,
            search: undefined,
            categoryId: undefined,
          }));
        }}
      >
        <TabsList className="overflow-hidden">
          <TabsTrigger value="post">Articles</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="destination">Destination</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Filtering place */}
      <PageLayoutFilteringHeader>
        <PostTableToolbar
          filters={filters}
          setFilters={setFilters}
          searchInputRef={searchInputRef}
        />
        {/* filtering and toggling */}
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
        <QueryTable<PostInterface>
          {...tableParams}
          selectedRowsActions={
            <>
              {has(["post:delete"]) ? (
                <Button
                  size="xs"
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setDeletePopupProps({
                      open: true,
                      title: "Delete posts",
                      description:
                        "Please be sure before you delete this posts because this action can not be undone.",
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
              {has(["post:update"]) ? (
                <ContextMenuItem onClick={() => handleUpdate(row.id)}>
                  <HiOutlinePencil className="mr-2 h-4 w-4" />
                  Edit
                </ContextMenuItem>
              ) : null}
              {has(["post:delete"]) ? (
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
        <QueryGrid<PostInterface>
          {...tableParams}
          showContent={(item) => (
            <>
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
                <div className="absolute top-3 right-3 flex gap-1">
                  {Object.keys(item.title).map((lang) => (
                    <Badge key={lang} className="text-xs">
                      {
                        AVAILABLE_LANGUAGES.find(
                          (availableLang) => availableLang.code === lang
                        )?.name
                      }
                    </Badge>
                  ))}
                </div>
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
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  <Link href={`/posts/${item.id}`}>{item.title.en}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                <div
                  className="text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: item.content.en,
                  }}
                />
                <div className="flex items-center justify-between text-xs text-accent-foreground mb-3 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.createdAt, "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views > 1000
                      ? `${(item.views / 1000).toFixed(1)}k`
                      : item.views}
                  </span>
                </div>
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
      {has(["post:delete"]) ? (
        <DeleteConfirmPopup
          title={deletePopupProps.title || ""}
          description={deletePopupProps.description || ""}
          open={deletePopupProps.open}
          setOpen={(open) => {
            if (!open) setDeletePopupProps((prev) => ({ ...prev, open })); // Fixed: preserve other properties
          }}
          handleDelete={deletePopupProps.handleDelete}
          isLoading={
            deletePostsMutation.isPending || deletePostMutation.isPending
          }
        />
      ) : null}
    </>
  );
}
