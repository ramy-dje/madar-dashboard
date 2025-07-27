"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import { CategoryType } from "@/interfaces/categories.interface";
import CategoriesComboboxFormItem from "@/components/categories-page/_components/categories-select-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TagsComboboxFormItem from "../tags-page/_components/tags-select-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGetAllCategories } from "../categories-page/api-hooks";

// categories Section

interface Props {
  id: string;
  title?: string;
  description: string;
  categoryType: CategoryType;
  showCategories?: boolean;
  showTags?: boolean;
}

const CategoriesTagsSection = forwardRef<HTMLDivElement, Props>(
  function CategoriesTagsSection(
    {
      id,
      title,
      description,
      categoryType,
      showCategories = true,
      showTags = true,
    }: Props,
    ref
  ) {
    const { control } = useFormContext();
    const { data: categories } = useGetAllCategories({ type: categoryType });
    
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            {title || "Categories & tags"}
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            {description}
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>

        {showCategories && (
            <FormField
              control={control}
              name={`category`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.data?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/*  categories */}
          {showCategories && (
            <FormField
              control={control}
              name={`categories`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CategoriesComboboxFormItem
                      selectedCategories={field.value}
                      onSelectCategory={field.onChange}
                      placeholder="Choose a category"
                      name="categories"
                      type={categoryType}
                      isAddButtonVisible
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showTags && (
            <FormField
              control={control}
              name={`tags`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsComboboxFormItem
                      selectedTags={field.value}
                      onSelectTag={field.onChange}
                      placeholder="Choose a tag"
                      name="tags"
                      type={categoryType}
                      isAddButtonVisible
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CategoriesTagsSection;
