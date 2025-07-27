import { zodResolver } from "@hookform/resolvers/zod";
import { useHash } from "@mantine/hooks";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  TenderSchemaType,
  TenderValidationSchema,
} from "./tender-validation.schema";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import TitleContentSection from "@/components/form-sections/title-content-section";
import ImagesSection from "@/components/form-sections/images.section";
import { FOLDERS_NAME } from "@/components/select-images-dialog/helper";
import KeyValueSection from "@/components/form-sections/key-value-section";
import FormErrorDisplay, {
  convertRHFErrors,
} from "@/components/form-sections/form-error-display";
import CategoriesTagsSection from "@/components/form-sections/categories-tags.section";
import SEO_Section from "@/components/form-sections/seo.section";
import { CategoryType } from "@/interfaces/categories.interface";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";

export const prepareTenderData = (data: TenderSchemaType): any => {
  const imagesIds = data.gallery_images?.map((image) => image.id) || [];
  const categoriesIds = data.categories?.map((category) => category.id) || [];

  return {
    title: data.title,
    content: data.content,
    features: data.features,
    media: imagesIds,
    categories: categoriesIds,
    seo: data.seo,
    status: data.status || "published", // Default to published if not provided
  };
};

interface TenderFormProps {
  mode: "create" | "update";
  onFinish: (data: TenderSchemaType) => Promise<void>;
  initialValues?: TenderSchemaType;
  isLoading?: boolean;
}

export default function TenderForm({
  mode,
  isLoading,
  initialValues,
  onFinish,
}: TenderFormProps) {
  const methods = useForm<TenderSchemaType>({
    resolver: zodResolver(TenderValidationSchema),
    defaultValues: initialValues || {
      title: "",
      content: "",
      features: [],
      categories: [],
      media: [],
      document: "",
      gallery_images: [],
      gallery_images_url: [],
      seo: { metaTitle: "", metaDescription: "" },
    },
  });

  const router = useRouter();
  const [hash] = useHash();

  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_gallery_ref = useRef<HTMLDivElement>(null);
  const section_features_ref = useRef<HTMLDivElement>(null);
  const section_categories_ref = useRef<HTMLDivElement>(null);
  const section_seo_ref = useRef<HTMLDivElement>(null);

  const handleSaveAsDraft = async () => {
    // Get the current form values
    const values = methods.getValues();
    if (!values.title || values.title.trim() === "") {
      // If English title is empty, set error
      methods.setError("title", {
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

  React.useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [methods, isLoading]);

  return (
    <div className="relative">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onFinish)}>
          <div className="w-full min-h-screen">
            <CreationTabsContent>
              <CreationTabsTab
                hash="#main-information"
                selected={hash === "#main-information"}
                ref={section_main_info_ref}
              >
                Main Information
              </CreationTabsTab>
              <CreationTabsTab
                hash="#gallery"
                selected={hash === "#gallery"}
                ref={section_gallery_ref}
              >
                Gallery
              </CreationTabsTab>
              <CreationTabsTab
                hash="#features"
                selected={hash === "#features"}
                ref={section_features_ref}
              >
                Features
              </CreationTabsTab>
              <CreationTabsTab
                hash="#categories"
                selected={hash === "#categories"}
                ref={section_categories_ref}
              >
                Categories
              </CreationTabsTab>
              <CreationTabsTab
                hash="#seo"
                selected={hash === "#seo"}
                ref={section_seo_ref}
              >
                SEO
              </CreationTabsTab>
            </CreationTabsContent>

            <CreationFormContent>
              <TitleContentSection
                title="Tender Information"
                description="Provide the main information about your service."
                ref={section_main_info_ref}
                id="#main-information"
              />

              <ImagesSection
                ref={section_gallery_ref}
                id="#gallery"
                imageName="media"
                title="Tender Gallery"
                description="Upload images to showcase your service."
                parentName={FOLDERS_NAME.SERVICES}
              />

              <KeyValueSection
                ref={section_features_ref}
                id="#features"
                title="Tender Features"
                description="Add key features of your service."
                formName="features"
              />

              <CategoriesTagsSection
                ref={section_categories_ref}
                id="#categories"
                title="Tender Categories"
                description="Select categories that best describe your service."
                categoryType={CategoryType.SERVICE}
                showTags={false}
              />

              <SEO_Section ref={section_seo_ref} id="#seo" />

              <FormErrorDisplay
                errors={convertRHFErrors(methods.formState.errors, {
                  media: "Images",
                })}
                onFieldClick={(field) => {
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
              onClick={() => router.replace("/services")}
              disabled={isLoading}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} isLoading={isLoading} type="submit">
              {mode === "create" ? "Create Tender" : "Update Tender"}
            </Button>
          </CreationFormFooterActions>
        </form>
      </Form>
    </div>
  );
}
