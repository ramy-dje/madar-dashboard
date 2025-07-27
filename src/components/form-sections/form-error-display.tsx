"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FormError {
  field: string;
  message: string;
  fieldLabel?: string;
}

interface QuickAction {
  label: string;
  action: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

interface FormErrorDisplayProps {
  errors: FormError[];
  title?: string;
  showQuickActions?: boolean;
  quickActions?: QuickAction[];
  onFieldClick?: (field: string) => void;
  className?: string;
  variant?: "default" | "destructive" | "warning";
  collapsible?: boolean;
  maxHeight?: string;
}

export default function FormErrorDisplay({
  errors,
  title = "Please fix the following errors:",
  showQuickActions = false,
  quickActions = [],
  onFieldClick,
  className = "",
  variant = "destructive",
  collapsible = false,
  maxHeight = "300px",
}: FormErrorDisplayProps) {
  if (errors.length === 0) return null;

  const variantStyles = {
    default: {
      container: "bg-gray-50 border-gray-200",
      title: "text-gray-800",
      text: "text-gray-700",
      divider: "border-gray-200",
    },
    destructive: {
      container: "bg-red-50 border-red-200",
      title: "text-red-800",
      text: "text-red-700",
      divider: "border-red-200",
    },
    warning: {
      container: "bg-orange-50 border-orange-200",
      title: "text-orange-800",
      text: "text-orange-700",
      divider: "border-orange-200",
    },
  };

  const styles = variantStyles[variant];

  const scrollToField = (field: string) => {
    const element =
      document.getElementById(field) ||
      document.querySelector(`[name="${field}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
    onFieldClick?.(field);
  };

  const groupedErrors = errors.reduce((acc, error) => {
    const category = error.field.split(".")[0]; // Group by main field (e.g., 'title', 'content')
    if (!acc[category]) acc[category] = [];
    acc[category].push(error);
    return acc;
  }, {} as Record<string, FormError[]>);

  return (
    <div className={`p-4 border rounded-md ${styles.container} ${className}`}>
      <h4
        className={`text-sm font-medium mb-2 flex items-center gap-1 ${styles.title}`}
      >
        <AlertTriangle className="h-4 w-4" />
        {title}
        <Badge variant="secondary" className="ml-auto">
          {errors.length} {errors.length === 1 ? "error" : "errors"}
        </Badge>
      </h4>

      <div
        className={`space-y-2 ${collapsible ? "overflow-y-auto" : ""}`}
        style={collapsible ? { maxHeight } : {}}
      >
        {/* Grouped error display */}
        {Object.entries(groupedErrors).map(([category, categoryErrors]) => (
          <div key={category} className="space-y-1">
            {categoryErrors.length > 1 && (
              <h5
                className={`text-xs font-medium uppercase tracking-wide ${styles.title} opacity-75`}
              >
                {category}
              </h5>
            )}
            <ul className={`text-sm space-y-1 ${styles.text}`}>
              {categoryErrors.map((error, index) => (
                <li
                  key={`${error.field}-${index}`}
                  className="flex items-start gap-2"
                >
                  <span className="text-xs mt-0.5">•</span>
                  <div className="flex-1">
                    <button
                      type="button"
                      className="text-left hover:underline focus:underline focus:outline-none"
                      onClick={() => scrollToField(error.field)}
                    >
                      <span className="font-medium">
                        {error.fieldLabel || error.field}:
                      </span>{" "}
                      {error.message}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <div className={`mt-3 pt-3 border-t ${styles.divider}`}>
          <p className={`text-sm mb-2 ${styles.title}`}>Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                type="button"
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.action}
                className={
                  variant === "destructive"
                    ? "text-destructive border-destructive/30 hover:bg-destructive/10"
                    : ""
                }
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to convert react-hook-form errors to FormError format
export function convertRHFErrors(
  errors: any,
  fieldLabels: Record<string, string> = {},
  getLanguageName?: (code: string) => string
): FormError[] {
  const formErrors: FormError[] = [];

  const processErrors = (errorObj: any, prefix = "") => {
    Object.entries(errorObj).forEach(([key, value]: [string, any]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;

      if (value?.message) {
        // Direct error message
        let fieldLabel = fieldLabels[fieldPath] || fieldPath;

        // Handle language-specific fields
        if (prefix && getLanguageName) {
          const langCode = key;
          const fieldType = prefix;
          const langName = getLanguageName(langCode);
          fieldLabel = `${langName} ${fieldType}`;
        }

        // Handle array field errors (e.g., features.0.key -> "Feature 1 Key")
        if (fieldPath.includes(".")) {
          const parts = fieldPath.split(".");
          if (parts.length >= 3 && /^\d+$/.test(parts[1])) {
            // This is an array field like "features.0.key"
            const arrayName = parts[0];
            const index = Number.parseInt(parts[1]);
            const fieldName = parts[2];

            // Capitalize and format the field names
            const formattedArrayName =
              arrayName.charAt(0).toUpperCase() + arrayName.slice(1);
            const formattedFieldName =
              fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

            fieldLabel = `${formattedArrayName} ${
              index + 1
            } ${formattedFieldName}`;
          }
        }

        formErrors.push({
          field: fieldPath,
          message: value.message,
          fieldLabel,
        });
      } else if (typeof value === "object" && value !== null) {
        // Nested errors
        processErrors(value, fieldPath);
      }
    });
  };

  processErrors(errors);
  return formErrors;
}
