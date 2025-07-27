"use client";
import { Button } from "@/components/ui/button";
import { HiTrash } from "react-icons/hi";
import {
  TableSearchInput,
  TableSearchInputRef,
} from "@/components/debounced-input";
import { Dispatch, SetStateAction, useMemo } from "react";

import { DataTableSelectFilter } from "@/components/data-table/data-table-select-filter";
import { useGetAllRoles } from "../../roles/role-hooks";
import { UserFilters } from "@/interfaces/user.interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersTableToolbarProps {
  filters: UserFilters;
  setFilters: Dispatch<SetStateAction<UserFilters>>;
  searchInputRef: React.RefObject<TableSearchInputRef | null>;
}

export function UsersTableToolbar({
  filters,
  setFilters,
  searchInputRef,
}: UsersTableToolbarProps) {
  const { data: roles } = useGetAllRoles({
    page: 0,
    size: 100,
  });

  const isFiltered = ["name", "role_id", "gender"].some((key) => {
    const value = filters?.[key as keyof typeof filters];
    return value !== undefined && value !== "";
  });

  const handleReset = () => {
    console.log("🔄 Reset button clicked");
    searchInputRef.current?.clear();
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        gender: undefined,
        role_id: undefined,
        name: undefined, // Changed from undefined to empty string
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
      <Select
        value={filters.gender || "both"}
        onValueChange={(e) =>
          setFilters((prevFilter) => ({
            ...prevFilter,
            gender: e == "both" ? undefined : e,
            page: 0,
          }))
        }
      >
        <SelectTrigger id="gender" className="w-full lg:w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="both">Gender</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
      {useMemo(
        () => (
          <DataTableSelectFilter
            title="Role"
            valueKey="role_id"
            value={filters?.role_id}
            options={
              roles?.data?.map((role) => ({
                label: role.name,
                value: role.id,
              })) || []
            }
            setFilterValue={({ value }) =>
              setFilters((prev) => ({
                ...prev,
                role_id: value,
                page: 0, // Reset to first page on search
              }))
            }
            className="w-full lg:w-auto"
          />
        ),
        [filters?.role_id, roles, setFilters]
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
