import {
  useCreateCategory,
  useGetAllCategories,
  useUpdateCategory,
} from "@/components/categories-page/api-hooks";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus, X } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import CategoryInterface, {
  CategoryType,
} from "@/interfaces/categories.interface";

// create category zod validation schema

export const CreateCategoryValidationSchema = z
  .object({
    name: z.object({
      fr: z.string().min(1, "Category name is required"),
      en: z.string().min(1, "Category name is required"),
      ar: z.string().min(1, "Category name is required"),
    }),
    slug: z
      .string()
      .min(1, "Category slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must be lowercase and contain only letters, numbers, and hyphens"
      ),
    description: z.string().optional(),
    featuredImage: z.string().optional(),
    type: z.nativeEnum(CategoryType).optional(),
    parentId: z.string().nullable().optional(),
  })
  .strict();

export type CreateCategoryValidationSchemaType = z.infer<
  typeof CreateCategoryValidationSchema
>;
const defaultValues: CreateCategoryValidationSchemaType = {
  name: {
    fr: "",
    en: "",
    ar: "",
  },
  slug: "",
  description: "",
  featuredImage: "",
  parentId: "none",
};
export const CategoryFormModal = ({
  open,
  setOpen,
  type,
  mode = "create",
  initialValues,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  type: CategoryType;
  mode?: "create" | "update";
  initialValues?: CategoryInterface;
}) => {
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

  const { toast } = useToast();

  const form = useForm<CreateCategoryValidationSchemaType>({
    resolver: zodResolver(CreateCategoryValidationSchema),
    defaultValues,
  });

  const { data, isLoading, isError, error } = useGetAllCategories({ type });

  const categories = useMemo(() => data?.data || [], [data]);

  const handleCreateCategory = async (
    values: CreateCategoryValidationSchemaType
  ) => {
    try {
      await createCategoryMutation.mutateAsync({
        ...values,
        parentId: values.parentId === "none" ? null : values.parentId,
        type,
      });

      toast({
        title: "Success",
        description: "Category created successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to create category",
      });
    }
  };

  const handleUpdateCategory = async (
    values: CreateCategoryValidationSchemaType
  ) => {
    try {
      await updateCategoryMutation.mutateAsync({
        id: initialValues!.id,
        data: {
          ...values,
          parentId: values.parentId === "none" ? null : values.parentId,
        },
      });

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to update category",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  useEffect(() => {
    if (open && mode === "update" && initialValues) {
      form.reset({
        name: initialValues.name.en,
        slug: initialValues.slug,
        description: initialValues.description ?? "",
        parentId: initialValues.parentId ?? "none",
        featuredImage: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[999]">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm ease-out data-closed:opacity-0" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform space-y-4 p-4 rounded-lg bg-background text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle
              as="div"
              className="flex items-center justify-between text-lg font-medium leading-6"
            >
              <h3>
                {mode === "create" ? "Add New Category" : "Update Category"}
              </h3>
              <CloseButton
                as={Button}
                variant="link"
                className={
                  "p-1 flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-muted-foreground"
                }
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </CloseButton>
            </DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  mode === "create"
                    ? handleCreateCategory
                    : handleUpdateCategory
                )}
                className="grid gap-4 grid-cols-1 md:grid-cols-2"
              >
                <FormField
                  control={form.control}
                  name="name.fr"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Name french</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name.en"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Name english</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name.ar"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Name arabic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Parent Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoading ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading categories...
                            </SelectItem>
                          ) : isError ? (
                            <SelectItem value="error" disabled>
                              Error:{" "}
                              {(error as any)?.response?.data?.message ||
                                "Failed to load categories"}
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="none">None</SelectItem>
                              {mode === "update"
                                ? categories
                                    .filter(
                                      (category) =>
                                        category.id !== initialValues?.id
                                    )
                                    .map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name.en}
                                      </SelectItem>
                                    ))
                                : categories.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name.en}
                                    </SelectItem>
                                  ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 space-y-3">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="md:col-span-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      createCategoryMutation.isPending ||
                      updateCategoryMutation.isPending
                    }
                    isLoading={
                      createCategoryMutation.isPending ||
                      updateCategoryMutation.isPending
                    }
                  >
                    {mode === "create" ? (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Category
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
