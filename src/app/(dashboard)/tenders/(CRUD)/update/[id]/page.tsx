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
import ErrorAlert from "@/components/error-alert";
import { use, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGetTender, useUpdateTender } from "../../../tenders_hooks";
import { TenderSchemaType } from "../../_components/tender-validation.schema";
import TenderForm, { prepareTenderData } from "../../_components/tender-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateTenderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const updateTenderMutation = useUpdateTender();
  const {
    data: tenderData,
    isLoading,
    isError,
    error,
  } = useGetTender({ tenderId: id });

  const [initialValues, setInitialValues] = useState<TenderSchemaType | null>(
    null
  );

  useEffect(() => {
    if (tenderData) {
      setInitialValues({
        title: tenderData.title,
        content: tenderData.content,
        seo: tenderData.seo,
        categories:
          tenderData.categories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })) || [],
        features: tenderData.features || [],
        media: tenderData.media as any[],
      });
    }
  }, [tenderData]);

  if (!id) {
    router.replace("/tenders");
    return null;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={error}
        defaultMessage="Failed to fetch tender details. Please try again."
      />
    );
  }

  const handleUpdate = async (data: TenderSchemaType) => {
    if (!id) return;

    try {
      const tenderData = prepareTenderData(data);
      await updateTenderMutation.mutateAsync({ id, data: tenderData });

      router.replace("/tenders");
      toast({
        title: "Tender updated",
        description: "Tender has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update tender",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating tender. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <PageLayoutHeader className="mb-3">
        <PageLayoutHeaderNameAndBreadcrumbs>
          <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
            Update Tender
          </PageLayoutHeaderNameAndBreadcrumbsTitle>
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
                  <Link href="/tenders">Tenders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="size-1 block rounded-full bg-muted-foreground/50" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Update Tender</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageLayoutHeaderNameAndBreadcrumbs>
        <PageLayoutHeaderActions>
          <div className="" />
        </PageLayoutHeaderActions>
      </PageLayoutHeader>
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-[3em] rounded-lg" />
          <Skeleton className="w-full h-[30em] rounded-lg" />
          <Skeleton className="w-full h-[30em] rounded-lg" />
        </div>
      ) : initialValues ? (
        <TenderForm
          isLoading={updateTenderMutation.isPending}
          mode="update"
          onFinish={handleUpdate}
          initialValues={initialValues}
        />
      ) : null}
    </PageLayout>
  );
}
