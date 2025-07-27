"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderActions,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetPortfolio, useUpdatePortfolio } from "../../../api-hooks";
import ErrorAlert from "@/components/error-alert";
import { use, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioSchemaType } from "@/app/(dashboard)/portfolio/(CRUD)/_components/portfolio-validation.schema";
import PortfolioFrom, {
  preparePortfolioData,
} from "@/app/(dashboard)/portfolio/(CRUD)/_components/portfolio-from";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Update the component to handle params as a Promise
export default function UpdatePortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);

  // router
  const router = useRouter();
  const { toast } = useToast();
  const updatePortfolioMutation = useUpdatePortfolio();
  const {
    data: portfolioData,
    isLoading,
    isError,
    error,
  } = useGetPortfolio({ portfolioId: id });

  const [initialValues, setInitialValues] =
    useState<PortfolioSchemaType | null>(null);

  useEffect(() => {
    if (portfolioData) {
      setInitialValues({
        title: portfolioData.title,
        content: portfolioData.content,
        summary: portfolioData.summary,
        seo: {
          metaTitle: portfolioData.seo.metaTitle || "",
          metaDescription: portfolioData.seo.metaDescription || "",
        },
        categories: [],
        tags: [],
        features: portfolioData.features || [],
        gallery_images: portfolioData.media as any[],
      });
    }
  }, [portfolioData]);
  if (!id) {
    router.replace("/portfolio");
    return null;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={error}
        defaultMessage="Failed to fetch portfolio details. Please try again."
      />
    );
  }

  // handle update
  const handleUpdate = async (data: PortfolioSchemaType) => {
    if (!id) return;

    try {
      const postData = preparePortfolioData(data);
      await updatePortfolioMutation.mutateAsync({ id, data: postData });

      // to the portfolio page
      router.replace("/portfolio");
      toast({
        title: "Portfolio updated",
        description: "Portfolio has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update portfolio",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating portfolio. Please try again.",
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
              Update Portfolio
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
                    <Link href="/portfolio">Portfolio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Portfolio</BreadcrumbPage>
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
          <PortfolioFrom
            isLoading={updatePortfolioMutation.isPending}
            mode="update"
            onFinish={handleUpdate}
            initialValues={initialValues}
          />
        ) : null}
      </PageLayout>
    </>
  );
}
