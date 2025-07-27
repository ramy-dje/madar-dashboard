import axiosAPI from "@/lib/axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryValidationSchemaType } from "./_components/category-form-modal";
import CategoryInterface, {
  CategoryType,
} from "@/interfaces/categories.interface";
import { handleRetry } from "@/utils/retry";

export function useGetAllCategories(filters?: { type?: CategoryType }) {
  return useQuery<{ data: CategoryInterface[] }>({
    queryKey: ["categories", filters?.type],
    staleTime: Infinity,
    enabled: true,
    queryFn: async () => {
      try {
        const response = await axiosAPI.get(`v1/categories`, {
          params: { type: filters?.type },
          timeout: 120000,
        });

        if (response.status !== 200 || !response.data) {
          throw new Error("Failed to fetch post categories");
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    retry: handleRetry,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCategoryValidationSchemaType) => {
      const response = await axiosAPI.post(
        `v1/categories`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create category");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateCategoryValidationSchemaType;
    }) => {
      const response = await axiosAPI.patch(
        `v1/categories/${id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update category");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string }) => {
      const response = await axiosAPI.delete(`v1/categories/${categoryId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete category");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}

export function useDeleteCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categories }: { categories: string[] }) => {
      let success = true;

      // Delete files
      for (const categoryId of categories) {
        try {
          const response = await axiosAPI.delete(
            `v1/categories/${categoryId}`,
            {
              timeout: 120000,
            }
          );

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting category:", error);
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
        queryKey: ["categories"],
      });
    },
  });
}
