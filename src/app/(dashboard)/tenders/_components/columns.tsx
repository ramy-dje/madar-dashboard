import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import {
  HiDotsHorizontal,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TenderInterface } from "@/interfaces/tender_interface";
import TenderStatus from "./tender-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Tender_TableColumns: ColumnDef<TenderInterface, any>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["tender:delete"]) ? null : (
        <Checkbox
          className="size-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      !(meta as any).has(["tender:delete"]) ? null : (
        <Checkbox
          checked={row.getIsSelected()}
          className="size-5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="TITLE"
        className="min-w-64 max-w-96"
      />
    ),
    accessorKey: "title",
  },

  {
    accessorKey: "categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CATEGORIES" />
    ),
    cell: ({ row }) => {
      const categories = row.original.categories;
      if (!categories || categories?.length === 0) return "-";
      return (
        <div className="flex flex-nowrap gap-2">
          {categories.slice(0, 2).map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className={cn("max-w-28 border border-border")}
            >
              <p className="truncate">{category.name.en}</p>
            </Badge>
          ))}
          {categories.length > 2 ? (
            <Badge
              title={
                categories
                  .slice(2)
                  .map(
                    (category, i, { length }) =>
                      // category.name + (length - 1 == i ? "" : ", ")
                      category + (length - 1 == i ? "" : ", ")
                  )
                  .join("") || ""
              }
              variant="secondary"
              className="border border-border"
            >
              ...
            </Badge>
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => <TenderStatus status={row.original.status} />,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="PUBLISHED AT"
        className="min-w-40 max-w-40"
      />
    ),
    cell: (c) =>
      DateTime.fromISO(c.row.original.createdAt).toFormat("dd-MM-yy"),
  },
  {
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    id: "actions",
    footer: "",
    enableHiding: false,
    enableSorting: false,
    accessorKey: "id",
    cell: (c) => {
      const { handleView, handleUpdate, handleDelete, has }: any =
        c.table?.options?.meta;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="filter"
              className="size-8 active:translate-y-0"
            >
              <HiDotsHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(c.row.original.id)}>
              <HiOutlineEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {has(["tender:update"]) ? (
              <DropdownMenuItem onClick={() => handleUpdate(c.row.original.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            {has(["tender:delete"]) ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(c.row.original.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <HiOutlineTrash className="mr-2 h-4 w-4 text-destructive" />
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
