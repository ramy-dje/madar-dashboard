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
import { Badge } from "@/components/ui/badge";
import { TbCircleCheckFilled, TbLoader, TbXboxXFilled } from "react-icons/tb";
import { PostInterface } from "@/interfaces/post.interface";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export const Posts_TableColumns: (
  type: PostInterface["type"]
) => ColumnDef<PostInterface>[] = (type) => [
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["post:delete"]) ? null : (
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
      !(meta as any).has(["post:delete"]) ? null : (
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
      <DataTableColumnHeader column={column} title="TITLE" />
    ),
    accessorKey: "title",
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
    footer: "TITLE",
    enableSorting: false,
  },
  {
    accessorKey: "TYPE",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SHOW COMMENTS" />
    ),
    cell: ({ row }) => (
      <div className="w-20">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "showComments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SHOW COMMENTS" />
    ),
    cell: ({ row }) => (
      <div className="w-24">
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 flex items-center gap-1 w-fit"
        >
          {row.original.showComments ? (
            <>
              <TbCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400" />
              Active
            </>
          ) : (
            <>
              <TbXboxXFilled className="size-4 fill-red-500 dark:fill-red-400" />
              Inactive
            </>
          )}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  ...(type !== "event"
    ? ([
        {
          accessorKey: "readabilityEnabled",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="READ ABILITY" />
          ),
          cell: ({ row }) => (
            <div className="w-24">
              <Badge
                variant="outline"
                className="text-muted-foreground px-1.5 flex items-center gap-1 w-fit"
              >
                {row.original.readabilityEnabled ? (
                  <>
                    <TbCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400" />
                    Active
                  </>
                ) : (
                  <>
                    <TbXboxXFilled className="size-4 fill-red-500 dark:fill-red-400" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>
          ),
          enableSorting: false,
        },
      ] as ColumnDef<PostInterface>[])
    : ([
        {
          id: "startDate",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="START DATE" />
          ),
          accessorFn: (d) =>
            DateTime.fromISO(d.startDate as string).toFormat("dd-MM-yy"),
          enableSorting: false,
        },
        {
          id: "endDate",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="END DATE" />
          ),
          accessorFn: (d) =>
            DateTime.fromISO(d.endDate as string).toFormat("dd-MM-yy"),
          enableSorting: false,
        },
      ] as ColumnDef<PostInterface>[])),

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 flex items-center gap-1 w-fit"
      >
        {row.original.status === "published" ? (
          <TbCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400" />
        ) : (
          <TbLoader />
        )}
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    id: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PUBLISHED ON" />
    ),
    accessorFn: (d) =>
      DateTime.fromISO(d.createdAt as string).toFormat("dd-MM-yy"),
    enableSorting: false,
  },
  {
    accessorKey: "views",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VIEWS" />
    ),
    enableSorting: false,
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
          {categories.slice(0, 2).map((categories) => (
            <Badge
              key={categories.id}
              variant="secondary"
              className={cn("max-w-28 border border-border")}
            >
              <p className="truncate">{categories.name.en}</p>
            </Badge>
          ))}
          {categories.length > 2 ? (
            <Badge
              title={
                categories
                  .slice(2)
                  .map(
                    (categories, i, { length }) =>
                      categories.name.en + (length - 1 == i ? "" : ", ")
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
              key={`tag-${tag.name.en}`}
              style={{
                backgroundColor: `rgb(from ${tag.color} r g b / 0.1)`,
                borderColor: `rgb(from ${tag.color} r g b / 0.5)`,
                color: `rgb(from ${tag.color} r g b / 1)`,
              }}
              className="w-max flex items-center px-3 py-0.5 gap-2 text-xs rounded-full border font-medium"
            >
              {tag.name.en}
            </span>
          ))}
          {tags.length > 2 ? (
            <Badge
              title={
                tags
                  .slice(2)
                  .map(
                    (tag, i, { length }) =>
                      tag.name.en + (length - 1 == i ? "" : ", ")
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    id: "actions",
    footer: "",
    enableHiding: false,
    enableSorting: false,
    accessorKey: "id",
    cell: (c) => {
      const { handleDelete, handleUpdate, handleView, has }: any =
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
            {has(["post:update"]) ? (
              <DropdownMenuItem onClick={() => handleUpdate(c.row.original.id)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            {has(["post:delete"]) ? (
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
