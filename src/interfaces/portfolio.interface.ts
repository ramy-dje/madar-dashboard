import CategoryInterface from "@/interfaces/categories.interface";
import { FileInterface } from "@/interfaces/file-manager";
import TagInterface from "./tag.interface";
import { Title } from "./post.interface";

export interface PortfolioInterface {
  title: Title;
  categories: CategoryInterface[];
  tags: TagInterface[];
  media: FileInterface[];
  summary: Title;
  content: Title;
  seo: {
    _id: string;
    metaTitle: string;
    metaDescription: string;
  };
  status: "published" | "draft";
  features: { key: string; value: string }[];
  createdAt: string;
  updatedAt: string;
  id: string;
}
