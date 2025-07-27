import TagsPage from "@/components/tags-page";
import { CategoryType } from "@/interfaces/categories.interface";

export default function PortfolioTagsPage() {
  return <TagsPage type={CategoryType.PORTFOLIO} title="Portfolio" />;
}
