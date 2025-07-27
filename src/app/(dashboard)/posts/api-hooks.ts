import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import {
  PostContentFormData,
  PostInterface,
} from "@/interfaces/post.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// get all posts
export function useGetAllPosts(
  filters:
    | {
        search?: string;
        page?: number;
        limit?: number;
        types?: string;
      }
    | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<PostInterface>>({
    queryKey: ["posts", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/posts`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch posts");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useGetPost({ postId }: { postId?: string }) {
  return useQuery<PostInterface>({
    queryKey: ["posts", "details", postId],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/posts/${postId}`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch post");
      }
      return response.data!;
    },
    retry: handleRetry,
    enabled: !!postId, // Only run if postId is provided
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PostContentFormData) => {
      const response = await axiosAPI.post(`v1/posts`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      });

      if (response.status !== 201 || !response.data) {
        throw new Error("Failed to create post");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the posts query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    retry: handleRetry,
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: string;
      data: PostContentFormData;
    }) => {
      const response = await axiosAPI.patch(
        `v1/posts/${postId}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Failed to update post");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the posts query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    retry: handleRetry,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      const response = await axiosAPI.delete(`v1/posts/${postId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete post");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}

export function useDeletePosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postIds }: { postIds: string[] }) => {
      let success = true;

      // Delete posts
      for (const postId of postIds) {
        try {
          const response = await axiosAPI.delete(`v1/posts/${postId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting post:", error);
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
        queryKey: ["posts"],
      });
    },
  });
}
