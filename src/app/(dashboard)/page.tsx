"use client";

// import useAccess from "@/hooks/use-access";
// import JobsAnalyticsCard from "./_components/job-submissions.analytics";

export default function Home() {
  // const { has } = useAccess();

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Jobs analytics part (With Permissions) */}
      {/* {has(["analytics_jobs:read"]) ? <JobsAnalyticsCard /> : null} */}
      {/* blogs & destinations analytics part (With Permissions) */}
    </div>
  );
}
