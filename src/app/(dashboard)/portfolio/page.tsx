"use client";
import {
  PageLayout,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderActions,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import useAccess from "@/hooks/use-access";
import { Plus } from "lucide-react";
import React from "react";
import PortfolioTable from "./_components/table";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PortfolioListPage() {
  // access info
  const { has } = useAccess();
  const router = useRouter();

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Portfolio
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
                <BreadcrumbItem>Portfolio</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create portfolio  */}
            {has(["portfolio:create"]) ? (
              <>
                <Button
                  type="button"
                  onClick={() => router.push("/portfolio/create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add portfolio
                </Button>
              </>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <PortfolioTable />
      </PageLayout>
    </>
  );
}
