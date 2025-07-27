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
import { useFormContext, UseFormReturn } from "react-hook-form";
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
import { z } from "zod";
import { BlockEditor } from "@/components/tiptap/src/components/BlockEditor";
// Language validation schema - updated to validate all present languages

export const LanguageTitleSchema = z
  .record(z.string())
  .refine((data) => "en" in data, {
    message: "English (en) translation is required",
  });

// Helper type for language content
export type LanguageContent = {
  [languageCode: string]: string;
};

// Available languages (you can expand this)
export const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]["code"];
export type SetActiveLanguages = (
  languages: LanguageField[] | ((prev: LanguageField[]) => LanguageField[])
) => void;
export const getLanguageName = (code: string) => {
  return (
    AVAILABLE_LANGUAGES.find((lang) => lang.code === code)?.name ||
    code.toUpperCase()
  );
};

export const removeLanguage = (
  languageCode: LanguageCode,
  setActiveLanguages: SetActiveLanguages,
  methods: UseFormReturn<any>
) => {
  if (languageCode === "en") return; // Can't remove English

  setActiveLanguages((prev) =>
    prev.filter((lang) => lang.code !== languageCode)
  );

  // Remove from form values
  const currentTitle = methods.getValues("title") || {};
  const currentContent = methods.getValues("content") || {};

  delete currentTitle[languageCode];
  delete currentContent[languageCode];

  methods.setValue("title", { ...currentTitle });
  methods.setValue("content", { ...currentContent });

  // Clear any errors for the removed language
  methods.clearErrors([`title.${languageCode}`, `content.${languageCode}`]);
};

const hasLanguageErrors = (
  languageCode: string,
  methods: UseFormReturn<any>
) => {
  const titleErrors = methods.formState.errors.title as
    | Record<string, unknown>
    | undefined;
  const contentErrors = methods.formState.errors.content as
    | Record<string, unknown>
    | undefined;
  return Boolean(titleErrors?.[languageCode] || contentErrors?.[languageCode]);
};

export const getIncompleteLanguages = (
  activeLanguages: LanguageField[],
  methods: UseFormReturn<any>
) => {
  return activeLanguages.filter((lang) =>
    hasLanguageErrors(lang.code, methods)
  );
};

// Title and Content Multi-lang form Section

interface Props {
  id: string;
  title?: string;
  description?: string;
  activeLanguages: LanguageField[];
  setActiveLanguages: SetActiveLanguages;
}

const TitleContentMultiLangFormSection = forwardRef<HTMLDivElement, Props>(
  function TitleContentMultiLangFormSection(
    { title, description, activeLanguages, setActiveLanguages, id },
    ref
  ) {
    const {
      control,
      formState: { errors, disabled },
      getValues,
      setValue,
      clearErrors,
    } = useFormContext();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

      setValue("title", { ...currentTitle, [languageCode]: "" });
      setValue("content", { ...currentContent, [languageCode]: "" });

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

      delete currentTitle[languageCode];
      delete currentContent[languageCode];

      setValue("title", { ...currentTitle });
      setValue("content", { ...currentContent });

      // Clear any errors for the removed language
      clearErrors([`title.${languageCode}`, `content.${languageCode}`]);
    };

    const availableLanguagesToAdd = AVAILABLE_LANGUAGES.filter(
      (lang) =>
        !activeLanguages.some((activeLang) => activeLang.code === lang.code)
    );

    const hasLanguageErrors = (languageCode: string) => {
      return Boolean(
        (errors.title as any)?.[languageCode] ||
          (errors.content as any)?.[languageCode]
      );
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            {title || "Main Information"}
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            {description ||
              "This section allows you to manage the main content of your post in multiple languages. You can add, edit, and remove languages as needed."}
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
  }
);

export default TitleContentMultiLangFormSection;
