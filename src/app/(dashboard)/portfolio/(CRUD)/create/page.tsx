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

import { useToast } from "@/hooks/use-toast";
import { useCreatePortfolio } from "../../api-hooks";
import PortfolioFrom, {
  preparePortfolioData,
} from "../_components/portfolio-from";
import { PortfolioSchemaType } from "../_components/portfolio-validation.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePortfolioPage() {
  const createPortfolioMutation = useCreatePortfolio();
  const router = useRouter();
  const { toast } = useToast();

  // handle create
  const handleCreate = async (data: PortfolioSchemaType) => {
    try {
      console.log(data);
      const portfolioData = preparePortfolioData(data);

      await createPortfolioMutation.mutateAsync(portfolioData);

      // to the portfolio page
      router.replace("/portfolio");
      toast({
        title: "Portfolio created",
        description: "Portfolio has been successfully created.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create portfolio",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating portfolio. Please try again.",
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
              Create portfolio
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
                  <BreadcrumbPage>Create portfolio</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        <PortfolioFrom<any>
          mode="create"
          onFinish={handleCreate as any}
          isLoading={createPortfolioMutation.isPending}
        />
      </PageLayout>
    </>
  );
}
