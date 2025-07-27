import { zodResolver } from "@hookform/resolvers/zod";
import { useHash } from "@mantine/hooks";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  PortfolioSchema,
  PortfolioSchemaType,
} from "./portfolio-validation.schema";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import { Form } from "@/components/ui/form";
import ImagesSection from "@/components/form-sections/images.section";
import { FOLDERS_NAME } from "@/components/select-images-dialog/helper";
import KeyValueSection from "@/components/form-sections/key-value-section";
import FormErrorDisplay, {
  convertRHFErrors,
} from "@/components/form-sections/form-error-display";
import CategoriesTagsSection from "@/components/form-sections/categories-tags.section";
import { CategoryType } from "@/interfaces/categories.interface";
import SEO_Section from "@/components/form-sections/seo.section";
import { useRouter } from "next/navigation";
import usePortfolioStore from "../../store";
import CreatePortfolio_MainInformation_Section from "./main-info.section";
import {
  getLanguageName,
  LanguageCode,
} from "@/components/form-sections/title-content-multi-lang.section";

// Validate and prepare the data
export const preparePortfolioData = (data: PortfolioSchemaType): any => {
  const imagesIds = data.gallery_images?.map((image) => image.id) || [];
  const categoriesIds = data.categories.map((category) => category.id) || [];
  const tagsIds = data.tags.map((tag) => tag.id) || [];

  return {
    title: data.title,
    content: data.content,
    summary: data.summary,
    features: data.features,
    seo: data.seo,
    media: imagesIds,
    categories: categoriesIds,
    tags: tagsIds,
    status: data.status || "published", // Default to published if not provided
  };
};

interface PortfolioFromProps<T> {
  mode: "create" | "update";
  onFinish: (data: any) => Promise<void>;
  initialValues?: T;
  isLoading?: boolean;
}

export default function PortfolioFrom<T>({
  mode,
  isLoading,
  initialValues,
  onFinish,
}: PortfolioFromProps<T>) {
  const { activeLanguages, setActiveLanguages } = usePortfolioStore();
  // form
  const methods = useForm<PortfolioSchemaType>({
    resolver: zodResolver(PortfolioSchema),
    defaultValues: initialValues || {
      title: { en: "" },
      features: [],
      categories: [],
      tags: [],
      content: { en: "" },
      summary: { en: "" },
      gallery_images: [],
      gallery_images_url: [],
      seo: { metaTitle: "", metaDescription: "" },
    },
  });

  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_gallery_ref = useRef<HTMLDivElement>(null);
  const section_features = useRef<HTMLDivElement>(null);
  const section_categories = useRef<HTMLDivElement>(null);
  const section_seo_ref = useRef<HTMLDivElement>(null);

  const removeLanguage = (languageCode: LanguageCode) => {
    if (languageCode === "en") return; // Can't remove English

    setActiveLanguages((prev) =>
      prev.filter((lang) => lang.code !== languageCode)
    );

    // Remove from form values
    const currentTitle = methods.getValues("title") || {};
    const currentContent = methods.getValues("content") || {};
    const currentSummary = methods.getValues("summary") || {};

    delete currentTitle[languageCode];
    delete currentContent[languageCode];

    methods.setValue("title", { ...currentTitle });
    methods.setValue("content", { ...currentContent });
    methods.setValue("summary", { ...currentSummary });

    // Clear any errors for the removed language
    methods.clearErrors([
      `title.${languageCode}`,
      `content.${languageCode}`,
      `summary.${languageCode}`,
    ]);
  };

  const hasLanguageErrors = (languageCode: string) => {
    return Boolean(
      methods.formState.errors.title?.[languageCode] ||
        methods.formState.errors.content?.[languageCode]
    );
  };

  const getIncompleteLanguages = () => {
    return activeLanguages.filter((lang) => hasLanguageErrors(lang.code));
  };

  const handleSaveAsDraft = async () => {
    // Get the current form values
    const values = methods.getValues();
    if (!values.title || values.title.en.trim() === "") {
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

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [methods, isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("title");
    window.scrollTo({ top: 0 });
  }, [methods]);

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
                hash="#gallery"
                selected={hash == "#gallery"}
                ref={section_gallery_ref}
              >
                Gallery
              </CreationTabsTab>

              <CreationTabsTab
                hash="#features"
                selected={hash == "#features"}
                ref={section_features}
              >
                Features
              </CreationTabsTab>
              <CreationTabsTab
                hash="#categories"
                selected={hash == "#categories"}
                ref={section_categories}
              >
                Categories & Tags
              </CreationTabsTab>
              <CreationTabsTab
                hash="#seo"
                selected={hash == "#seo"}
                ref={section_seo_ref}
              >
                SEO
              </CreationTabsTab>
            </CreationTabsContent>

            <CreationFormContent>
              {/* main info section */}
              <CreatePortfolio_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />

              {/* gallery */}
              <ImagesSection
                ref={section_gallery_ref}
                id="#gallery"
                imageName="gallery_images"
                title="Project Gallery"
                description="Upload images to showcase your project."
                parentName={FOLDERS_NAME.PORTFOLIO}
              />
              {/* features */}
              <KeyValueSection
                ref={section_features}
                id="#features"
                title="Project Features"
                description="Add key features of your project."
                formName="features"
              />
              {/* categories */}
              <CategoriesTagsSection
                ref={section_categories}
                id="#categories"
                title="Project categories & tags"
                description="Select categories and tags that best describe your project."
                categoryType={CategoryType.PORTFOLIO}
              />
              {/* SEO */}
              <SEO_Section ref={section_seo_ref} id="#seo" />

              {/* Form Errors Summary */}
              <FormErrorDisplay
                errors={convertRHFErrors(
                  methods.formState.errors,
                  {
                    "title.en": "English Title",
                    "content.en": "English Content",
                    "summary.en": "English Summary",
                    gallery_images: "Images",
                  },
                  getLanguageName
                )}
                showQuickActions={
                  getIncompleteLanguages().filter((lang) => lang.code !== "en")
                    .length > 0
                }
                quickActions={getIncompleteLanguages()
                  .filter((lang) => lang.code !== "en")
                  .map((lang) => ({
                    label: `Remove ${lang.name}`,
                    action: () => removeLanguage(lang.code),
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
              onClick={() => router.replace("/portfolio")}
              disabled={isLoading}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} isLoading={isLoading} type="submit">
              {mode === "create" ? "Create Portfolio" : "Update Portfolio"}
            </Button>
          </CreationFormFooterActions>
        </form>
      </Form>
    </div>
  );
}
