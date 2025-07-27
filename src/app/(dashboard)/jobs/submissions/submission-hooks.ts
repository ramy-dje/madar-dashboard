import JobSubmissionInterface, {
  JobSubmissionFilters,
} from "@/interfaces/job-submission.interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllSubmissions(
  filters: JobSubmissionFilters | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<JobSubmissionInterface>>({
    queryKey: ["submissions", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`jobs/submissions`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch submissions");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionId }: { submissionId: string }) => {
      const response = await axiosAPI.delete(
        `jobs/submissions/${submissionId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete submission");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["submissions"],
      });
    },
  });
}

export function useDeleteSubmissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionIds }: { submissionIds: string[] }) => {
      let success = true;

      // Delete submissions
      for (const submissionId of submissionIds) {
        try {
          const response = await axiosAPI.delete(
            `jobs/submissions/${submissionId}`,
            {
              timeout: 120000,
            }
          );

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting submission:", error);
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
        queryKey: ["submissions"],
      });
    },
  });
}
