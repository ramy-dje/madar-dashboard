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
import { CategoryType } from "@/interfaces/categories.interface";
import TagInterface from "@/interfaces/tag.interface";
import { useCreateTag, useGetAllTags, useUpdateTag } from "../api-hooks";
import { ColorPicker } from "@/components/ui/color-picker";

// create tag zod validation schema

export const CreateTagValidationSchema = z
  .object({
    name: z.object({
      fr: z.string().min(1, "Tag name is required"),
      en: z.string().min(1, "Tag name is required"),
      ar: z.string().min(1, "Tag name is required"),
    }),
    slug: z
      .string()
      .min(1, "Tag slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must be lowercase and contain only letters, numbers, and hyphens"
      ),
    description: z.string().optional(),
    featuredImage: z.string().optional(),
    type: z.nativeEnum(CategoryType).optional(),
    parentId: z.string().nullable().optional(),
    color: z.string(),
  })
  .strict();

export type CreateTagValidationSchemaType = z.infer<
  typeof CreateTagValidationSchema
>;
const defaultValues: CreateTagValidationSchemaType = {
  name: {
    fr: "",
    en: "",
    ar: "",
  },
  slug: "",
  description: "",
  featuredImage: "",
  parentId: "none",
  color: "",
};
export const TagFormModal = ({
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
  initialValues?: TagInterface;
}) => {
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();

  const { toast } = useToast();

  const form = useForm<CreateTagValidationSchemaType>({
    resolver: zodResolver(CreateTagValidationSchema),
    defaultValues,
  });

  const { data, isLoading, isError, error } = useGetAllTags({ type });

  const tags = useMemo(() => data?.data || [], [data]);

  const handleCreateTag = async (values: CreateTagValidationSchemaType) => {
    try {
      await createTagMutation.mutateAsync({
        ...values,
        parentId: values.parentId === "none" ? null : values.parentId,
        type,
      });

      toast({
        title: "Success",
        description: "Tag created successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to create tag",
      });
    }
  };

  const handleUpdateTag = async (values: CreateTagValidationSchemaType) => {
    try {
      await updateTagMutation.mutateAsync({
        id: initialValues!.id,
        data: {
          ...values,
          parentId: values.parentId === "none" ? null : values.parentId,
        },
      });

      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as any).response?.data?.message ?? "Failed to update tag",
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
        name: {
          fr: initialValues.name.fr,
          en: initialValues.name.en,
          ar: initialValues.name.ar,
        },
        slug: initialValues.slug,
        description: initialValues.description ?? "",
        parentId: initialValues.parentId ?? "none",
        color: initialValues.color ?? "",
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
              <h3>{mode === "create" ? "Add New Tag" : "Update Tag"}</h3>
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
                  mode === "create" ? handleCreateTag : handleUpdateTag
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
                        <Input placeholder="Enter tag name" {...field} />
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
                        <Input placeholder="Enter tag name" {...field} />
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
                        <Input placeholder="Enter tag name" {...field} />
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
                        <Input placeholder="Enter tag slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Tag</FormLabel>
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
                              Loading tags...
                            </SelectItem>
                          ) : isError ? (
                            <SelectItem value="error" disabled>
                              Error:{" "}
                              {(error as any)?.response?.data?.message ||
                                "Failed to load tags"}
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="none">None</SelectItem>
                              {Array.isArray(tags) &&
                                (mode === "update"
                                  ? tags
                                      .filter(
                                        (tag) => tag?.id !== initialValues?.id
                                      )
                                      .map(
                                        (tag) =>
                                          tag?.id &&
                                          tag?.name && (
                                            <SelectItem
                                              key={tag.id}
                                              value={tag.id}
                                            >
                                              {tag.name.en}
                                            </SelectItem>
                                          )
                                      )
                                  : tags.map(
                                      (tag) =>
                                        tag?.id &&
                                        tag?.name && (
                                          <SelectItem
                                            key={tag.id}
                                            value={tag.id}
                                          >
                                            {tag.name.en}
                                          </SelectItem>
                                        )
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
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
                      createTagMutation.isPending || updateTagMutation.isPending
                    }
                    isLoading={
                      createTagMutation.isPending || updateTagMutation.isPending
                    }
                  >
                    {mode === "create" ? (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tag
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Tag
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
