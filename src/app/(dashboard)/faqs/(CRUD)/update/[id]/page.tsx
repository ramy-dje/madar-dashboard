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

import { useGetFAQ, useUpdateFAQ } from "../../../faq_hooks";
import { FaqSchemaType } from "../../_components/faq-validation.schema";
import FaqForm, { prepareFAQData } from "../../_components/faq-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const updateFaqMutation = useUpdateFAQ();
  const { data: faqData, isLoading, isError, error } = useGetFAQ({ faqId: id });

  const [initialValues, setInitialValues] = useState<FaqSchemaType | null>(
    null
  );

  useEffect(() => {
    if (faqData) {
      setInitialValues({
        title: faqData.title,
        qaPairs: faqData.qaPairs,
        categories: faqData.categories.map((category) => ({
          id: category.id,
          name: category.name.en,
        })),
      });
    }
  }, [faqData]);

  if (!id) {
    router.replace("/faqs");
    return null;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={error}
        defaultMessage="Failed to fetch FAQ details. Please try again."
      />
    );
  }

  const handleUpdate = async (data: FaqSchemaType) => {
    if (!id) return;

    try {
      const faqData = prepareFAQData(data);
      await updateFaqMutation.mutateAsync({ id, data: faqData });

      router.replace("/faqs");
      toast({
        title: "Faq updated",
        description: "FAQ has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update FAQ",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating FAQ. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <PageLayoutHeader className="mb-3">
        <PageLayoutHeaderNameAndBreadcrumbs>
          <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
            Update FAQ
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
                  <Link href="/services">FAQs</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="size-1 block rounded-full bg-muted-foreground/50" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Update FAQ</BreadcrumbPage>
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
        <FaqForm
          isLoading={updateFaqMutation.isPending}
          mode="update"
          onFinish={handleUpdate}
          initialValues={initialValues}
        />
      ) : null}
    </PageLayout>
  );
}
