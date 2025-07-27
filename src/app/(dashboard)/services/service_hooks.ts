import axiosAPI from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleRetry } from "@/utils/retry";
import { ServiceInterface } from "@/interfaces/service_interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";

export function useGetAllServices() {
  return useQuery<ResponseAPIPaginationInterface<ServiceInterface>>({
    queryKey: ["services"],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`v1/services`, {
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch services");
        }

        return response.data!;
      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useGetService({ serviceId }: { serviceId?: string }) {
  return useQuery<ServiceInterface>({
    queryKey: ["services", "details", serviceId],
    staleTime: 600000, //10 min
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/services/${serviceId}`, {
        timeout: 120000,
      });

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to fetch service");
      }
      return response.data;
    },
    retry: handleRetry,
    enabled: !!serviceId,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosAPI.post(
        `v1/services`,
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
        queryKey: ["services"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosAPI.patch(
        `v1/services/${id}`,
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
        queryKey: ["services"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId }: { serviceId: string }) => {
      const response = await axiosAPI.delete(`v1/services/${serviceId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete service");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
  });
}

export function useDeleteServices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceIds }: { serviceIds: string[] }) => {
      let success = true;

      // Delete services
      for (const serviceId of serviceIds) {
        try {
          const response = await axiosAPI.delete(`v1/services/${serviceId}`, {
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
        queryKey: ["services"],
      });
    },
  });
}
