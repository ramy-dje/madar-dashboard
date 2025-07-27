import axiosAPI from "@/lib/axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleRetry } from "@/utils/retry";
import { PortfolioInterface } from "@/interfaces/portfolio.interface";

export function useGetAllPortfolios() {
  return useQuery<{ data: PortfolioInterface[] }>({
    queryKey: ["portfolios"],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`v1/portfolio`, {
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch portfolios");
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useGetPortfolio({ portfolioId }: { portfolioId?: string }) {
  return useQuery<PortfolioInterface>({
    queryKey: ["portfolios", "details", portfolioId],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/portfolio/${portfolioId}`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch post");
      }
      return response.data!;
    },
    retry: handleRetry,
    enabled: !!portfolioId, // Only run if postId is provided
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosAPI.post(
        `v1/portfolio`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create portfolio");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the portfolios query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosAPI.patch(
        `v1/portfolio/${id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update portfolio");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the portfolios query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portfolioId }: { portfolioId: string }) => {
      const response = await axiosAPI.delete(`v1/portfolio/${portfolioId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete portfolio");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the portfolios query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
  });
}

export function useDeletePortfolios() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portfolioIds }: { portfolioIds: string[] }) => {
      let success = true;

      // Delete files
      for (const portfolioId of portfolioIds) {
        try {
          const response = await axiosAPI.delete(
            `v1/portfolio/${portfolioId}`,
            {
              timeout: 120000,
            }
          );

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting portfolio:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the portfolio query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
    },
  });
}
