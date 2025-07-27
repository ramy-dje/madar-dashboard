"use client";
import { Button } from "@/components/ui/button";
import { HiTrash } from "react-icons/hi";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import { Dispatch, SetStateAction, useMemo } from "react";

import { DataTableSelectFilter } from "@/components/data-table/data-table-select-filter";
import { JobSubmissionFilters } from "@/interfaces/job-submission.interface";
import { useGetAllJobs } from "../../positions/job-hooks";

interface JobSubmissionsTableToolbarProps {
  filters: JobSubmissionFilters;
  setFilters: Dispatch<SetStateAction<JobSubmissionFilters>>;
  searchInputRef: React.RefObject<TableSearchInputRef | null>;
}

export function JobSubmissionsTableToolbar({
  filters,
  setFilters,
  searchInputRef,
}: JobSubmissionsTableToolbarProps) {
  const { data: jobs } = useGetAllJobs({
    page: 0,
    size: 100,
  });

  const isFiltered = ["name", "job"].some((key) => {
    const value = filters?.[key as keyof typeof filters];
    return value !== undefined && value !== "";
  });

  const handleReset = () => {
    console.log("🔄 Reset button clicked");
    searchInputRef.current?.clear();
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        job: undefined,
        name: "", // Changed from undefined to empty string
        page: 0, // Reset to first page on search
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
          initialValue={filters?.name || ""}
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
      {useMemo(
        () => (
          <DataTableSelectFilter
            title="Job"
            valueKey="job"
            value={filters?.job}
            options={
              jobs?.data?.map((job) => ({
                label: job.title,
                value: job.id,
              })) || []
            }
            setFilterValue={({ value }) =>
              setFilters((prev) => ({
                ...prev,
                job: value,
                page: 0, // Reset to first page on search
              }))
            }
            className="w-full lg:w-auto"
          />
        ),
        [filters?.job, jobs, setFilters]
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
