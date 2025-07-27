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
import { PortfolioInterface } from "@/interfaces/portfolio.interface";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PortfolioStatus from "@/app/(dashboard)/portfolio/_components/portfolio-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Portfolio_TableColumns: ColumnDef<PortfolioInterface, any>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["portfolio:delete"]) ? null : (
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
      !(meta as any).has(["portfolio:delete"]) ? null : (
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
    cell: ({ getValue }) => {
      const title = getValue() as { en: string };
      return title ? (
        <span title={title.en} className="max-w-96 truncate">
          {title.en}
        </span>
      ) : (
        "---"
      );
    },
    accessorKey: "title",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="SUMMARY"
        className="min-w-96 max-w-96"
      />
    ),
    enableSorting: false,
    accessorKey: "summary",
    cell: (c) => (
      <div className="max-w-96 truncate">
        {c.row.original.summary.en ?? "-"}
      </div>
    ),
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
          {categories.slice(0, 2).map((category, index) => (
            <Badge
              key={category?.id || index}
              variant="secondary"
              className={cn("max-w-28 border border-border")}
            >
              <p className="truncate">{category?.name?.en || ""}</p>
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
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags || tags?.length === 0) return "-";
      return (
        <div className="flex flex-nowrap gap-2">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={`tag-${tag.name}`}
              style={{
                backgroundColor: `rgb(from ${tag.color} r g b / 0.1)`,
                borderColor: `rgb(from ${tag.color} r g b / 0.5)`,
                color: `rgb(from ${tag.color} r g b / 1)`,
              }}
              className="w-max flex items-center px-3 py-0.5 gap-2 text-xs rounded-full border font-medium"
            >
              {""}
            </span>
          ))}
          {tags.length > 2 ? (
            <Badge
              title={
                tags
                  .slice(2)
                  .map(
                    (tag, i, { length }) =>
                      tag.name + (length - 1 == i ? "" : ", ")
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
    cell: ({ row }) => <PortfolioStatus status={row.original.status} />,
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
            {has(["portfolio:update"]) ? (
              <DropdownMenuItem onClick={() => handleUpdate(c.row.original.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            {has(["portfolio:delete"]) ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(c.row.original.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <HiOutlineTrash className="mr-2 h-4 w-4 text-destructive" />
                  Delete
                </DropdownMenuItem>{" "}
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
