"use client";
import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { HiOutlineCalendar } from "react-icons/hi";
import { useIsMobile } from "@/hooks/use-mobile";

// Props for form-controlled version
type FormControlledProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  className?: string;
  rangeIsRequired?: boolean;
  placeholder?: string;
  mode?: "range" | "single";
  disabled?: any;
};

// Props for controlled version
type ControlledProps = {
  value: DateRange | Date | undefined;
  onChange: (value: DateRange | Date | undefined) => void;
  className?: string;
  rangeIsRequired?: boolean;
  placeholder?: string;
  mode?: "range" | "single";
  disabled?: any;
};

// Split the component into two versions to handle both cases without conditional hooks
function FormControlledDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  className,
  rangeIsRequired = false,
  placeholder = "Pick a date",
  mode = "range",
  disabled,
}: FormControlledProps<TFieldValues>) {
  const { field } = useController({ name, control });
  const [date, setDate] = React.useState<DateRange | Date | undefined>(
    field.value
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Handle date change
  const handleChange = (selected: DateRange | Date | undefined) => {
    field.onChange(selected);
  };

  // Update local state when external value changes
  React.useEffect(() => {
    setDate(field.value);
  }, [field.value]);

  return (
    <DatePickerUI
      date={date}
      setDate={setDate}
      isCalendarOpen={isCalendarOpen}
      setIsCalendarOpen={setIsCalendarOpen}
      handleChange={handleChange}
      rangeIsRequired={rangeIsRequired}
      placeholder={placeholder}
      className={className}
      mode={mode}
      disabled={disabled}
    />
  );
}

function ControlledDatePicker({
  value,
  onChange,
  className,
  rangeIsRequired = false,
  placeholder = "Pick a date",
  mode = "range",
  disabled,
}: ControlledProps) {
  const [date, setDate] = React.useState<DateRange | Date | undefined>(value);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Handle date change
  const handleChange = (selected: DateRange | Date | undefined) => {
    onChange(selected);
  };

  // Update local state when external value changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <DatePickerUI
      date={date}
      setDate={setDate}
      isCalendarOpen={isCalendarOpen}
      setIsCalendarOpen={setIsCalendarOpen}
      handleChange={handleChange}
      rangeIsRequired={rangeIsRequired}
      placeholder={placeholder}
      className={className}
      mode={mode}
      disabled={disabled}
    />
  );
}

// UI component shared by both versions
function DatePickerUI({
  date,
  setDate,
  isCalendarOpen,
  setIsCalendarOpen,
  handleChange,
  rangeIsRequired,
  placeholder,
  className,
  mode = "range",
  disabled,
}: {
  date: DateRange | Date | undefined;
  setDate: (date: DateRange | Date | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  handleChange: (date: DateRange | Date | undefined) => void;
  rangeIsRequired: boolean;
  placeholder: string;
  className?: string;
  mode?: "range" | "single";
  disabled?: any;
}) {
  const isMobile = useIsMobile();
  // Helper to get display text
  const getDisplay = () => {
    if (mode === "range") {
      const range = date as DateRange | undefined;
      if (range?.from) {
        if (range.to) {
          return (
            <>
              {format(range.from, "LLL dd, y")} -{" "}
              {format(range.to, "LLL dd, y")}
            </>
          );
        }
        return format(range.from, "LLL dd, y");
      }
      return <span>{placeholder}</span>;
    } else {
      if (date instanceof Date) {
        return format(date, "LLL dd, y");
      }
      return <span>{placeholder}</span>;
    }
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isCalendarOpen}
        onOpenChange={(open) => {
          setIsCalendarOpen(open);
          if (mode === "range") {
            const range = date as DateRange | undefined;
            if (!rangeIsRequired) {
              handleChange(range);
              return;
            }
            if (range?.from && range?.to) {
              handleChange(range);
              return;
            }
            setDate(undefined);
            handleChange(undefined);
          } else {
            if (date instanceof Date) {
              handleChange(date);
              return;
            }
            setDate(undefined);
            handleChange(undefined);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"filter"}
            className={cn(
              "w-full justify-start gap-2 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <HiOutlineCalendar className="size-4" />
            {getDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto z-99999 p-0" align="end">
          {mode === "range" ? (
            <Calendar
              autoFocus
              mode="range"
              defaultMonth={(date as DateRange)?.from}
              selected={date as DateRange | undefined}
              onSelect={setDate as (value: DateRange | undefined) => void}
              numberOfMonths={isMobile ? 1 : 2}
              required={rangeIsRequired}
              disabled={disabled}
            />
          ) : (
            <Calendar
              autoFocus
              mode="single"
              defaultMonth={date as Date | undefined}
              selected={date as Date | undefined}
              onSelect={setDate as (value: Date | undefined) => void}
              required={rangeIsRequired}
              disabled={disabled}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Union type for the component props
type DatePickerWithRangeProps<TFieldValues extends FieldValues> =
  | (FormControlledProps<TFieldValues> & { mode?: "range" | "single" })
  | (ControlledProps & { mode?: "range" | "single" });

// Type guard functions
function isFormControlled<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
): props is FormControlledProps<TFieldValues> {
  return (
    "control" in props && !!props.control && "name" in props && !!props.name
  );
}

function isControlled<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
): props is ControlledProps {
  return "value" in props && "onChange" in props;
}

// Main component that decides which implementation to use
export function DatePickerWithRange<TFieldValues extends FieldValues>(
  props: DatePickerWithRangeProps<TFieldValues>
) {
  // Use type guards to determine which version to render
  if (isFormControlled(props)) {
    return <FormControlledDatePicker {...props} />;
  } else if (isControlled(props)) {
    return <ControlledDatePicker {...props} />;
  }

  throw new Error(
    "DatePickerWithRange requires either (control + name) or (value + onChange) props"
  );
}
