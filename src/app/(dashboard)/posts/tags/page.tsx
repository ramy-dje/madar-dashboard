import TagsPage from "@/components/tags-page";
import { CategoryType } from "@/interfaces/categories.interface";

export default function PostTagsPage() {
  return <TagsPage type={CategoryType.POST} title="Posts" />;
}
