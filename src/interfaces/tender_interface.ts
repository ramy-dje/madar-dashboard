import { FileInterface } from "@/interfaces/file-manager";
import CategoryInterface from "./categories.interface";

export interface TenderInterface {
  id: string;
  title: string;
  features: string[];
  categories: CategoryInterface[];
  media: FileInterface[];
  document: string;
  content: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
