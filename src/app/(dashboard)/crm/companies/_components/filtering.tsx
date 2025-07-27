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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import {
  useGetAllCRMCategories,
  useGetAllIndustries,
} from "../../contacts/contact-hooks";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DataTableSelectFilter } from "@/components/data-table/data-table-select-filter";
import { CRMCompanyFilters } from "@/interfaces/crm-company.interface";

// prepare data
const linked_in_company_sizes = [
  "1",
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10,000",
  "10,001",
];

// The crm companies filtering sheet component

interface Props {
  filters: CRMCompanyFilters;
  setFilters: React.Dispatch<React.SetStateAction<CRMCompanyFilters>>;
}

interface FiltersType {
  email: string;
  company_size: string;
  identification: string;
  location_global: string;
  location_country: string;
  phoneNumber: string;
  industry: string;
  category: string;
}

export default function CRMCompaniesPageFiltering({
  filters,
  setFilters,
}: Props) {
  const { data: industries, isLoading: isLoadingIndustries } =
    useGetAllIndustries({ page: 0, size: 100 });

  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCRMCategories({ page: 0, size: 100 });

  const form = useForm<FiltersType>({
    defaultValues: {
      email: "",
      location_country: "",
      location_global: "",
      category: "",
      company_size: "",
      identification: "",
      industry: "",
      phoneNumber: "",
    },
  });

  // sheet open state
  const [open, setOpen] = useState(false);
  const isFiltered = [
    "email",
    "location_country",
    "location_global",
    "category",
    "company_size",
    "identification",
    "industry",
    "phoneNumber",
  ].some((key) => filters?.[key as keyof typeof filters] !== undefined);

  const handleSubmit = (filters: FiltersType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      email: filters.email || undefined,
      location_country: filters.location_country || undefined,
      location_global: filters.location_global || undefined,
      category: filters.category || undefined,
      company_size: filters.company_size || undefined,
      identification: filters.identification || undefined,
      industry: filters.industry || undefined,
      phoneNumber: filters.phoneNumber || undefined,
      page: 0,
    }));
  };
  const handleOutsideSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };
  const handleClear = () => {
    form.reset({
      email: "",
      location_country: "",
      location_global: "",
      category: "",
      company_size: "",
      identification: "",
      industry: "",
      phoneNumber: "",
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
        title="CRM Companies Filters"
        description="Filter companies by size, category..."
        open={open}
        isLoading={isLoadingCategories || isLoadingIndustries}
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
            {/* size */}
            <FormField
              control={form.control}
              name="company_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    value={field.value || "all"}
                    onValueChange={(e) => field.onChange(e == "all" ? "" : e)}
                  >
                    <FormControl>
                      <SelectTrigger id="size" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {linked_in_company_sizes.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* phone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="phone"
                      placeholder="Number (Mobile/Fax/Whatsapp/Viber)"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="email"
                      placeholder="e.g mohamed@gmail.com"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* location country */}
            <FormField
              control={form.control}
              name="location_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="country"
                      placeholder="e.g Algeria"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* location */}
            <FormField
              control={form.control}
              name="location_global"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="location"
                      placeholder="e.g Djelfa"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* check if the work categories data is fetched how a combobox if not a simple input */}
            {categories && categories.data.length > 0 ? (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <DataTableSelectFilter
                        title="Category"
                        valueKey="category"
                        value={field.value}
                        options={
                          categories.data.map((e) => ({
                            label: e.name,
                            value: e.name,
                          })) || []
                        }
                        setFilterValue={({ value }) =>
                          field.onChange(value || "")
                        }
                        className="w-full justify-between"
                        contentClassName="z-[99999]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        id="category"
                        placeholder="Category"
                        value={field.value}
                        onDebouncedValueChange={(e) =>
                          field.onChange(e as string)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* check if the work industry data is fetched how a combobox if not a simple input */}
            {industries && industries.data.length > 0 ? (
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <DataTableSelectFilter
                        title="Industry"
                        valueKey="industry"
                        value={field.value}
                        options={
                          industries.data.map((e) => ({
                            label: e.name,
                            value: e.name,
                          })) || []
                        }
                        setFilterValue={({ value }) =>
                          field.onChange(value || "")
                        }
                        className="w-full justify-between"
                        contentClassName="z-[99999]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        id="industry"
                        placeholder="Industry field"
                        value={field.value}
                        onDebouncedValueChange={(e) =>
                          field.onChange(e as string)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* identification */}
            <FormField
              control={form.control}
              name="identification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="identification"
                      placeholder="TIN/CRN/TAX Code/Statistical Code"
                      value={field.value}
                      onDebouncedValueChange={(e) =>
                        field.onChange(e as string)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FilteringSheet>
    </>
  );
}
