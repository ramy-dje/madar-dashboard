"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { DropZoneCard } from "@/components/upload-files/drop-zone";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FileSelectorModal from "@/components/select-images-dialog";
import {
  FileTypeCategory,
  FOLDERS_NAME,
  handelRemoveImage,
} from "@/components/select-images-dialog/helper";
import { cn } from "@/lib/utils";
import { FilePreview } from "@/components/file-upload/file-preview";
import { FileInterface } from "@/interfaces/file-manager";
import ImageInputCloudinary from "@/components/cloudinaryImageUploader/imageInputCloudinary";
import { Label } from "../ui/label";
// Images Section

interface Props {
  id: string;
  title: string;
  description: string;
  parentName: FOLDERS_NAME;
  imageName?: string;
  imagePlaceholder?: string;
  allowedFileTypes?: FileTypeCategory[];
  maxFileSize?: number;
  maxFiles?: number;
}

const ImagesSection = forwardRef<HTMLDivElement, Props>(function ImagesSection(
  {
    id,
    title,
    description,
    parentName,
    imageName,
    imagePlaceholder,
    allowedFileTypes,
    maxFileSize = 1024 * 1024 * 2, // 2MB
    maxFiles = 1,
  },
  ref
) {
  const [isOpen, setOpen] = useState(false);
  const { control } = useFormContext();
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>{title}</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          {description}
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
      <div className="col-span-full flex flex-col gap-2">
        <Label>Image</Label>
        <FormField
          control={control}
          name={"image"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageInputCloudinary onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="col-span-full flex flex-col gap-2">
        <Label>Hero image</Label>
        <FormField
          control={control}
          name={"heroImage"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageInputCloudinary onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        {/*<div className="col-span-full flex flex-col gap-5">
          <div
            className="w-full flex items-center justify-center select-noneP border py-6 rounded-lg border-border cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <DropZoneCard placeholder={imagePlaceholder || "Select images"} />
          </div>
          <FormField
            control={control}
            name={imageName || "gallery_images"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <FileSelectorModal
                      isOpen={isOpen}
                      onClose={() => setOpen(false)}
                      allowedFileTypes={allowedFileTypes}
                      maxFileSize={maxFileSize}
                      setFormSelectedFiles={field.onChange}
                      formSelectedFiles={field.value}
                      maxFiles={maxFiles}
                      maxSelectedFiles={maxFiles}
                      parentName={parentName}
                    />
                    <div
                      className={cn(
                        "w-full grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]"
                      )}
                    >
                      {field.value?.map((file: FileInterface) => (
                        <FilePreview
                          key={file.id}
                          url={file.presignedUrl}
                          file={file as any}
                          onRemove={() =>
                            handelRemoveImage({
                              id: file.id,
                              files: field.value || [],
                              setFiles: field.onChange,
                            })
                          }
                          onlyImagePreview
                        />
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>*/}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default ImagesSection;
