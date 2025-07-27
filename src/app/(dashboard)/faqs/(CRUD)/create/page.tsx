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

import { useToast } from "@/hooks/use-toast";
import { useCreateFAQ } from "@/app/(dashboard)/faqs/faq_hooks";
import FaqForm, {
  prepareFAQData,
} from "@/app/(dashboard)/faqs/(CRUD)/_components/faq-form";
import { FaqSchemaType } from "@/app/(dashboard)/faqs/(CRUD)/_components/faq-validation.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateFAQPage() {
  const createServiceMutation = useCreateFAQ();
  const router = useRouter();
  const { toast } = useToast();

  // handle create
  const handleCreate = async (data: FaqSchemaType) => {
    try {
      console.log(data);
      const ServiceData = prepareFAQData(data);

      await createServiceMutation.mutateAsync(ServiceData);

      // to the FAQ page
      router.replace("/faqs");
      toast({
        title: "FAQ created",
        description: "FAQ has been successfully created.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create FAQ",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating FAQ. Please try again.",
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
              Create FAQ
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
                    <Link href="/faqs">FAQ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Create FAQ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <FaqForm
          mode="create"
          onFinish={handleCreate}
          isLoading={createServiceMutation.isPending}
        />
      </PageLayout>
    </>
  );
}
