import React from "react";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function ErrorAlert({
  error,
  title,
  defaultMessage,
}: {
  error?: any;
  title?: string;
  defaultMessage?: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || "Error"}</AlertTitle>
      <AlertDescription>
        {error?.response?.data?.message ||
          defaultMessage ||
          "An unexpected error occurred. Please try again."}
      </AlertDescription>
    </Alert>
  );
}
