import JobInterface, { JobFiltersInterface } from "@/interfaces/job.interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllJobs(filters: JobFiltersInterface | undefined = {}) {
  return useQuery<ResponseAPIPaginationInterface<JobInterface>>({
    queryKey: ["jobs", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`jobs`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch jobs");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      const response = await axiosAPI.delete(`jobs/${jobId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete job");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
    },
  });
}

export function useDeleteJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobIds }: { jobIds: string[] }) => {
      let success = true;

      // Delete jobs
      for (const jobId of jobIds) {
        try {
          const response = await axiosAPI.delete(`jobs/${jobId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting job:", error);
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
        queryKey: ["jobs"],
      });
    },
  });
}
