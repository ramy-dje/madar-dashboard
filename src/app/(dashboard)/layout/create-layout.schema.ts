import { z } from "zod";

export enum LayoutType {
  GRID = "grid",
  LIST = "list",
  CUSTOM = "custom",
}

export enum DisplayStyle {
  CARD = "card",
  FULL_WIDTH = "full-width",
}

export enum NavigationStyle {
  TABS = "tabs",
  SIDEBAR = "sidebar",
}

export const LayoutConfigSchema = z.object({
    name: z.string(),
  
    description: z.string().optional(),
  
    contentTypes: z.array(
      z.object({
        contentType: z.string(),
  
        layout: z.object({
          layoutType: z.nativeEnum(LayoutType),
  
          displayStyle: z.nativeEnum(DisplayStyle).optional(),
  
          navigationStyle: z.nativeEnum(NavigationStyle).optional(),
  
          sidebar: z
            .object({
              widgets: z.array(
                z.object({
                  id: z.string(),
                  type: z.string(), // No specific enum for WidgetType in your original Mongoose code
                  title: z.string(),
                  order: z.number().default(0),
                  active: z.boolean().default(true),
                  settings: z.record(z.any()).default({}),
                })
              ),
              position: z.enum(['left', 'right']),
              width: z.string().optional(),
              sticky: z.boolean().default(false).optional(),
              showOnMobile: z.boolean().default(true).optional(),
            })
            .optional(),
  
          customCSS: z.string().optional(),
          customJS: z.string().optional(),
        }),
  
        isActive: z.boolean().default(true),
      })
    ),
  
    isDefault: z.boolean().default(false),
    isActive: z.boolean().default(true),
  
    author: z.string(), // ObjectId as string
  });

export type CreateLayoutValidationSchemaType = z.infer<
  typeof LayoutConfigSchema
>;
