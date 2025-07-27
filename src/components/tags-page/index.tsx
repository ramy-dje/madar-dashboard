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
import useAccess from "@/hooks/use-access";

import CategoriesTable from "./_components/table";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CategoryType } from "@/interfaces/categories.interface";
import Link from "next/link";
import { TagFormModal } from "./_components/tag-form-modal";

export default function TagsPage({
  type,
  title,
}: {
  type: CategoryType;
  title: string;
}) {
  // access info
  const { has } = useAccess();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader>
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Tags
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
                <BreadcrumbItem>{title}</BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Tags</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            {/* create tag dialog (rendered with the needed permissions) */}
            {has(["tag:create"]) ? (
              <>
                <Button type="button" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
                <TagFormModal open={open} setOpen={setOpen} type={type} />
              </>
            ) : null}
          </PageLayoutHeaderActions>
        </PageLayoutHeader>

        {/* the table header and table section */}
        <CategoriesTable type={type} />
      </PageLayout>
    </>
  );
}
