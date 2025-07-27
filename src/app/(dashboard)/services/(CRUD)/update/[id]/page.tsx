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
import { useGetService, useUpdateService } from "../../../service_hooks";
import { ServiceSchemaType } from "@/app/(dashboard)/services/(CRUD)/_components/service-validation.schema";
import ServiceForm, {
  prepareServiceData,
} from "@/app/(dashboard)/services/(CRUD)/_components/service-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const updateServiceMutation = useUpdateService();
  const {
    data: serviceData,
    isLoading,
    isError,
    error,
  } = useGetService({ serviceId: id });

  const [initialValues, setInitialValues] = useState<ServiceSchemaType | null>(
    null
  );

  useEffect(() => {
    if (serviceData) {
      setInitialValues({
        title: serviceData.title,
        content: serviceData.content,
        seo: serviceData.seo,
        categories:
          serviceData.categories?.map((cat) => ({
            id: cat.id,
            name: cat.name,
          })) || [],
        features: serviceData.features || [],
        media: serviceData.media as any[],
      });
    }
  }, [serviceData]);

  if (!id) {
    router.replace("/services");
    return null;
  }

  if (isError) {
    return (
      <ErrorAlert
        error={error}
        defaultMessage="Failed to fetch service details. Please try again."
      />
    );
  }

  const handleUpdate = async (data: ServiceSchemaType) => {
    if (!id) return;

    try {
      const serviceData = prepareServiceData(data);
      await updateServiceMutation.mutateAsync({ id, data: serviceData });

      router.replace("/services");
      toast({
        title: "Service updated",
        description: "Service has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update service",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating service. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <PageLayoutHeader className="mb-3">
        <PageLayoutHeaderNameAndBreadcrumbs>
          <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
            Update Service
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
                  <Link href="/services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="size-1 block rounded-full bg-muted-foreground/50" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Update Service</BreadcrumbPage>
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
        <ServiceForm
          isLoading={updateServiceMutation.isPending}
          mode="update"
          onFinish={handleUpdate}
          initialValues={initialValues}
        />
      ) : null}
    </PageLayout>
  );
}
