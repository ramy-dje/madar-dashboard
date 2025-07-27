import { LanguageTitleSchema } from "@/components/form-sections/title-content-multi-lang.section";
import * as z from "zod";

export const ServiceValidationSchema = z.object({
  title: LanguageTitleSchema,
  content: LanguageTitleSchema,
  features: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "value is required"),
      })
    )
    .optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  media: z.array(z.string()).optional(),
  document: z.string().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
  gallery_images: z
    .array(z.any())
    .max(10, "You can select up to 10 images")
    .optional(),
  gallery_images_url: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type ServiceSchemaType = z.infer<typeof ServiceValidationSchema>;
