import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryInterface from "../../interfaces/categories.interface";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

export const Categories_TableColumns: ColumnDef<CategoryInterface, any>[] = [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["category:delete"]) ? null : (
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
      !(meta as any).has(["category:delete"]) ? null : (
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
        title="NAME"
        className="min-w-64 max-w-96"
      />
    ),
    accessorKey: "name.en",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="DESCRIPTION"
        className="min-w-96 max-w-96"
      />
    ),
    enableSorting: false,
    accessorKey: "description",
    cell: (c) => (
      <div className="max-w-96 truncate">
        {c.row.original.description ?? "-"}
      </div>
    ),
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
    header: "",
    id: "Action",
    footer: "",
    enableHiding: false,
    enableSorting: false,
    accessorKey: "id",
    cell: (c) => {
      const { handleUpdate, handleDelete, has }: any = c.table?.options?.meta;
      return (
        <div className="flex items-center justify-end gap-3">
          {has(["category:update"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(c.row.original)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          ) : null}
          {has(["category:delete"]) ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(c.row.original.id)}
              className="size-7 text-foreground/80 transition-all hover:text-primary hover:border-primary"
            >
              <HiOutlineTrash className="size-4" />
            </Button>
          ) : null}
        </div>
      );
    },
  },
];
