import { FileInterface } from "@/interfaces/file-manager";
import CategoryInterface from "./categories.interface";
import { Title } from "./post.interface";
export interface ServiceFilters {
  page?: number;
  size?: number;
  search?: string;
}
export interface ServiceInterface {
  id: string;
  title: Title;
  features: { key: string; value: string }[];
  categories: CategoryInterface[];
  media: FileInterface[];
  document: string;
  content: Title;
  seo: {
    _id: string;
    metaTitle: string;
    metaDescription: string;
  };
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
