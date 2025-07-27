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
import { Button } from "@/components/ui/button";
import { HiOutlinePlus } from "react-icons/hi";

import useAccess from "@/hooks/use-access";

import Link from "next/link";
import UsersTable from "./users/_components/table";
import RolesGrid from "./roles/_components/grid";

export default function UsersPage() {
  // access info
  const { has } = useAccess();

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Roles and Permissions
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
                  <BreadcrumbPage>Role Management & Permission</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create role  */}
            {has(["role:create"]) ? (
              <Button asChild className="gap-2 font-normal w-full md:w-auto">
                <Link href="/roles-permissions/roles/create">
                  <HiOutlinePlus className="size-4" /> New Role
                </Link>
              </Button>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        <RolesGrid />
        <div className="flex flex-col md:flex-row md:justify-between gap-5">
          <h3 className="text-2xl font-bold">All Users</h3>
          {/* create user */}
          {has(["user:create"]) ? (
            <Button asChild className="gap-2 font-normal w-full md:w-auto">
              <Link href="/roles-permissions/users/create">
                <HiOutlinePlus className="size-4" /> Add User
              </Link>
            </Button>
          ) : null}
        </div>
        {/* the table header and table section */}
        <UsersTable />
      </PageLayout>
    </>
  );
}
