import axiosAPI from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleRetry } from "@/utils/retry";
import { FAQInterface, QAPairInterface } from "@/interfaces/faq_interface";

export function useGetAllFAQs() {
  return useQuery<{ data: FAQInterface[] }>({
    queryKey: ["faqs"],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`v1/faq`, {
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch faqs");
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching faqs:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useGetFAQ({ faqId }: { faqId?: string }) {
  return useQuery<FAQInterface>({
    queryKey: ["faqs", "details", faqId],
    staleTime: 600000, //10 min
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/faq/${faqId}`, {
        timeout: 120000,
      });

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to fetch FAQ");
      }
      return response.data;
    },
    retry: handleRetry,
    enabled: !!faqId,
  });
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosAPI.post(`v1/faq`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create FAQ");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosAPI.patch(
        `v1/faq/${id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update FAQ");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ faqId }: { faqId: string }) => {
      const response = await axiosAPI.delete(`v1/faq/${faqId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete FAQ");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
  });
}

export function useDeleteFAQs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ faqIds }: { faqIds: string[] }) => {
      let success = true;

      // Delete FAQs
      for (const faqId of faqIds) {
        try {
          const response = await axiosAPI.delete(`v1/faq/${faqId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the FAQ query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
  });
}

export function useCreateQAPairs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      faqId,
      data,
    }: {
      faqId: string;
      data: Omit<QAPairInterface, "_id">;
    }) => {
      const response = await axiosAPI.post(
        `v1/faq/${faqId}/qa-pairs`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create QA pair");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateQAPairs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      faqId,
      data,
    }: {
      faqId: string;
      data: QAPairInterface;
    }) => {
      const response = await axiosAPI.patch(
        `v1/faq/${faqId}/qa-pairs/${data._id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update QA pair");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteQAPairs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      faqId,
      qaPairId,
    }: {
      faqId: string;
      qaPairId: string;
    }) => {
      const response = await axiosAPI.delete(
        `v1/faq/${faqId}/qa-pairs/${qaPairId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete QA pair");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
    },
  });
}
