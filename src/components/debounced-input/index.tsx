"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback, useDebouncedValue } from "@mantine/hooks";
import { SearchInput } from "../ui/search-input";

// Debounced inputs with useDebouncedValue hook

export interface DebouncedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onDebouncedValueChange?: <T>(e: T) => void;
}

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  (
    { onDebouncedValueChange, defaultValue, value: ControlledValue, ...props },
    ref
  ) => {
    const [value, setValue] = useState<string>((defaultValue as string) || "");
    const [debounced] = useDebouncedValue<typeof value>(value, 200);

    useEffect(() => {
      if (onDebouncedValueChange)
        onDebouncedValueChange<typeof debounced>(debounced);
    }, [debounced, onDebouncedValueChange]);

    // change the original whenever the controller value get changed
    useEffect(() => {
      setValue(ControlledValue as string);
    }, [ControlledValue]);

    return (
      <Input
        {...props}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={ref}
      />
    );
  }
);

DebouncedInput.displayName = "DebouncedInput";

export const DebouncedSearchInput = forwardRef<
  HTMLInputElement,
  DebouncedInputProps
>(({ onDebouncedValueChange, defaultValue = "", ...props }, ref) => {
  const [value, setValue] = useState<string>(defaultValue as string);
  const [debounced] = useDebouncedValue<typeof value>(value, 500);
  const isInitialMount = useRef(true);
  const isExternalUpdate = useRef(false); // Track if update is from external source

  // Update value when defaultValue changes (including when it becomes undefined/empty)
  useEffect(() => {
    const newDefaultValue = defaultValue as string;

    // Only update if the defaultValue is actually different from current value
    if (newDefaultValue !== value) {
      isExternalUpdate.current = true; // Mark as external update
      setValue(newDefaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  // Only trigger debounced callback for real input changes, not on mount or external updates
  useEffect(() => {
    // Skip the first effect execution (on mount)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if this is an external update (from defaultValue change)
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false; // Reset flag
      return;
    }

    if (onDebouncedValueChange) {
      onDebouncedValueChange<typeof debounced>(debounced);
    }
  }, [debounced, onDebouncedValueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // This is a user input, not an external update
    isExternalUpdate.current = false;
    setValue(newValue);
  };

  return (
    <SearchInput {...props} onChange={handleChange} value={value} ref={ref} />
  );
});

DebouncedSearchInput.displayName = "DebouncedSearchInput";

export interface TableSearchInputRef {
  clear: () => void;
}

export const TableSearchInput = forwardRef<
  TableSearchInputRef,
  {
    placeholder?: string;
    initialValue?: string;
    onChange: (value: string) => void;
  }
>(({ initialValue, placeholder, onChange }, ref) => {
  const [search, setSearch] = useState(initialValue ?? "");

  const handleSearch = useDebouncedCallback((term) => {
    onChange(term);
  }, 300);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearch("");
    },
  }));

  return (
    <SearchInput
      className="w-full hover:border hover:border-primary"
      onChange={(e) => {
        const value = e.target.value;
        setSearch(value);
        handleSearch(value);
      }}
      value={search}
      placeholder={placeholder || "Search by name..."}
    />
  );
});

TableSearchInput.displayName = "TableSearchInput";
