"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
  PageLayoutHeaderActions,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetPost, useUpdatePost } from "../../../api-hooks";
import ErrorAlert from "@/components/error-alert";
import PostFrom, { preparePostData } from "../../_components/post-form";
import { use, useEffect, useState } from "react";
import { UpdatePostValidationSchemaType } from "../../_components/post-validation.schema";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Update the component to handle params as a Promise
export default function UpdatePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  // router
  const router = useRouter();
  const { toast } = useToast();
  const updatePostMutation = useUpdatePost();
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useGetPost({ postId: id });

  const [initialValues, setInitialValues] =
    useState<UpdatePostValidationSchemaType | null>(null);

  useEffect(() => {
    if (postData) {
      // Transform the old post data to match the form schema
      const baseData = {
        title: { ...postData.title },
        content: { ...postData.content },
        show_comments: postData.showComments,
        categories:
          postData.categories?.map((cat) => ({ id: cat.id, name: cat.name })) ||
          [],
        tags:
          postData.tags?.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })) || [],
        gallery_images: postData.media as any[],
      };

      let transformedData: UpdatePostValidationSchemaType;

      if (postData.type === "post") {
        transformedData = {
          ...baseData,
          type: "post" as const,
          readability: postData.readabilityEnabled || false,
        };
      } else if (postData.type === "event") {
        transformedData = {
          ...baseData,
          type: "event" as const,
          startDate: new Date(postData.startDate!),
          endDate: new Date(postData.endDate!),
          location: postData.location,
        };
      } else {
        // destination
        transformedData = {
          ...baseData,
          type: "destination" as const,
          readability: postData.readabilityEnabled || false,
        };
      }

      setInitialValues(transformedData);
    }
  }, [postData]);
  if (!id) {
    router.replace("/posts");
    return null;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={error}
        defaultMessage="Failed to fetch post details. Please try again."
      />
    );
  }

  // handle update
  const handleUpdate = async (
    data: UpdatePostValidationSchemaType & {
      status: "draft" | "published";
    }
  ) => {
    if (!id) return;

    try {
      const postData = preparePostData(data);
      await updatePostMutation.mutateAsync({ postId: id, data: postData });

      // to the posts page
      router.replace("/posts");
      toast({
        title: "Post updated",
        description: "Post has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update post",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Update {postData?.type || "post"}
            </PageLayoutHeaderNameAndBreadcrumbsTitle>
            {/* breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/posts">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    Update {postData?.type || "post"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        ) : initialValues ? (
          <PostFrom
            mode="update"
            type={postData?.type || "post"}
            onFinish={handleUpdate as any}
            initialValues={initialValues}
          />
        ) : null}
      </PageLayout>
    </>
  );
}
