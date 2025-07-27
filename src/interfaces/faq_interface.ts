import CategoryInterface from "./categories.interface";

export interface FAQInterface {
  id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  categories: CategoryInterface[];
  qaPairs: QAPairInterface[];
}

export interface QAPairInterface {
  question: string;
  answer: string;
  _id: string;
}
