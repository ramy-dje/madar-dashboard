import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@mantine/hooks";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { CategoryType } from "@/interfaces/categories.interface";
import { useGetAllTags } from "../api-hooks";
import { TagFormModal } from "./tag-form-modal";

interface Props {
  selectedTags?: { id: string; name: string; color: string }[];
  onSelectTag: (selectedTag: { id: string; name: string }[]) => void;
  placeholder: string;
  name: string;
  sharedWithTags?: any[];
  type: CategoryType;
  isAddButtonVisible?: boolean;
}

export default function TagsComboboxFormItem({
  selectedTags = [],
  onSelectTag,
  name,
  placeholder,
  type,
  isAddButtonVisible = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  //search
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue<typeof search>(search, 500);
  const { data, isLoading, isError, error } = useGetAllTags({ type });

  const tags = useMemo(
    () =>
      debounced && data
        ? data?.data.filter((tag) =>
            tag?.name?.en?.toLowerCase().includes(debounced.toLowerCase())
          )
        : data?.data || [],
    [data, debounced]
  );

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (inputRef.current) {
      // Force blur after component mounts
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
          setOpen(false);
        }
      }, 0);
    }
  }, []);

  return (
    <div className="flex items-center gap-4 w-full">
      <Command
        ref={dropdownRef}
        className={cn("h-auto overflow-visible bg-transparent")}
        shouldFilter={false}
      >
        <div
          className={cn(
            "flex flex-col min-h-10 rounded-md border border-input text-sm",
            {
              "px-3 py-2": selectedTags.length !== 0,
              "cursor-text": selectedTags.length !== 0,
            },
            selectedTags.length !== 0 && "gap-2"
          )}
        >
          <div className="relative flex">
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              ref={inputRef}
              autoFocus={false}
              onFocus={() => {
                setOpen(true);
              }}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground w-full",
                {
                  "px-3 py-2": selectedTags.length === 0,
                  "ml-1": selectedTags.length !== 0,
                }
              )}
              value={search} // Bind input value to search state
              onValueChange={setSearch} // Update search state on input
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => {
                onSelectTag([]);
                setOpen(false);
              }}
              className={cn(
                "absolute right-0 top-0.5 h-4 w-4 p-0",
                selectedTags.length === 0 && "hidden"
              )}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-wrap gap-1">
            {selectedTags.map((tag) => {
              return (
                <Badge
                  key={`selected-tag-${tag.id}`}
                  style={{
                    backgroundColor: `rgb(from ${tag.color} r g b / 0.1)`,
                    borderColor: `rgb(from ${tag.color} r g b / 0.5)`,
                    color: `rgb(from ${tag.color} r g b / 1)`,
                  }}
                  className={cn(
                    "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                    "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                    "gap-1 select-none rounded-full"
                  )}
                >
                  {tag?.name?.en}
                  <button
                    className={cn(
                      "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSelectTag(
                          selectedTags.filter((item) => item.id !== tag.id)
                        );
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() =>
                      onSelectTag(
                        selectedTags.filter((item) => item.id !== tag.id)
                      )
                    }
                  >
                    <X
                      className="h-4 w-4"
                      style={{
                        color: `rgb(from ${tag.color} r g b / 1)`,
                      }}
                    />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="relative">
          {open && (
            <div
              className="absolute top-1 z-[99999] w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <CommandList className="max-h-60">
                {isLoading ? (
                  <CommandGroup>
                    {[...Array(4)].map((_, index) => (
                      <CommandItem
                        className="flex flex-col items-start space-y-2"
                        key={`tag-loading-${index}`}
                      >
                        <Skeleton className="size-4 w-[250px]" />
                        <Skeleton className="size-4 w-[200px]" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : isError ? (
                  <CommandEmpty>
                    Error:{" "}
                    {(error as any)?.response?.data?.message ||
                      "Failed to load tags"}
                  </CommandEmpty>
                ) : (
                  <>
                    <CommandEmpty>No {name} found.</CommandEmpty>
                    <CommandGroup>
                      {Array.isArray(tags) && tags.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={(tagId) => {
                            const selectedTag = selectedTags.find(
                              (tag) => tag.id === tagId
                            );
                            // Check if the selectedTag is already in the array
                            const newValue = selectedTag
                              ? selectedTags.filter((item) => item.id !== tagId) // Remove it if it exists
                              : [
                                  ...selectedTags,
                                  tags.find((tag) => tag.id === tagId)!,
                                ]; // Add it if it doesn't exist

                            // Update the field with the new array value
                            onSelectTag(newValue);
                          }}
                        >
                          <div className="space-y-1">
                            <p>{item?.name?.en}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto size-4 shrink-0",
                              selectedTags.find((tag) => tag.id === item.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </div>
          )}
        </div>
      </Command>
      {isAddButtonVisible && (
        <>
          <Button type="button" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
          <TagFormModal open={formOpen} setOpen={setFormOpen} type={type} />
        </>
      )}
    </div>
  );
}
