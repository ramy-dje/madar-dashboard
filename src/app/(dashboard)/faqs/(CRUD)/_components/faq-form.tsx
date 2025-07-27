import { zodResolver } from "@hookform/resolvers/zod";
import { useHash } from "@mantine/hooks";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { FaqSchemaType, FaqValidationSchema } from "./faq-validation.schema";
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
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import KeyValueSection from "@/components/form-sections/key-value-section";
import FormErrorDisplay, {
  convertRHFErrors,
} from "@/components/form-sections/form-error-display";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import CategoriesTagsSection from "@/components/form-sections/categories-tags.section";
import { CategoryType } from "@/interfaces/categories.interface";

export const prepareFAQData = (data: FaqSchemaType): any => {
  return {
    title: data.title,
    qaPairs: data.qaPairs,
    categories: data.categories.map((category) => category.id),
    status: data.status || "published", // Default to published if not provided
  };
};

interface FaqFormProps {
  mode: "create" | "update";
  onFinish: (data: FaqSchemaType) => Promise<void>;
  initialValues?: FaqSchemaType;
  isLoading?: boolean;
}

export default function FaqForm({
  mode,
  isLoading,
  initialValues,
  onFinish,
}: FaqFormProps) {
  const methods = useForm<FaqSchemaType>({
    resolver: zodResolver(FaqValidationSchema),
    defaultValues: initialValues || {
      title: "",
      categories: [],
      qaPairs: [],
    },
  });

  const router = useRouter();
  const [hash] = useHash();

  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_categories_ref = useRef<HTMLDivElement>(null);
  const section_qaPairs_ref = useRef<HTMLDivElement>(null);

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
                hash="#categories"
                selected={hash === "#categories"}
                ref={section_categories_ref}
              >
                Categories
              </CreationTabsTab>
              <CreationTabsTab
                hash="#qaPairs"
                selected={hash === "#qaPairs"}
                ref={section_qaPairs_ref}
              >
                QA
              </CreationTabsTab>
            </CreationTabsContent>

            <CreationFormContent>
              <CreationFormSection
                ref={section_main_info_ref}
                id="#main-information"
              >
                <CreationFormSectionInfo>
                  <CreationFormSectionInfoTitle>
                    FAQ Information
                  </CreationFormSectionInfoTitle>
                  <CreationFormSectionInfoDescription>
                    Provide the main information about your FAQ.
                  </CreationFormSectionInfoDescription>
                </CreationFormSectionInfo>
                <CreationFormSectionContent>
                  <div className="flex flex-col space-y-6 col-span-2">
                    <FormField
                      control={methods.control}
                      name={`title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Title
                            <span className="text-destructive ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter title`}
                              {...field}
                              disabled={methods.formState.disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CreationFormSectionContent>
              </CreationFormSection>
              {/* categories */}
              <CategoriesTagsSection
                ref={section_categories_ref}
                id="#categories"
                title="Categories"
                description="Select categories that best describe your FAQ."
                categoryType={CategoryType.FAQ}
                showTags={false}
              />
              <KeyValueSection
                ref={section_qaPairs_ref}
                id="#qaPairs"
                title="Quesions and Answers"
                description="Please provide questions and answers for your FAQ."
                formName="qaPairs"
                buttonLabel="Add Question and Answer"
                label={"Question and answer pairs"}
                subFormNames={["question", "answer"]}
                placeholders={["Question", "Answer"]}
              />

              <FormErrorDisplay
                errors={convertRHFErrors(methods.formState.errors, {})}
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
              onClick={() => router.replace("/faqs")}
              disabled={isLoading}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} isLoading={isLoading} type="submit">
              {mode === "create" ? "Create FAQ" : "Update FAQ"}
            </Button>
          </CreationFormFooterActions>
        </form>
      </Form>
    </div>
  );
}
