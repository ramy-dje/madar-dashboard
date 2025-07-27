"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forwardRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreatePostValidationSchemaType } from "./post-validation.schema";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { Input } from "@/components/ui/input";

// Event form section

interface Props {
  id: string;
  title: string;
  description: string;
  inputLabel: string;
}

const Event_Form_Section = forwardRef<HTMLDivElement, Props>(
  function Event_Form_Section({ id, title, description }, ref) {
    const { control } = useFormContext<CreatePostValidationSchemaType>();
    const startDate = useWatch({
      control,
      name: "startDate",
    });
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>{title}</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            {description}
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <FormField
            control={control}
            name={`startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    placeholder="Pick a start date"
                    {...field}
                    className="w-full"
                    mode="single"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    placeholder="Pick a end date"
                    {...field}
                    className="w-full"
                    mode="single"
                    disabled={startDate ? { before: startDate } : true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full">
            <FormField
              control={control}
              name={`location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
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

export default Event_Form_Section;
