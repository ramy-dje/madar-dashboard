import * as z from "zod";

export const QAPairValidationSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const FaqValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categories: z.array(z.object({ id: z.string(), name: z.string() })),
  qaPairs: z.array(QAPairValidationSchema).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type FaqSchemaType = z.infer<typeof FaqValidationSchema>;
export type QAPairSchemaType = z.infer<typeof QAPairValidationSchema>;
