import { ColumnDef, ColumnHelper } from "@tanstack/react-table";
import { FileInterface, FolderInterface } from "@/interfaces/file-manager";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HiLockClosed,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlineInformationCircle,
  HiDotsHorizontal,
} from "react-icons/hi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DateTime } from "luxon";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import formatFileSize from "@/utils/file-size";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getFilesColumns: (
  columnHelper: ColumnHelper<FileInterface>
) => ColumnDef<FileInterface, any>[] = (columnHelper) => [
  columnHelper.accessor("id", {
    id: "select",
    header: ({ table }) => {
      const {
        has,
        displayedFiles,
        displayedFolders,
        selectedFiles,
        selectedFolders,
        handleSelectAll,
      } = (table.options.meta as any) ?? {};
      return !(
        has(["file_manager:delete"]) || has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={
            selectedFiles.length + selectedFolders.length > 0
              ? selectedFiles.length + selectedFolders.length ===
                displayedFiles.length + displayedFolders.length
                ? true
                : "indeterminate"
              : false
          }
          disabled={displayedFiles.length + displayedFolders.length === 0}
          onCheckedChange={(value) => handleSelectAll(!!value)}
          aria-label="Select all"
          className="size-5"
        />
      );
    },
    cell: ({
      getValue,
      table: {
        options: { meta },
      },
    }) =>
      !(
        (meta as any).has(["file_manager:delete"]) ||
        (meta as any).has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={(meta as any)?.selectedFiles?.includes(getValue())}
          className="size-5"
          onCheckedChange={(value) =>
            (meta as any)?.handleSelectFile(getValue(), value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor(
    (row) => ({
      name: row.originalname,
      type: row.type,
    }),
    {
      id: "name",
      cell: (info) => {
        const { name, type } = info.getValue();
        return (
          <div className="flex items-center gap-4 max-w-96">
            <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted shrink-0">
              {getFileIcon(type)}
            </div>
            <span className="ml-2 truncate">{name}</span>
          </div>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="min-w-80"
        />
      ),
    }
  ),
  columnHelper.accessor("size", {
    id: "size",
    cell: (info) => formatFileSize(info.getValue()),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published At" />
    ),
    cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd MMM yyyy"),
  }),
  // columnHelper.accessor("sharedWith", {
  //   header: <DataTableColumnHeader column={column} title="Shared with" />,
  //   cell: (info) => {
  //     const sharedWith: SharedWith[] = info.getValue();
  //     if (sharedWith.length === 0) return "-";
  //     return (
  //       <StackedAvatar
  //         users={sharedWith.map((user) => ({
  //           id: user.id,
  //           fullName: user.fullName,
  //           pic: user.pic,
  //         }))}
  //         limit={5}
  //       />
  //     );
  //   },
  //   enableSorting: false,
  // }),
  // columnHelper.accessor("sharedWithRoles", {
  //   header: <DataTableColumnHeader column={column} title="Shared with roles" />,
  //   cell: (info) => {
  //     const sharedWithRoles: SharedWithRoles[] | undefined = info.getValue();
  //     if (!sharedWithRoles || sharedWithRoles?.length === 0) return "-";
  //     return (
  //       <div className="flex flex-nowrap gap-2">
  //         {sharedWithRoles.slice(0, 2).map((role) => (
  //           <Badge
  //             key={role.roleId}
  //             variant="secondary"
  //             className={cn("max-w-28 border border-border")}
  //             style={{
  //               backgroundColor: role.role?.color || "var(--secondary)",
  //             }}
  //           >
  //             <p className="truncate">{role.role?.name || role.roleId}</p>
  //           </Badge>
  //         ))}
  //         {sharedWithRoles.length > 2 ? (
  //           <Badge
  //             title={
  //               sharedWithRoles
  //                 .slice(2)
  //                 .map(
  //                   (role, i, { length }) =>
  //                     (role.role?.name || role.roleId) +
  //                     (length - 1 == i ? "" : ", ")
  //                 )
  //                 .join("") || ""
  //             }
  //             variant="secondary"
  //             className="border border-border"
  //           >
  //             ...
  //           </Badge>
  //         ) : null}
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // }),

  columnHelper.accessor("id", {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: (c) => {
      const id = c.getValue();
      const { handleFileClick, handleDownload, has }: any =
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
            <DropdownMenuItem
              onClick={() =>
                handleFileClick({ fileId: id, action: "viewFile" })
              }
            >
              <HiOutlineEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload(id, () => {})}>
              <HiOutlineDownload className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            {has(["file_manager:share"]) ? (
              <DropdownMenuItem
                onClick={() =>
                  handleFileClick({ fileId: id, action: "shareFile" })
                }
              >
                <HiOutlineShare className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            ) : null}
            {has(["file_manager:update"]) ? (
              <DropdownMenuItem
                onClick={() =>
                  handleFileClick({ fileId: id, action: "editFile" })
                }
              >
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            {has(["file_manager:delete"]) ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleFileClick({ fileId: id, action: "deleteFile" })
                  }
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
    enableHiding: false,
    enableSorting: false,
  }),
];

export const getFoldersColumns: (
  columnHelper: ColumnHelper<FolderInterface>
) => ColumnDef<FolderInterface, any>[] = (columnHelper) => [
  columnHelper.accessor(() => "", {
    id: "select",
    header: () => {},
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) =>
      !(
        (meta as any).has(["file_manager:delete"]) ||
        (meta as any).has(["file_manager:update"])
      ) ? null : (
        <Checkbox
          checked={(meta as any)?.selectedFolders?.includes(row.original.id)}
          className="size-5"
          onCheckedChange={(value) =>
            (meta as any)?.handleSelectFolder(row.original.id, value)
          }
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor(
    (row) => ({
      name: row.name,
      id: row.id,
      accessibility: row.accessibility,
      note: row.note,
    }),
    {
      id: "name",
      cell: (info) => {
        const { id, name, accessibility, note } = info.getValue();
        const { handleFolderClick } = info.table.options.meta as any;
        return (
          <div
            className="flex items-center gap-4 cursor-pointer "
            onClick={() => handleFolderClick(id, accessibility)}
          >
            <div className="relative flex flex-row justify-center items-center size-12 rounded-xl bg-muted shrink-0">
              {getFileIcon("folder")}
              {accessibility === "protected" ? (
                <div className="absolute bottom-2 right-1">
                  <HiLockClosed className="size-4 text-primary" />
                </div>
              ) : null}
            </div>
            <span className="ml-2">{name}</span>
            {note && (
              <HoverCard>
                <HoverCardTrigger>
                  <HiOutlineInformationCircle className="size-5" />
                </HoverCardTrigger>
                <HoverCardContent className="text-pretty w-full max-w-96">
                  {note}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
      header: "Name",
    }
  ),
  columnHelper.accessor("totalSize", {
    id: "size",
    cell: (info) => formatFileSize(info.getValue()),
    header: "Size",
  }),

  columnHelper.accessor("createdAt", {
    header: "Published At",
    cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd MMM yyyy"),
  }),

  // columnHelper.accessor("sharedWith", {
  //   header: "",
  //   cell: (info) => {
  //     const sharedWith: SharedWith[] = info.getValue();
  //     if (sharedWith.length === 0) return "-";
  //     return (
  //       <StackedAvatar
  //         users={sharedWith.map((user) => ({
  //           id: user.id,
  //           fullName: user.fullName,
  //           pic: user.pic,
  //         }))}
  //         limit={5}
  //       />
  //     );
  //   },
  // }),
  // columnHelper.accessor("sharedWithRoles", {
  //   header: "Shared with roles",
  //   cell: (info) => {
  //     const sharedWithRoles: SharedWithRoles[] = info.getValue();
  //     if (!sharedWithRoles || sharedWithRoles?.length === 0) return "-";
  //     return (
  //       <div className="flex flex-nowrap gap-2">
  //         {sharedWithRoles.slice(0, 2).map((role) => (
  //           <span
  //             key={role.roleId}
  //             style={{
  //               backgroundColor: `rgb(from ${role.role?.color} r g b / 0.1)`,
  //               borderColor: `rgb(from ${role.role?.color} r g b / 0.5)`,
  //               color: `rgb(from ${role.role?.color} r g b / 1)`,
  //             }}
  //             className="max-w-28 flex items-center px-3 py-0.5 gap-2 text-xs rounded-md border font-medium"
  //           >
  //             <span className="truncate">{role.role?.name || role.roleId}</span>
  //           </span>
  //         ))}
  //         {sharedWithRoles.length > 2 ? (
  //           <Badge
  //             title={
  //               sharedWithRoles
  //                 .slice(2)
  //                 .map(
  //                   (role, i, { length }) =>
  //                     (role.role?.name || role.roleId) +
  //                     (length - 1 == i ? "" : ", ")
  //                 )
  //                 .join("") || ""
  //             }
  //             variant="secondary"
  //             className="border border-border"
  //           >
  //             ...
  //           </Badge>
  //         ) : null}
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // }),

  columnHelper.accessor((row) => row, {
    id: "actions",
    header: "",
    cell: (c) => {
      const folder = c.getValue();
      const { handleFileClick, handleUpdateFolder, has }: any =
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
            {has(["file_manager:share"]) ? (
              <DropdownMenuItem
                onClick={() =>
                  handleFileClick({
                    folderId: folder.id,
                    action: "shareFolder",
                  })
                }
              >
                <HiOutlineShare className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            ) : null}
            {has(["file_manager:update"]) ? (
              <DropdownMenuItem onClick={() => handleUpdateFolder(folder)}>
                <HiOutlinePencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            ) : null}
            {has(["file_manager:delete"]) ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleFileClick({
                      folderId: folder.id,
                      action: "deleteFolder",
                    })
                  }
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
    enableHiding: false,
    enableSorting: false,
  }),
];
