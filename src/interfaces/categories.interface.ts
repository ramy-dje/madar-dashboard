export enum CategoryType {
  POST = "post",
  SERVICE = "service",
  FAQ = "faq",
  PORTFOLIO = "portfolio",
  TENDER = "tender",
}
export default interface CategoryInterface {
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
  id: string;
}
