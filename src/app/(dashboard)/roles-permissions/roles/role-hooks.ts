import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import RoleInterface from "@/interfaces/role.interface";

import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllRoles(
  filters: { page?: number; size?: number; number?: string } = {}
) {
  return useQuery<ResponseAPIPaginationInterface<RoleInterface>>({
    queryKey: ["roles", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`roles`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch roles");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId }: { roleId: string }) => {
      const response = await axiosAPI.delete(`roles/${roleId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete role");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
}

export function useDeleteRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleIds }: { roleIds: string[] }) => {
      let success = true;

      // Delete roles
      for (const roleId of roleIds) {
        try {
          const response = await axiosAPI.delete(`roles/${roleId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting role:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
}
