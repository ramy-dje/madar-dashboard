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
import TenderForm, { prepareTenderData } from "../_components/tender-form";
import { useCreateTender } from "../../tenders_hooks";
import { TenderSchemaType } from "../_components/tender-validation.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTenderPage() {
  const createTenderMutation = useCreateTender();
  const router = useRouter();
  const { toast } = useToast();

  // handle create
  const handleCreate = async (data: TenderSchemaType) => {
    try {
      console.log(data);
      const TenderData = prepareTenderData(data);

      await createTenderMutation.mutateAsync(TenderData);

      // to the Tender page
      router.replace("/tenders");
      toast({
        title: "Tender created",
        description: "Tender has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Failed to create tender",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating tender. Please try again.",
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
              Create Tender
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
                    <Link href="/tender">Tender</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Tender</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <TenderForm
          mode="create"
          onFinish={handleCreate}
          isLoading={createTenderMutation.isPending}
        />
      </PageLayout>
    </>
  );
}
