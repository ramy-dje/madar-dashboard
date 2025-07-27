import CategoriesPage from "@/components/categories-page";
import { CategoryType } from "@/interfaces/categories.interface";

export default function ServiceCategoriesPage() {
  return <CategoriesPage type={CategoryType.SERVICE} title="Services" />;
}
