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
import { useEffect, useState, use } from "react";
import { toast } from "react-hot-toast";
import JobDepartmentInterface from "@/interfaces/job-department.interface";
import { crud_get_all_job_departments } from "@/lib/curd/job-department";
import CreateJobFrom from "./_components/update-form";
import JobInterface from "@/interfaces/job.interface";
import { crud_get_job_by_id } from "@/lib/curd/job";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateJobPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  // the selected job for update

  const [isFetchingData, setIsFetchingData] = useState(false);
  const [departmentData, setDepartmentData] = useState<
    JobDepartmentInterface[]
  >([]);
  // selected job
  const [oldJob, setOldJob] = useState<JobInterface | null>(null);
  // router
  const router = useRouter();

  useEffect(() => {
    // if there no job id
    if (!params?.id) {
      router.replace("/jobs/positions");
      return;
    }
    // fetching the job departments which's needed for the creation of the job
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the job
        const job = await crud_get_job_by_id(params.id);
        // fetching the departments
        const job_departments = await crud_get_all_job_departments({
          page: 0,
          size: 100,
        });

        if (job && job_departments) {
          // setting the job
          setOldJob(job);
          // setting the department
          setDepartmentData(job_departments);
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        router.replace("/jobs/positions");
      }
      setIsFetchingData(false);
    })();
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
              Update Position
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
                <BreadcrumbItem>Jobs</BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Position</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData && oldJob && departmentData ? (
          <CreateJobFrom job={oldJob} formSelectData={{ departmentData }} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
