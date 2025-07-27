"use client";

import { useGetFileManagerKpis } from "../api-hooks";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import formatFileSize from "@/utils/file-size";
import { useDraggable } from "react-use-draggable-scroll";
import { useRef } from "react";
import useAccess from "@/hooks/use-access";
import ErrorAlert from "@/components/error-alert";

const getValueByPath = <T extends Record<string, any>>(
  obj: T,
  path: string | string[]
): number => {
  try {
    // Handle string path
    if (typeof path === "string") {
      const value = obj[path];
      return typeof value === "number" ? value : 0;
    }
    
    // Handle array path
    if (Array.isArray(path)) {
      const value = path.reduce((acc, key) => {
        return acc && typeof acc === "object" ? acc[key] : undefined;
      }, obj as Record<string, any>);
      
      return typeof value === "number" ? value : 0;
    }
    
    return 0;
  } catch (error) {
    console.warn(`Error accessing path ${JSON.stringify(path)}:`, error);
    return 0;
  }
};

export default function FileManagerKpis() {
  const { has } = useAccess();
  const ref = useRef<HTMLDivElement | null>(
    null
  ) as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);
  const { data, isLoading, isError, error } = useGetFileManagerKpis(
    has(["file_manager_analytics:read"])
  );
  if (!has(["file_manager_analytics:read"]))
    return <div className="hidden" {...events} ref={ref} />;
  return (
    <div
      className="hide-scrollbar flex items-center justify-start w-full overflow-x-scroll space-x-5"
      {...events}
      ref={ref}
    >
      {isError ? (
        <ErrorAlert
          error={error}
          title="Failed to fetch KPIs"
          defaultMessage="Failed to fetch KPIs. Please try again."
        />
      ) : (
        [
          {
            title: "Total Storage",
            icon: "drive",
            color: "#4c5c75",
            dataKey: "totalStorageUsed",
          },
          {
            title: "Images",
            icon: "image",
            color: "#f3962d",
            dataKey: ["storageSizeByType", "image"],
          },
          {
            title: "Documents",
            icon: "docs",
            color: "#6d98ff",
            dataKey: ["storageSizeByType", "document"],
          },
          {
            title: "Audios",
            icon: "audio",
            color: "#fbc13b",
            dataKey: ["storageSizeByType", "audio"],
          },
          {
            title: "Videos",
            icon: "movie",
            color: "#e16244",
            dataKey: ["storageSizeByType", "video"],
          },
        ].map((item) => {
          // Assuming your data object is named 'storageData'
          const value = getValueByPath(data ?? {}, item.dataKey);

          // Calculate percentage (assuming maxStorage is defined somewhere)
          const maxStorage = 120 * 1024 * 1024 * 1024; // 120 GB in bytes
          const percentage = Math.min(
            Math.round((value / maxStorage) * 100),
            100
          );

          return (
            <Card key={`item-${item.title}`}>
              <CardContent className="flex items-center p-4 gap-5 min-w-[292px]">
                <div className="size-14 shrink-0">
                  <CircularProgressbarWithChildren
                    value={percentage}
                    styles={{ path: { stroke: item.color } }}
                  >
                    <Image
                      src={`/file-manager-icons/${item.icon}.svg`}
                      alt={item.title.toLowerCase()}
                      width={26}
                      height={26}
                      loading="lazy"
                      className="aspect-square"
                      decoding="async"
                    />
                  </CircularProgressbarWithChildren>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <h4 className="mb-1 text-xl font-semibold text-primary">
                    {isLoading ? (
                      <Skeleton className="w-20 h-8" />
                    ) : (
                      <>
                        {formatFileSize(value)}
                        <span className="inline-block text-sm font-normal text-muted-foreground">
                          &nbsp;of 120 GB
                        </span>
                      </>
                    )}
                  </h4>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}