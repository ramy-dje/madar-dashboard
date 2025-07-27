import axiosAPI from "@/lib/axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryType } from "@/interfaces/categories.interface";
import { handleRetry } from "@/utils/retry";
import TagInterface from "@/interfaces/tag.interface";
import { CreateTagValidationSchemaType } from "./_components/tag-form-modal";

export function useGetAllTags(filters?: { type?: CategoryType }) {
  return useQuery<{ data: TagInterface[] }>({
    queryKey: ["tags", filters?.type],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`v1/tags`, {
          params: { type: filters?.type },
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch tags");
        }
        console.log(response.data.data);
        return { data: response.data.data };
      } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTagValidationSchemaType) => {
      const response = await axiosAPI.post(`v1/tags`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create tag");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the tags query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateTagValidationSchemaType;
    }) => {
      const response = await axiosAPI.patch(
        `v1/tags/${id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update tag");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the tags query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tagId }: { tagId: string }) => {
      const response = await axiosAPI.delete(`v1/tags/${tagId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete tag");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
}

export function useDeleteTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tags }: { tags: string[] }) => {
      let success = true;

      // Delete files
      for (const tagId of tags) {
        try {
          const response = await axiosAPI.delete(`v1/tags/${tagId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting tag:", error);
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
        queryKey: ["tags"],
      });
    },
  });
}
