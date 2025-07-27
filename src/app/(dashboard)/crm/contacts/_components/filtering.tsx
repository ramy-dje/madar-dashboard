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
import { useForm } from "react-hook-form";
import { BiFilterAlt } from "react-icons/bi";
import { useGetAllIndustries, useGetAllOccupations } from "../contact-hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DataTableSelectFilter } from "@/components/data-table/data-table-select-filter";
import { CRMContactFilters } from "@/interfaces/crm-contact.interface";

// The crm contact filtering sheet component

interface Props {
  filters: CRMContactFilters;
  setFilters: React.Dispatch<React.SetStateAction<CRMContactFilters>>;
}

interface FiltersType {
  email: string;
  gender: "male" | "female";
  location_global: string;
  location_country: string;
  phoneNumber: string;
  work_occupation: string;
  work_industry: string;
  work_company: string;
}

export default function CRMContactsPageFiltering({
  filters,
  setFilters,
}: Props) {
  const { data: industries, isLoading: isLoadingIndustries } =
    useGetAllIndustries({ page: 0, size: 100 });

  const { data: occupations, isLoading: isLoadingOccupations } =
    useGetAllOccupations({ page: 0, size: 100 });

  const form = useForm<FiltersType>({
    defaultValues: {
      email: "",
      location_country: "",
      location_global: "",
      phoneNumber: "",
      work_occupation: "",
      work_company: "",
      work_industry: "",
      gender: "" as any,
    },
  });

  // sheet open state
  const [open, setOpen] = useState(false);

  const isFiltered = [
    "email",
    "gender",
    "location_global",
    "location_country",
    "phoneNumber",
    "work_occupation",
    "work_industry",
    "work_company",
  ].some((key) => filters?.[key as keyof typeof filters] !== undefined);

  const handleSubmit = (filters: FiltersType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      email: filters.email || undefined,
      location_country: filters.location_country || undefined,
      location_global: filters.location_global || undefined,
      phoneNumber: filters.phoneNumber || undefined,
      work_occupation: filters.work_occupation || undefined,
      work_company: filters.work_company || undefined,
      work_industry: filters.work_industry || undefined,
      gender: filters.gender || undefined,
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
      phoneNumber: "",
      work_occupation: "",
      work_company: "",
      work_industry: "",
      gender: "" as any,
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
        title="CRM Contacts Filters"
        description="Filter contacts by gender, email, occupation, company..."
        open={open}
        isLoading={isLoadingOccupations || isLoadingIndustries}
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
            {/* gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={field.value || "both"}
                    onValueChange={(e) => field.onChange(e == "both" ? "" : e)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="both">both</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
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

            {/* check if the work occupation data is fetched how a combobox if not a simple input */}
            {occupations && occupations.data.length > 0 ? (
              <FormField
                control={form.control}
                name="work_occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <DataTableSelectFilter
                        title="Occupation"
                        valueKey="work_occupation"
                        value={field.value}
                        options={
                          occupations.data.map((e) => ({
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
                name="work_occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <DebouncedInput
                        id="occupation"
                        placeholder="Occupation field"
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
                name="work_industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <DataTableSelectFilter
                        title="Industry"
                        valueKey="work_industry"
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
                name="work_industry"
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

            {/* company */}
            <FormField
              control={form.control}
              name="work_company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <DebouncedInput
                      id="company"
                      placeholder="Company name"
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
