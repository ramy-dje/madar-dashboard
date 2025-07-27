"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import TextEditor from "@/components/text-editor";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

// Title and description Infos Section

interface Props {
  id: string;
  title: string;
  titleName?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  description: string;
  descriptionName?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
}

const TitleContentSection = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      title,
      titleName,
      titleLabel,
      titlePlaceholder,
      description,
      descriptionName,
      descriptionLabel,
      descriptionPlaceholder,
    },
    ref
  ) => {
    const {
      control,
      formState: { disabled },
    } = useFormContext();

    // Change the name to the category when the category gets changed

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>{title}</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            {description}
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="flex flex-col space-y-6 col-span-2">
            <FormField
              control={control}
              name={titleName || `title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {titleLabel || "Title"}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={titlePlaceholder || `Enter title`}
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
              name={descriptionName || `content`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{descriptionLabel || "Content"}</FormLabel>
                  <FormControl>
                    <TextEditor
                      content={field.value}
                      heading
                      setContent={(n) => {
                        field.onChange(n);
                      }}
                      disabled={disabled}
                      className="col-span-2 h-[18em] mb-[3em]"
                      placeholder={descriptionPlaceholder || `Enter content`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

TitleContentSection.displayName = "TitleContentSection";

export default TitleContentSection;
