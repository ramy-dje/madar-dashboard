import { LanguageCode } from "@/components/form-sections/title-content-multi-lang.section";
import CategoryInterface from "./categories.interface";
import { FileInterface } from "./file-manager";
import TagInterface from "./tag.interface";

// the post interface
export interface PostInterface {
  type: "post" | "event" | "destination";
  title: Title;
  content: Title;
  media: FileInterface[];
  categories: CategoryInterface[];
  tags: TagInterface[];
  showComments: boolean;
  readabilityEnabled: boolean;
  views: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  id: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export type Title = Record<LanguageCode, string>;
// the create post interface
export interface CreatePostInterface {
  title: Record<string, string>;
  categories: string[];
  content: Record<string, string>;
  image: string;
  gallery: string[];
  showOrHideComments: boolean;
  Readability: boolean;
  author: string;
  readTime: number;
  tags: string[];
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
}

export interface PostFilters {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  tagIds?: string;
  type?: "post" | "event" | "destination";
}

// Base interface for common properties
interface BaseContent {
  title: Record<string, string>;
  content: Record<string, string>;
  heroImage?: string;
  image?: string;
  media: string[];
  showComments: boolean;
  status: "draft" | "published" | "archived";
  categories: string[];
  tags: string[];
}

// Blog-specific content
interface BlogContent extends BaseContent {
  type: "post";
  readabilityEnabled: boolean;
}

// Event-specific content
interface EventContent extends BaseContent {
  type: "event";
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  location?: string;
}

// Destination-specific content
interface DestinationContent extends BaseContent {
  type: "destination";
  readabilityEnabled: boolean;
}

// Union type for all content types
export type PostContentFormData =
  | BlogContent
  | EventContent
  | DestinationContent;

export interface LanguageField {
  id: string;
  code: LanguageCode;
  name: string;
}
