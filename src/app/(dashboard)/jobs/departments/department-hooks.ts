import JobDepartmentInterface from "@/interfaces/job-department.interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllDepartments(
  filters:
    | {
        name?: string;
        page?: number;
        size?: number;
      }
    | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<JobDepartmentInterface>>({
    queryKey: ["departments", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`jobs/departments`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch departments");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId }: { departmentId: string }) => {
      const response = await axiosAPI.delete(
        `jobs/departments/${departmentId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete department");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useDeleteDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentIds }: { departmentIds: string[] }) => {
      let success = true;

      // Delete departments
      for (const departmentId of departmentIds) {
        try {
          const response = await axiosAPI.delete(
            `jobs/departments/${departmentId}`,
            {
              timeout: 120000,
            }
          );

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting department:", error);
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
        queryKey: ["departments"],
      });
    },
  });
}
