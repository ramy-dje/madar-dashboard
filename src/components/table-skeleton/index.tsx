import { PageLayoutFilteringHeader, PageLayoutTable } from "../page-layout";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

// Loading skeleton component for the table
export default function TableSkeleton() {
  return (
    <>
      {/* Filtering place skeleton */}
      <PageLayoutFilteringHeader>
        <Skeleton className="w-[22em] h-10 max-sm:w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10" />
        </div>
      </PageLayoutFilteringHeader>

      {/* Table skeleton */}
      <PageLayoutTable className="text-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(6)].map((_, index) => (
              <TableRow key={`skeleton-row-${index}`}>
                <TableCell>
                  <Skeleton className="w-4 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-32 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-24 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageLayoutTable>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-2 py-4">
        <Skeleton className="w-32 h-4" />
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    </>
  );
}
