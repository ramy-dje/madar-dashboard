"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { X, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextEditor from "@/components/text-editor";
import { LanguageField } from "@/interfaces/post.interface";
import usePortfolioStore from "@/app/(dashboard)/posts/store";
import { PortfolioSchemaType } from "./portfolio-validation.schema";

import { Textarea } from "@/components/ui/textarea";
import {
  AVAILABLE_LANGUAGES,
  LanguageCode,
} from "@/components/form-sections/title-content-multi-lang.section";
import { BlockEditor } from "@/components/tiptap/src/components/BlockEditor";

// Create Portfolio Main Info Section

interface Props {
  id: string;
}

const CreatePortfolio_MainInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(function CreatePortfolio_MainInformation_Section({ id }, ref) {
  const {
    control,
    formState: { errors, disabled },
    getValues,
    setValue,
    clearErrors,
  } = useFormContext<PortfolioSchemaType>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeLanguages, setActiveLanguages } = usePortfolioStore();

  const addLanguage = (languageCode: LanguageCode) => {
    const language = AVAILABLE_LANGUAGES.find(
      (lang) => lang.code === languageCode
    );
    if (!language) return;

    const isAlreadyAdded = activeLanguages.some(
      (lang) => lang.code === languageCode
    );
    if (isAlreadyAdded) return;

    const newLanguage: LanguageField = {
      id: languageCode,
      code: languageCode,
      name: language.name,
    };

    setActiveLanguages((prev) => [...prev, newLanguage]);

    // Initialize empty values for the new language
    const currentTitle = getValues("title") || {};
    const currentContent = getValues("content") || {};
    const currentSummary = getValues("summary") || {};

    setValue("title", { ...currentTitle, [languageCode]: "" });
    setValue("content", { ...currentContent, [languageCode]: "" });
    setValue("summary", { ...currentSummary, [languageCode]: "" });

    setIsDialogOpen(false);
  };

  const removeLanguage = (languageCode: LanguageCode) => {
    if (languageCode === "en") return; // Can't remove English

    setActiveLanguages((prev) =>
      prev.filter((lang) => lang.code !== languageCode)
    );

    // Remove from form values
    const currentTitle = getValues("title") || {};
    const currentContent = getValues("content") || {};
    const currentSummary = getValues("summary") || {};

    delete currentTitle[languageCode];
    delete currentContent[languageCode];
    delete currentSummary[languageCode];

    setValue("title", { ...currentTitle });
    setValue("content", { ...currentContent });
    setValue("summary", { ...currentSummary });

    // Clear any errors for the removed language
    clearErrors([
      `title.${languageCode}`,
      `content.${languageCode}`,
      `summary.${languageCode}`,
    ]);
  };

  const availableLanguagesToAdd = AVAILABLE_LANGUAGES.filter(
    (lang) =>
      !activeLanguages.some((activeLang) => activeLang.code === lang.code)
  );

  const hasLanguageErrors = (languageCode: string) => {
    return Boolean(
      errors.title?.[languageCode] ||
        errors.content?.[languageCode] ||
        errors.summary?.[languageCode]
    );
  };

  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Main Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The Portfolio title, summary and content
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        <div className="flex flex-col space-y-6 col-span-2">
          {/* Language Management */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Label className="text-base font-semibold">
                Content Languages
              </Label>
              <div className="flex items-center gap-2">
                {availableLanguagesToAdd.length > 0 && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Language
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Language</DialogTitle>
                        <DialogDescription>
                          Select a language to add translation fields for your
                          content.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-2 py-4">
                        {availableLanguagesToAdd.map((lang) => (
                          <Button
                            key={lang.code}
                            type="button"
                            variant="ghost"
                            className="justify-start"
                            onClick={() => addLanguage(lang.code)}
                          >
                            {lang.name}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Active Languages Display */}
            <div className="flex flex-wrap gap-2">
              {activeLanguages.map((lang) => (
                <Badge
                  key={lang.code}
                  variant={
                    hasLanguageErrors(lang.code) ? "destructive" : "secondary"
                  }
                  className="flex items-center gap-1"
                >
                  {lang.name}
                  {hasLanguageErrors(lang.code) && (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {lang.code !== "en" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive/10"
                      onClick={() => removeLanguage(lang.code)}
                      aria-label={`Remove ${lang.name}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Multi-Language Content Fields */}
          <div className="space-y-8">
            {activeLanguages.map((lang, index) => (
              <div key={lang.code} className="space-y-4">
                {/* Language Section Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-accent-foreground/10">
                  <h3 className="text-lg font-medium text-primary-dark">
                    {lang.name} Content
                    <span className="text-destructive ml-1">*</span>
                  </h3>
                  {hasLanguageErrors(lang.code) && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Incomplete</span>
                    </div>
                  )}
                  {lang.code !== "en" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive hover:bg-destructive/10"
                      onClick={() => removeLanguage(lang.code)}
                      aria-label={`Remove ${lang.name}`}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <FormField
                  control={control}
                  name={`title.${lang.code}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter title in ${lang.name}`}
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`summary.${lang.code}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            "Enter a brief summary of your project..."
                          }
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Content Field */}
                <FormField
                  control={control}
                  name={`content.${lang.code}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <BlockEditor
                          allowEdit={true}
                          customContent={field.value && JSON.parse(field.value)}
                          onChange={(content) => {
                            field.onChange(content);
                          }}
                        />
                        {/*<TextEditor
                          content={field.value}
                          heading
                          setContent={(n) => {
                            field.onChange(n);
                          }}
                          disabled={disabled}
                          className="col-span-2 h-[18em] mb-[3em]"
                          placeholder={`Enter content in ${lang.name}`}
                        />*/}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Separator line (except for last item) */}
                {index < activeLanguages.length - 1 && (
                  <hr className="border-accent-foreground/10 my-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreatePortfolio_MainInformation_Section;
