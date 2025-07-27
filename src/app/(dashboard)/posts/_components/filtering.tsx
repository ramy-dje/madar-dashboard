import FilteringSheet from "@/components/filtering-sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostFilters } from "@/interfaces/post.interface";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiFilterAlt } from "react-icons/bi";
import { useGetAllCategories } from "@/components/categories-page/api-hooks";
import { CategoryType } from "@/interfaces/categories.interface";

// The posts filtering sheet component

interface Props {
  filters?: PostFilters;
}

interface FiltersType {
  categoryId: string;
  types?: string;
}

export default function PostsPageFiltering({ filters }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const {
    data: postCategories,
    isLoading,
    isError,
  } = useGetAllCategories({ type: CategoryType.POST });

  const form = useForm<FiltersType>({
    defaultValues: {
      categoryId: filters?.categoryId || "all",
      types: filters?.type || "all",
    },
  });

  const setFilters = (filters: FiltersType) => {
    const params = new URLSearchParams(searchParams);
    if (filters.types && filters.types !== "all") {
      params.set("types", filters.types);
    } else {
      params.delete("types");
    }
    if (filters.categoryId && filters.categoryId !== "all") {
      params.set("categoryId", filters.categoryId);
    } else {
      params.delete("categoryId");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const isFiltered = ["categoryId", "types"].some(
    (key) => filters?.[key as keyof typeof filters] !== undefined
  );

  // sheet open state
  const [open, setOpen] = useState(false);

  const handleOutsideSubmit = () => {
    form.handleSubmit(setFilters)();
  };

  const handleClear = () => {
    form.reset({
      categoryId: "all",
      types: "all",
    });
    const params = new URLSearchParams(searchParams);
    params.delete("categoryId");
    params.delete("types");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Button
        size="sm"
        variant={isFiltered ? "default" : "outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "gap-2 font-normal text-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="File manager Filters"
        description="Filter files and folders by type."
        open={open}
        setOpen={setOpen}
        handelShowResults={handleOutsideSubmit}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(setFilters)}
            className="w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {isError ? (
                        <SelectItem value="" disabled>
                          Failed to fetch categories
                        </SelectItem>
                      ) : (
                        postCategories?.data.map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name.en}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {["post", "event", "destination", "podcast"].map(
                        (type) => (
                          <SelectItem value={type} key={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FilteringSheet>
    </>
  );
}
