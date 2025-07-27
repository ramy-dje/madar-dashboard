import { DebouncedInput } from "@/components/debounced-input";
import FilteringSheet from "@/components/filtering-sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFiltersInterface } from "@/interfaces/job.interface";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useGetAllDepartments } from "../../departments/department-hooks";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// The job positions filtering sheet component

interface Props {
  filters: JobFiltersInterface;
  setFilters: React.Dispatch<React.SetStateAction<JobFiltersInterface>>;
}

interface FiltersType {
  type: string;
  level: string;
  department: string;
}

export default function JobPositionsPageFiltering({
  filters,
  setFilters,
}: Props) {
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllDepartments({ page: 0, size: 100 });

  const form = useForm<FiltersType>({
    defaultValues: {
      type: "",
      level: "",
      department: "",
    },
  });

  // sheet open state
  const [open, setOpen] = useState(false);

  const isFiltered = ["type", "level", "department"].some(
    (key) => filters?.[key as keyof typeof filters] !== undefined
  );

  const handleSubmit = (filters: FiltersType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: filters.type || undefined,
      level: filters.level || undefined,
      department: filters.department || undefined,
      page: 0,
    }));
  };
  const handleOutsideSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };
  const handleClear = () => {
    form.reset({
      type: "",
      level: "",
      department: "",
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant={isFiltered ? "default" : "outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "gap-2 font-normal tex t-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="Job Positions Filters"
        description="Filter positions by title,department level and type."
        open={open}
        isLoading={isLoadingDepartments}
        setOpen={setOpen}
        handelShowResults={handleOutsideSubmit}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-5 pb-5"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="type"
                      placeholder="Type of the position"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="level"
                      placeholder="Level of the position"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* is the needed data isn't fetched or it equals 'null' don't render the component */}
            {departments ? (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={field.value || "all"}
                      onValueChange={(e) => field.onChange(e == "all" ? "" : e)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        {departments.data.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            ) : null}
          </form>
        </Form>
      </FilteringSheet>
    </>
  );
}
