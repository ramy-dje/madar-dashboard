"use client";
import { Button } from "@/components/ui/button";
import { HiTrash } from "react-icons/hi";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import { Dispatch, SetStateAction, useMemo } from "react";
import { PostFilters } from "@/interfaces/post.interface";
import { CategoryType } from "@/interfaces/categories.interface";
import { useGetAllCategories } from "@/components/categories-page/api-hooks";
import { DataTableSelectFilter } from "@/components/data-table/data-table-select-filter";
import { useGetAllTags } from "@/components/tags-page/api-hooks";
import { DataTableMultiSelectFilter } from "@/components/data-table/data-table-multi-select-filter";

interface PostTableToolbarProps {
  filters: PostFilters;
  setFilters: Dispatch<SetStateAction<PostFilters>>;
  searchInputRef: React.RefObject<TableSearchInputRef | null>;
}

export function PostTableToolbar({
  filters,
  setFilters,
  searchInputRef,
}: PostTableToolbarProps) {
  const { data: postCategories } = useGetAllCategories({
    type: CategoryType.POST,
  });
  const { data: postTags } = useGetAllTags({
    type: CategoryType.POST,
  });

  const isFiltered = ["categoryId", "search", "tagId"].some((key) => {
    const value = filters?.[key as keyof typeof filters];
    return value !== undefined && value !== "";
  });

  const handleReset = () => {
    console.log("🔄 Reset button clicked");
    searchInputRef.current?.clear();
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        categoryId: undefined,
        search: undefined, // Changed from undefined to empty string
        page: 1, // Reset to first page on search
      };
      return newFilters;
    });
  };

  return (
    <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center flex-wrap">
      <div className="w-full lg:w-[22em]">
        {/* searching */}
        <TableSearchInput
          ref={searchInputRef}
          initialValue={filters?.search || ""}
          onChange={(value) => {
            setFilters((prev) => {
              const newFilters = {
                ...prev,
                search: value || undefined,
                page: 1, // Reset to first page on search
              };
              return newFilters;
            });
          }}
        />
      </div>
      {useMemo(
        () => (
          <DataTableSelectFilter
            title="Category"
            valueKey="categoryId"
            value={filters?.categoryId}
            options={
              postCategories?.data?.map((category) => ({
                label: category.name.en,
                value: category.id,
              })) || []
            }
            setFilterValue={({ value }) =>
              setFilters((prev) => ({
                ...prev,
                categoryId: value,
                page: 1, // Reset to first page on search
              }))
            }
            className="w-full lg:w-auto"
          />
        ),
        [filters?.categoryId, postCategories, setFilters]
      )}
      {useMemo(
        () => (
          <DataTableMultiSelectFilter
            title="Tag"
            valueKey="tagIds"
            value={filters?.tagIds?.split(",") || []}
            options={
              Array.isArray(postTags?.data)
                ? postTags?.data?.map((tag) => ({
                    label: tag.name.en,
                    value: tag.id,
                  }))
                : []
            }
            setFilterValue={({ value }) =>
              setFilters((prev) => ({
                ...prev,
                tagIds: value?.join(",") || undefined,
                page: 1, // Reset to first page on search
              }))
            }
            className="w-full lg:w-auto"
          />
        ),
        [filters?.tagIds, postTags, setFilters]
      )}

      {isFiltered && (
        <Button
          variant="filter"
          onClick={handleReset}
          className="px-2 lg:px-3 w-full lg:w-auto"
        >
          Reset
          <HiTrash className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}
