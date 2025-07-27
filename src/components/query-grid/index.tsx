import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { TbReload, TbServerBolt } from "react-icons/tb";
import { EmptyIcon } from "../query-table";
import { Card } from "../ui/card";

export default function QueryGrid<T>({
  filters,
  isLoading = false,
  isError = false,
  error,
  data = [],
  refetch,
  showContent,
}: {
  filters?: Record<string, any>;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  data?: T[];
  refetch: (filters?: Record<string, any>) => void;
  showContent: (item: T) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {isLoading ? (
        [...Array(8)].map((_, index) => (
          <Skeleton className="w-full h-36" key={`skeleton-${index}`} />
        ))
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-6 gap-5 col-span-2 sm:col-span-3 md:col-span-4">
          <TbServerBolt className="size-10 text-destructive" />
          {(error as any)?.response?.data?.message ??
            "Failed to fetch data. Please try again."}
          <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => refetch(filters)}
          >
            <TbReload className="size-5" /> Retry
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 col-span-2 sm:col-span-3 md:col-span-4">
          <div className="flex flex-col items-center justify-center ">
            <EmptyIcon />
            <p className="text-sm text-muted-foreground">No data</p>
          </div>
        </div>
      ) : (
        data.map((item, index) => (
          <Card
            key={`card-${index}`}
            className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
          >
            {showContent(item)}
          </Card>
        ))
      )}
    </div>
  );
}
