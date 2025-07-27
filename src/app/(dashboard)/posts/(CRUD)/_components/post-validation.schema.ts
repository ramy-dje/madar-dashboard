import { LanguageTitleSchema } from "@/components/form-sections/title-content-multi-lang.section";
import { z } from "zod";

// Base schema for common fields
const BasePostSchema = z.object({
  title: LanguageTitleSchema,
  content: LanguageTitleSchema,
  show_comments: z.boolean(),
  heroImage: z.string().optional(),
  image: z.string().optional(),
  categories: z.array(z.object({ id: z.string(), name: z.object({ en: z.string(), ar: z.string(), fr: z.string() }) })),
  tags: z.array(z.object({ id: z.string(), name: z.object({ en: z.string(), ar: z.string(), fr: z.string() }) })),
  gallery_images: z
    .array(z.any())
    .max(10, "You can select up to 10 images")
    .optional(),
  gallery_images_url: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

// Base schema for update - with optional gallery_images
const BaseUpdatePostSchema = z.object({
  title: LanguageTitleSchema,
  content: LanguageTitleSchema,
  show_comments: z.boolean(),
  categories: z.array(z.object({ id: z.string(), name: z.object({ en: z.string(), ar: z.string(), fr: z.string() }) })),
  tags: z.array(z.object({ id: z.string(), name: z.object({ en: z.string(), ar: z.string(), fr: z.string() }) })),
  gallery_images: z
    .array(z.any())
    .max(10, "You can select up to 10 images")
    .optional(),
  gallery_images_url: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

// Create the final schema based on type
export const CreatePostValidationSchema = z
  .discriminatedUnion("type", [
    // Blog schema
    z.object({
      type: z.literal("post"),
      ...BasePostSchema.shape,
      readability: z.boolean(),
    }),
    // Event schema
    z.object({
      type: z.literal("event"),
      ...BasePostSchema.shape,
      startDate: z.date(),
      endDate: z.date(),
      location: z.string().optional(),
    }),
    // Destination schema
    z.object({
      type: z.literal("destination"),
      ...BasePostSchema.shape,
      readability: z.boolean(),
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.type === "event" && data.startDate && data.endDate) {
      if (data.startDate >= data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["endDate"],
        });
      }
    }

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

// Update schema - same as create but with optional gallery_images
export const UpdatePostValidationSchema = z
  .discriminatedUnion("type", [
    // Blog schema
    z.object({
      type: z.literal("post"),
      ...BaseUpdatePostSchema.shape,
      readability: z.boolean(),
    }),
    // Event schema
    z.object({
      type: z.literal("event"),
      ...BaseUpdatePostSchema.shape,
      startDate: z.date(),
      endDate: z.date(),
      location: z.string().optional(),
    }),
    // Destination schema
    z.object({
      type: z.literal("destination"),
      ...BaseUpdatePostSchema.shape,
      readability: z.boolean(),
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.type === "event" && data.startDate && data.endDate) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["endDate"],
        });
      }
    }

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

export type CreatePostValidationSchemaType = z.infer<
  typeof CreatePostValidationSchema
>;
export type UpdatePostValidationSchemaType = z.infer<
  typeof UpdatePostValidationSchema
>;
