import { CategoryType } from "./categories.interface";

export default interface TagInterface {
  name: {
    fr: string;
    en: string;
    ar: string;
  };
  slug: string;
  description: string;
  parentId: string | null;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
  color: string;
  id: string;
}
