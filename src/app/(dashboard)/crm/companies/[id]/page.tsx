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
import { Skeleton } from "@/components/ui/skeleton";
import useFetch from "@/hooks/use-filtering-fetch";

import { useEffect, use } from "react";
import toast from "react-hot-toast";

import { crud_get_crm_company_by_id } from "@/lib/curd/crm-company";
import CompanyProfileCard from "./_components/profile-card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CRMCompanyProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  // router
  const router = useRouter();
  // fetcher
  const { data, refetch, error, isFetching } = useFetch(
    {
      // company
      company: () => crud_get_crm_company_by_id(params.id),
    },
    false // to fetch it manly
  );

  // when error happen
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong when fetching the data");
      // redirect to the crm companies page
      router.replace("/crm/companies");
    }
  }, [error]);

  useEffect(() => {
    // if there no company id
    if (!params?.id) {
      router.replace("/crm/companies");
      return;
    }
    refetch();
  }, []);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Company Profile
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
                <BreadcrumbItem>CRM</BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>Companies</BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Company Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {!isFetching && data.company ? (
          <div className="w-full flex justify-center">
            <CompanyProfileCard company={data.company} />
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Skeleton className="w-full flex flex-col gap-8 h-[30em] lg:h-[45em] p-2 lg:p-4 rounded-3xl shadow-sm" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
