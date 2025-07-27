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
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";

// Create SEO Section

interface Props {
  id: string;
}

const SEO_Section = forwardRef<HTMLDivElement, Props>(({ id }, ref) => {
  const {
    formState: { disabled },
    control,
  } = useFormContext();

  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Search Engine Optimization
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The SEO metadata like title description and keywords
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* post seo page title */}

        <FormField
          control={control}
          name={"seo.metaTitle"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input placeholder={"Title"} {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* post seo meta description */}
        <FormField
          control={control}
          name={"seo.metaDescription"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={"Description"}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});
SEO_Section.displayName = "SEO_Section";
export default SEO_Section;
