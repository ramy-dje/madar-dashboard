import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RxChevronLeft,
  RxChevronRight,
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
} from "react-icons/rx";

interface DataTablePaginationProps<TData> {
  table?: Table<TData>;
  // Individual props for backend pagination
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  pageIndex?: number;
  setPageIndex?: (pageIndex: number) => void;
  totalPages?: number;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  totalPages,
  canPreviousPage,
  canNextPage,
}: DataTablePaginationProps<TData>) {
  // Use table props if available, otherwise use individual props
  const currentPageSize = table
    ? table.getState().pagination.pageSize
    : pageSize || 10;
  const currentPageIndex = table
    ? table.getState().pagination.pageIndex
    : pageIndex || 0;
  const currentTotalPages = table ? table.getPageCount() : totalPages || 1;
  const currentCanPreviousPage = table
    ? table.getCanPreviousPage()
    : canPreviousPage || false;
  const currentCanNextPage = table
    ? table.getCanNextPage()
    : canNextPage || false;

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    if (table) {
      table.setPageSize(newPageSize);
    } else if (setPageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleFirstPage = () => {
    if (table) {
      table.setPageIndex(0);
    } else if (setPageIndex) {
      setPageIndex(0);
    }
  };

  const handlePreviousPage = () => {
    if (table) {
      table.previousPage();
    } else if (setPageIndex && pageIndex !== undefined) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (table) {
      table.nextPage();
    } else if (setPageIndex && pageIndex !== undefined) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handleLastPage = () => {
    if (table) {
      table.setPageIndex(table.getPageCount() - 1);
    } else if (setPageIndex && totalPages !== undefined) {
      setPageIndex(totalPages - 1);
    }
  };

  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex flex-col items-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 sm:flex-row">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${currentPageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={currentPageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center ">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPageIndex + 1} of {currentTotalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleFirstPage}
              disabled={!currentCanPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <RxDoubleArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handlePreviousPage}
              disabled={!currentCanPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <RxChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleNextPage}
              disabled={!currentCanNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <RxChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleLastPage}
              disabled={!currentCanNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <RxDoubleArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
