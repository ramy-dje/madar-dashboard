import * as z from "zod";

export const TenderValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  features: z.array(z.string()).optional(),
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

export type TenderSchemaType = z.infer<typeof TenderValidationSchema>;
