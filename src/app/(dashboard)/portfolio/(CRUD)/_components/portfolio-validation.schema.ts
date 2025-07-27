import { LanguageTitleSchema } from "@/components/form-sections/title-content-multi-lang.section";
import { z } from "zod";

export const PortfolioSchema = z
  .object({
    title: LanguageTitleSchema,
    content: LanguageTitleSchema,
    summary: LanguageTitleSchema,
    features: z
      .array(
        z.object({
          key: z.string().min(1, "Key is required"),
          value: z.string().min(1, "value is required"),
        })
      )
      .optional(),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
      .optional(),
    categories: z.array(z.object({ id: z.string(), name: z.string() })),
    tags: z.array(z.object({ id: z.string(), name: z.string() })),
    gallery_images: z
      .array(z.any())
      .max(10, "You can select up to 10 images")
      .optional(),
    gallery_images_url: z.array(z.string()).optional(),
    status: z.enum(["draft", "published"]).optional(),
  })
  .superRefine((data, ctx) => {
    // Custom validation for individual language fields - only title is required
    for (const [lang, title] of Object.entries(data.title)) {
      if (!title || title.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Title is required for ${lang.toUpperCase()}`,
          path: ["title", lang],
        });
      }
    }
  });

export type PortfolioSchemaType = z.infer<typeof PortfolioSchema>;
