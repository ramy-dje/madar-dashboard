import axiosAPI from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleRetry } from "@/utils/retry";
import { TenderInterface } from "@/interfaces/tender_interface";

export function useGetAllTenders() {
  return useQuery<{ data: TenderInterface[] }>({
    queryKey: ["tenders"],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`api/tenders`, {
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch tenders");
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching tenders:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useGetTender({ tenderId }: { tenderId?: string }) {
  return useQuery<TenderInterface>({
    queryKey: ["tenders", "details", tenderId],
    staleTime: 600000, //10 min
    queryFn: async () => {
      const response = await axiosAPI.get(`api/tenders/${tenderId}`, {
        timeout: 120000,
      });

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to fetch service");
      }
      return response.data;
    },
    retry: handleRetry,
    enabled: !!tenderId,
  });
}

export function useCreateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosAPI.post(
        `api/tenders`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create service");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenders"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosAPI.patch(
        `api/tenders/${id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update service");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenders"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteTender() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenderId }: { tenderId: string }) => {
      const response = await axiosAPI.delete(`api/tenders/${tenderId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete service");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenders"],
      });
    },
  });
}

export function useDeleteTenders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenderIds }: { tenderIds: string[] }) => {
      let success = true;

      // Delete tenders
      for (const tenderId of tenderIds) {
        try {
          const response = await axiosAPI.delete(`api/tenders/${tenderId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting service:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the service query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["tenders"],
      });
    },
  });
}
