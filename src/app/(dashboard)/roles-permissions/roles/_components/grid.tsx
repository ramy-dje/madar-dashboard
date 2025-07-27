import React, { useState } from "react";
import { useGetAllRoles } from "../role-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyIcon } from "@/components/query-table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAccess from "@/hooks/use-access";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import DeleteRolePopup from "./delete-role-popup";
import ErrorAlert from "@/components/error-alert";

export default function RolesGrid() {
  const { has } = useAccess();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSelected, setDeleteSelected] = useState<string | null>(null);

  // methods
  // handle update
  const handleUpdate = (id: string) => {
    if (id) {
      // pushing the update role page
      router.push(`/roles-permissions/roles/update/${id}`);
    }
  };

  // // handle delete
  const handleDelete = (id: string) => {
    if (id) {
      setDeleteSelected(id);
      setDeleteDialogOpen(true);
    }
  };
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = useGetAllRoles({
    page: 0,
    size: 100,
  });
  return (
    <>
      {/* delete role dialog */}
      {has(["role:delete"]) ? (
        <DeleteRolePopup
          id={deleteSelected}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
        />
      ) : null}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(8)].map((_, index) => (
            <Skeleton className="w-full h-36" key={`skeleton-${index}`} />
          ))
        ) : isError ? (
          <ErrorAlert
            title="Error fetching roles"
            error={error}
            defaultMessage="Failed to roles. Please try again."
          />
        ) : roles?.data.length === 0 ? (
          <div className="text-center py-8 col-span-2 sm:col-span-3">
            <div className="flex flex-col items-center justify-center ">
              <EmptyIcon />
              <p className="text-sm text-muted-foreground">No roles found</p>
            </div>
          </div>
        ) : (
          <>
            {roles?.data.map((role) => (
              <Card
                key={role.id}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="p-4 flex flex-col">
                  <div className="flex items-center gap-2">
                    <div
                      className="relative flex flex-role justify-center items-center size-12 rounded-xl"
                      style={{ backgroundColor: role.color }}
                    >
                      <Image
                        src="/icons/folder-user.svg"
                        alt="doc"
                        width={26}
                        height={26}
                        loading="lazy"
                        className={cn("aspect-square")}
                        decoding="async"
                      />
                    </div>
                    <h4 className="mb-1 truncate text-lg font-medium text-foreground">
                      {role.name}
                    </h4>
                  </div>
                </CardContent>
                {(has(["role:update"]) || has(["role:delete"])) &&
                role.deletable ? (
                  <CardFooter className="flex  items-center gap-2">
                    {has(["role:update"]) ? (
                      <Button
                        variant="outline"
                        onClick={() => handleUpdate(role.id)}
                        className="flex-1 w-full"
                      >
                        <HiOutlinePencil className="size-4" /> Edit Role
                      </Button>
                    ) : null}
                    {has(["role:delete"]) ? (
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(role.id)}
                        className="flex-1 w-full"
                      >
                        <HiOutlineTrash className="size-4" /> Delete Role
                      </Button>
                    ) : null}
                  </CardFooter>
                ) : null}
              </Card>
            ))}
          </>
        )}
      </div>
    </>
  );
}
