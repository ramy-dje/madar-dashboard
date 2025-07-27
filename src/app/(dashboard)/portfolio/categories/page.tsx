import CategoriesPage from "@/components/categories-page";
import { CategoryType } from "@/interfaces/categories.interface";

export default function PortfolioCategoriesPage() {
  return <CategoriesPage type={CategoryType.PORTFOLIO} title="Portfolio" />;
}
