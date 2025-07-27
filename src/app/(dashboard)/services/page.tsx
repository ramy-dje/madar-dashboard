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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import useAccess from "@/hooks/use-access";
import { Plus } from "lucide-react";
import React from "react";
import ServiceTable from "@/app/(dashboard)/services/_components/table";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ServiceListPage() {
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
              Service
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
                <BreadcrumbItem>Service</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create Service  */}
            {has(["service:create"]) ? (
              <>
                <Button
                  type="button"
                  onClick={() => router.push("/services/create")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <ServiceTable />
      </PageLayout>
    </>
  );
}
