import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import { UserFilters, UserInterface } from "@/interfaces/user.interfaces";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllUsers(filters: UserFilters | undefined = {}) {
  return useQuery<ResponseAPIPaginationInterface<UserInterface>>({
    queryKey: ["users", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`user`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch users");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await axiosAPI.delete(`user/${userId}`, {
        timeout: 120000,
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete user");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds }: { userIds: string[] }) => {
      let success = true;

      // Delete users
      for (const userId of userIds) {
        try {
          const response = await axiosAPI.delete(`user/${userId}`, {
            timeout: 120000,
          });

          if (response.status !== 200) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting user:", error);
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
        queryKey: ["users"],
      });
    },
  });
}
