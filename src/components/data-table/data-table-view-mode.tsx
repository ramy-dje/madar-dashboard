import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/default-tabs";
import { Grid, List } from "lucide-react";

export default function DataTableViewMode({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}) {
  return (
    <Tabs
      value={viewMode}
      onValueChange={(value) => setViewMode(value as "grid" | "list")}
    >
      <TabsList>
        <TabsTrigger value="grid">
          <Grid className="size-4" />
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="size-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
