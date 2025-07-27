import CategoriesPage from "@/components/categories-page";
import { CategoryType } from "@/interfaces/categories.interface";

export default function PostCategoriesPage() {
  return <CategoriesPage type={CategoryType.POST} title="Posts" />;
}
