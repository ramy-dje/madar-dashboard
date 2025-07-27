/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import {
  CreationFormContent,
  CreationFormFooterActions,
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";

import { useHash } from "@mantine/hooks";
import {
  CreatePostValidationSchema,
  CreatePostValidationSchemaType,
  UpdatePostValidationSchema,
  UpdatePostValidationSchemaType,
} from "./post-validation.schema";
import { PostContentFormData } from "@/interfaces/post.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import usePostsStore from "../../store";
import Event_Form_Section from "./event-form-section";
import FormErrorDisplay, {
  convertRHFErrors,
} from "@/components/form-sections/form-error-display";
import ImagesSection from "@/components/form-sections/images.section";
import { FOLDERS_NAME } from "@/components/select-images-dialog/helper";
import { Switch } from "@/components/ui/switch";
import CategoriesTagsSection from "@/components/form-sections/categories-tags.section";
import { CategoryType } from "@/interfaces/categories.interface";
import { useRouter } from "next/navigation";
import TitleContentMultiLangFormSection, {
  getIncompleteLanguages,
  getLanguageName,
  removeLanguage,
} from "@/components/form-sections/title-content-multi-lang.section";

// Validate and prepare the data based on type
export const preparePostData = (
  data: CreatePostValidationSchemaType | UpdatePostValidationSchemaType
): PostContentFormData => {
  const image_ids = data.gallery_images?.map((image) => image.id) || [];
  const status = data.status || "published"; // Default to published if not provided
  console.log(data);
  const baseData = {
    title: data.title,
    content: data.content,
    showComments: data.show_comments,
    categories: data.categories.map((category) => category.id),
    tags: data.tags.map((tag) => tag.id),
    heroImage: data.heroImage,
    image: data.image,
    media: image_ids,
    status, // use the parameter
  };
  if (data.type === "post") {
    return {
      ...baseData,
      type: "post" as const,
      readabilityEnabled: data.readability,
    };
  }

  if (data.type === "event") {
    return {
      ...baseData,
      type: "event" as const,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    };
  }

  // type === "destination"
  return {
    ...baseData,
    type: "destination" as const,
    readabilityEnabled: data.readability,
  };
};

interface PostFromProps<T> {
  mode: "create" | "update";
  onFinish: (
    data: CreatePostValidationSchemaType | UpdatePostValidationSchemaType
  ) => Promise<void>;
  initialValues?: T;
  isLoading?: boolean;
  type: "post" | "event" | "destination";
}

export default function PostFrom<T>({
  mode,
  type,
  isLoading,
  initialValues,
  onFinish,
}: PostFromProps<T>) {
  const { activeLanguages, setActiveLanguages } = usePostsStore();

  // Determine which schema to use based on mode
  const validationSchema =
    mode === "create" ? CreatePostValidationSchema : UpdatePostValidationSchema;

  // form
  const methods = useForm<
    CreatePostValidationSchemaType | UpdatePostValidationSchemaType
  >({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues || {
      type,
      title: { en: "" },
      show_comments: false,
      categories: [],
      tags: [],
      content: { en: "" },
      ...(type !== "event"
        ? {
            readability: false,
          }
        : {}),
      gallery_images: [],
      gallery_images_url: [],
    },
  });

  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_show_comments_readability_ref = useRef<HTMLDivElement>(null);
  const section_gallery_ref = useRef<HTMLDivElement>(null);
  const section_tags_categories_ref = useRef<HTMLDivElement>(null);
  const section_event_deadline_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("title");
    window.scrollTo({ top: 0 });
  }, []);

  const handleSaveAsDraft = async () => {
    // Get the current form values
    const values = methods.getValues();
    if (!values.title.en || values.title.en.trim() === "") {
      // If English title is empty, set error
      methods.setError("title.en", {
        type: "manual",
        message: "Title is required",
      });
      return;
    }
    // Set status to draft
    const draftData = { ...values, status: "draft" as "draft" | "published" };
    // Call onFinish with draft status
    await onFinish(draftData);
  };
  console.log(methods.getValues());

  return (
    <div className="relative">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onFinish)}>
          <div className="w-full min-h-screen">
            {/* header */}
            <CreationTabsContent>
              <CreationTabsTab
                hash="#main-information"
                selected={hash == "#main-information"}
                ref={section_main_info_ref}
              >
                Main Information
              </CreationTabsTab>
              <CreationTabsTab
                hash="#show-comments-readability"
                selected={hash == "#show-comments-readability"}
                ref={section_tags_categories_ref}
              >
                Comment & readability
              </CreationTabsTab>
              <CreationTabsTab
                hash="#gallery"
                selected={hash == "#gallery"}
                ref={section_gallery_ref}
              >
                Gallery
              </CreationTabsTab>
              <CreationTabsTab
                hash="#tags-categories"
                selected={hash == "#tags-categories"}
                ref={section_tags_categories_ref}
              >
                Categories & Tags
              </CreationTabsTab>
              {type === "event" && (
                <CreationTabsTab
                  hash="#event-deadline"
                  selected={hash == "#event-deadline"}
                  ref={section_event_deadline_ref}
                >
                  Event deadline
                </CreationTabsTab>
              )}
            </CreationTabsContent>

            <CreationFormContent>
              {/* main info section */}
              <TitleContentMultiLangFormSection
                activeLanguages={activeLanguages}
                setActiveLanguages={setActiveLanguages}
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* show comments and readability */}
              <CreationFormSection
                ref={section_show_comments_readability_ref}
                id={"#show-comments-readability"}
              >
                <CreationFormSectionInfo>
                  <CreationFormSectionInfoTitle>
                    Comment & readability
                  </CreationFormSectionInfoTitle>
                  <CreationFormSectionInfoDescription>
                    Show comments and readability of the post
                  </CreationFormSectionInfoDescription>
                </CreationFormSectionInfo>
                <CreationFormSectionContent>
                  <FormField
                    control={methods.control}
                    name="show_comments"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={methods.formState.disabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {methods.formState.defaultValues?.type !== "event" && (
                    <FormField
                      control={methods.control}
                      name="readability"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0">
                          <FormLabel>Readability</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={methods.formState.disabled}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </CreationFormSectionContent>
              </CreationFormSection>

              {/* gallery */}
              <ImagesSection
                ref={section_gallery_ref}
                id="#gallery"
                imageName="media"
                title="Image & Photos"
                description="The images and gallery photos of the post"
                parentName={FOLDERS_NAME.BLOG}
                allowedFileTypes={["image"]}
                maxFiles={10}
              />

              {/* tags and categories */}
              <CategoriesTagsSection
                ref={section_tags_categories_ref}
                id="#tags-categories"
                title="Categories & Tags"
                description="Select categories and tags that best describe your post."
                categoryType={CategoryType.POST}
              />
              {type === "event" && (
                <Event_Form_Section
                  title="Event"
                  description="Set the start and end date for the event and location"
                  inputLabel="Event"
                  ref={section_event_deadline_ref}
                  id="#event-deadline"
                />
              )}
              {/* Form Errors Summary */}
              <FormErrorDisplay
                errors={convertRHFErrors(
                  methods.formState.errors,
                  {
                    "title.en": "English Title",
                    "content.en": "English Content",
                    startDate: "Start Date",
                    endDate: "End Date",
                    type: "Post Type",
                    gallery_images: "Images",
                  },
                  getLanguageName
                )}
                showQuickActions={
                  getIncompleteLanguages(activeLanguages, methods).filter(
                    (lang) => lang.code !== "en"
                  ).length > 0
                }
                quickActions={getIncompleteLanguages(activeLanguages, methods)
                  .filter((lang) => lang.code !== "en")
                  .map((lang) => ({
                    label: `Remove ${lang.name}`,
                    action: () =>
                      removeLanguage(lang.code, setActiveLanguages, methods),
                    variant: "outline" as const,
                  }))}
                onFieldClick={(field) => {
                  // Scroll to field and focus it
                  const element =
                    document.getElementById(field) ||
                    document.querySelector(`[name="${field}"]`);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    if (element instanceof HTMLElement) {
                      element.focus();
                    }
                  }
                }}
                variant="destructive"
                collapsible={true}
                maxHeight="250px"
              />
            </CreationFormContent>
          </div>
          <CreationFormFooterActions>
            <Button
              onClick={handleSaveAsDraft}
              disabled={isLoading}
              type="button"
              variant="outline"
            >
              Save as draft
            </Button>
            <Button
              onClick={() => router.replace("/posts")}
              disabled={isLoading}
              type="button"
              variant="outline"
            >
              {/* Save as draft */}
              Cancel
            </Button>
            <Button disabled={isLoading} isLoading={isLoading} type="submit">
              {mode === "create" ? "Create Post" : "Update Post"}
            </Button>
          </CreationFormFooterActions>
        </form>
      </Form>
    </div>
  );
}
