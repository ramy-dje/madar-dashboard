import { Badge } from "@/components/ui/badge";
import { TbCircleCheckFilled, TbLoader } from "react-icons/tb";

export default function TenderStatus({
  status,
}: {
  status: "published" | "draft";
}) {
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground px-1.5 flex items-center gap-1 w-fit"
    >
      {status === "published" ? (
        <TbCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400" />
      ) : (
        <TbLoader />
      )}
      {status}
    </Badge>
  );
}
