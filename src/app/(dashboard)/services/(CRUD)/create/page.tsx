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
import { ServiceSchemaType } from "@/app/(dashboard)/services/(CRUD)/_components/service-validation.schema";
import ServiceForm, { prepareServiceData } from "../_components/service-form";
import { useCreateService } from "../../service_hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateServicePage() {
  const createServiceMutation = useCreateService();
  const router = useRouter();
  const { toast } = useToast();

  // handle create
  const handleCreate = async (data: ServiceSchemaType) => {
    try {
      console.log(data);
      const ServiceData = prepareServiceData(data);

      await createServiceMutation.mutateAsync(ServiceData);

      // to the Service page
      router.replace("/services");
      toast({
        title: "Service created",
        description: "Service has been successfully created.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create service",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating service. Please try again.",
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
              Create Service
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
                    <Link href="/service">Service</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Service</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <ServiceForm
          mode="create"
          onFinish={handleCreate}
          isLoading={createServiceMutation.isPending}
        />
      </PageLayout>
    </>
  );
}
