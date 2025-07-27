import React, { forwardRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { HiOutlineTrash } from "react-icons/hi";
import { Plus } from "lucide-react";

// key-value Section

interface Props {
  id: string;
  title: string;
  description: string;
  buttonLabel?: string;
  label?: string;
  formName: string;
  placeholders?: string[];
  subFormNames?: string[];
}

const KeyValueSection = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      title,
      description,
      buttonLabel = "Add Feature",
      label = "Features",
      formName,
      placeholders = ["Feature (e.g. Bedrooms)", "Value (e.g. 3)"],
      subFormNames = ["key", "value"],
    },
    ref
  ) => {
    const {
      control,
      formState: { disabled },
    } = useFormContext();

    // FieldArrays for each field group
    const featureFields = useFieldArray({ control, name: formName });

    // Generic renderer for field arrays
    const renderFields = (
      fields: any[],
      namePrefix: string,
      removeFn: (index: number) => void
    ) => (
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 w-full">
            {placeholders.map((placeholder, index) => (
              <FormField
                key={`${placeholder}-${index}`}
                control={control}
                name={`${namePrefix}.${idx}.${subFormNames[index]}`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFn(idx)}
              className="size-10"
            >
              <HiOutlineTrash className="size-5" />
            </Button>
          </div>
        ))}
      </div>
    );

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>{title}</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            {description}
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent>
          {/* Features */}
          <div className="mb-6 col-span-2">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-lg">{label}</Label>
              <Button
                size="sm"
                onClick={() => featureFields.append({ key: "", value: "" })}
                type="button"
              >
                <Plus className="mr-2 h-4 w-4" /> {buttonLabel}
              </Button>
            </div>
            {featureFields.fields.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No features added yet.
              </p>
            ) : (
              renderFields(featureFields.fields, formName, featureFields.remove)
            )}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

KeyValueSection.displayName = "KeyValueSection";

export default KeyValueSection;
