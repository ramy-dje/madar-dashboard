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
import { useRouter, useSearchParams } from "next/navigation";
import PostFrom, { preparePostData } from "../_components/post-form";

import { useCreatePost } from "../../api-hooks";
import { useToast } from "@/hooks/use-toast";
import { CreatePostValidationSchemaType } from "../_components/post-validation.schema";
import Link from "next/link";

export default function CreateBlogPostPage() {
  const createPostMutation = useCreatePost();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const type = (searchParams.get("type") || "post") as
    | "post"
    | "event"
    | "destination";

  // handle create
  const handleCreate = async (
    data: CreatePostValidationSchemaType & {
      status: "draft" | "published";
    }
  ) => {
    try {
      const postData = preparePostData(data);
      await createPostMutation.mutateAsync(postData);

      // to the posts page
      router.replace("/posts");
      toast({
        title: "Post created",
        description: "Post has been successfully created.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create post",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating post. Please try again.",
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
              Create {type}
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
                  <BreadcrumbPage>Create {type}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <PostFrom<CreatePostValidationSchemaType>
          mode="create"
          type={type}
          onFinish={handleCreate as any}
          isLoading={createPostMutation.isPending}
        />
      </PageLayout>
    </>
  );
}
