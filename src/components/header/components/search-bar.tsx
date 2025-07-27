"use client";
// The search bar component

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useState, useEffect, useCallback } from "react";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { FaQuora } from "react-icons/fa6";

export default function HeaderSearchBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // run command
  const runCommand = useCallback((command: () => any) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div>
      <Button
        variant="empty"
        onClick={() => setOpen(true)}
        className="group bg-background gap-2 border-0 xl:border border-border hover:border-foreground/40 inline-flex items-center justify-between active:translate-y-px xl:h-10 xl:w-[24rem] xl:max-w-sm xl:rounded-lg xl:py-2 xl:pe-2 xl:ps-3.5 xl:shadow-sm"
      >
        <span className="flex items-center gap-2">
          <HiOutlineSearch className="text-accent-foreground/80 size-5" />
          <span className="hidden text-sm font-normal text-accent-foreground/60 group-hover:text-foreground/70 transition-colors xl:inline-flex">
            Search your pages
          </span>
        </span>
        <span className="ms-auto hidden items-center text-sm text-accent-foreground lg:flex lg:rounded-md lg:bg-primary lg:px-1.5 lg:py-1 lg:text-xs lg:font-semibold lg:text-primary-foreground xl:justify-normal">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="1.3"
            viewBox="0 0 256 256"
            className="h-[15px] w-[15px]"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z"></path>
          </svg>
          K
        </span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search the page ..." />
        <CommandList className="z-99999999 mt-px">
          <CommandEmpty className="flex flex-col items-center scale-75">
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 350 350"
              className="w-72 h-auto"
            >
              <path
                d="M90.26 327.146C82.84 325.571-6.2 311.116.344 204.611 6.89 98.106 15.114 66.046 49.764 54.321c34.65-11.725 118.79-67.165 184.835-14.455 66.045 52.71 137.306 100.03 109.025 184.205-28.28 84.21-32.899 112.28-106.715 107.975-73.78-4.27-111.405 2.73-146.65-4.9Z"
                className="fill-background"
              ></path>
              <path
                d="M269.885 305.445c1.715-1.435 2.695-3.395 2.87-5.46.175-2.065-.42-4.2-1.82-5.88l-61.005-73.36c13.3-12.915 22.225-30.45 24.045-50.33 4.06-44.275-28.63-83.58-72.905-87.64-44.275-4.06-83.58 28.63-87.64 72.905-4.06 44.275 28.63 83.58 72.905 87.64 16.975 1.575 33.25-2.31 47.075-10.15l3.815-2.52 61.32 73.745c2.835 3.43 7.91 3.885 11.34 1.05ZM216.65 168.84c-3.185 34.72-34.02 60.34-68.705 57.155-34.72-3.185-60.34-34.02-57.155-68.705 3.185-34.685 33.985-60.375 68.67-57.19 34.72 3.22 60.375 34.02 57.19 68.74Z"
                className="fill-muted"
              ></path>
              <path
                d="M82.628 124.845c-3.22 6.86-6.125 13.93-8.155 21.21-1.89 6.755-2.485 13.615-2.205 20.615.525 13.16 4.375 26.075 11.06 37.415 13.37 22.715 37.415 37.73 63.7 39.725 16.555 1.26 34.685-2.415 48.65-11.69.7-.455-.98-.315-1.295-.07-12.985 8.575-29.645 12.04-45.01 11.13-13.16-.805-26.04-4.865-37.24-11.83-21.35-13.23-35.665-36.26-37.905-61.32-.665-7.595-.385-15.26 1.505-22.645 2.03-7.875 5.11-15.505 8.575-22.82.14-.315-1.47-.175-1.68.28ZM198.098 232.997c7.945 9.554 15.89 19.074 23.835 28.629l32.865 39.48c.98 1.155 1.925 2.38 2.94 3.535 4.165 4.76 12.005 3.57 15.05-1.855.14-.245-1.435-.14-1.68.28-2.835 5.075-8.68 4.62-12.11.56-1.085-1.295-2.17-2.59-3.255-3.92-4.515-5.46-9.065-10.885-13.58-16.345-11.41-13.72-22.82-27.44-34.265-41.195-2.73-3.29-5.46-6.545-8.19-9.834-.28-.245-1.89.315-1.61.665ZM121.374 109.201c17.57-10.64 39.655-11.83 58.275-3.115 14.84 6.965 26.635 19.705 32.375 35.07 3.325 8.89 4.585 18.445 3.745 27.895-.035.28 1.645.07 1.68-.455 1.54-17.605-4.34-35.245-16.24-48.335-12.075-13.3-29.54-20.895-47.495-20.79-11.865.07-23.52 3.465-33.67 9.625-.665.455 1.015.315 1.33.105Z"
                className="fill-foreground/70"
              ></path>
              <path
                d="M274.187 299.39c1.715-1.435 2.695-3.395 2.87-5.46.175-2.065-.42-4.2-1.82-5.88l-61.005-73.36c13.3-12.915 22.225-30.45 24.045-50.33 4.06-44.275-28.63-83.58-72.905-87.64-44.31-4.06-83.615 28.665-87.675 72.905-4.06 44.275 28.63 83.615 72.905 87.675 16.975 1.575 33.25-2.31 47.075-10.15l3.815-2.52 61.32 73.745c2.835 3.395 7.945 3.85 11.375 1.015Zm-53.27-136.605c-3.185 34.72-34.02 60.34-68.705 57.155-34.685-3.185-60.34-34.02-57.155-68.705 3.185-34.685 34.02-60.34 68.705-57.155 34.685 3.185 60.34 33.985 57.155 68.705Z"
                className="fill-background"
              ></path>
              <path
                d="M274.893 299.601c3.71-3.29 3.955-8.47.84-12.25l-3.045-3.675c-4.62-5.53-9.205-11.095-13.825-16.625-11.795-14.175-23.555-28.315-35.35-42.49-2.835-3.395-5.67-6.825-8.505-10.22-.035.175-.07.385-.07.56 13.16-12.88 21.735-29.995 23.94-48.3 1.925-15.96-.98-32.27-8.33-46.585-7.035-13.685-17.92-25.235-31.15-33.04-13.65-8.05-29.61-11.865-45.43-11.06-15.505.77-30.695 6.125-43.33 15.155-12.565 8.96-22.505 21.49-28.28 35.84-5.985 14.875-7.42 31.5-4.06 47.18 3.255 15.19 10.955 29.295 21.945 40.285 11.025 11.06 25.2 18.795 40.46 22.05 18.76 3.99 38.64 1.225 55.545-7.805 2.03-1.085 3.885-2.345 5.81-3.64h-1.33c7.875 9.45 15.715 18.9 23.59 28.35 11.27 13.545 22.505 27.055 33.775 40.6 1.26 1.505 2.485 3.01 3.745 4.515 3.29 3.92 8.855 4.48 12.915 1.295.91-.7-.49-1.155-1.085-.665-3.605 2.835-7.84 1.575-10.57-1.68-1.155-1.4-2.345-2.8-3.5-4.235a5261.64 5261.64 0 0 1-14.245-17.115c-11.585-13.93-23.205-27.895-34.79-41.825-2.765-3.325-5.53-6.65-8.295-9.94-.315-.385-.98-.21-1.33 0-28.07 18.585-65.975 16.31-92.225-4.48-24.465-19.355-35.63-51.975-28.14-82.285 7.42-29.995 32.41-53.62 62.79-59.255 30.975-5.74 63.035 7.98 80.64 34.02 8.54 12.635 13.37 27.65 13.72 42.875.42 17.71-5.11 35.35-15.645 49.56-2.59 3.465-5.46 6.72-8.54 9.765-.14.14-.21.385-.07.56 7.385 8.89 14.805 17.78 22.19 26.705 11.13 13.37 22.26 26.775 33.39 40.145 1.54 1.82 3.045 3.675 4.585 5.495.28.315.525.63.805.945 2.66 3.395 2.275 7.945-.945 10.815-.77.7.875.91 1.4.455Z"
                className="fill-foreground/70"
              ></path>
              <path
                d="M220.078 162.856c-2.485 25.795-20.965 48.09-46.13 54.74-25.41 6.72-52.815-3.85-67.515-25.515-14.7-21.665-14.245-51.1 1.26-72.205 15.505-21.14 43.295-30.45 68.39-22.75 24.5 7.525 42.315 30.135 44.1 55.65.245 3.36.175 6.755-.105 10.08-.07.805 1.645.56 1.715-.14 2.345-26.67-12.6-52.605-36.995-63.7-24.185-11.025-53.34-5.635-72.135 13.125-19.11 19.04-24.15 49.035-12.11 73.22 11.9 23.905 38.115 38.15 64.68 35.07 26.005-3.045 48.265-22.19 54.81-47.6a65.287 65.287 0 0 0 1.75-10.08c.035-.84-1.68-.595-1.715.105Z"
                className="fill-foreground/70"
              ></path>
              <path
                opacity="0.5"
                d="M202.68 201.698c24.684-24.684 24.684-64.706 0-89.391-24.685-24.685-64.707-24.685-89.392 0-24.685 24.685-24.685 64.707 0 89.391 24.685 24.685 64.707 24.685 89.392 0Z"
                className="fill-background"
              ></path>
              <path
                d="M164.078 93.556c-26.39-2.31-52.29 12.075-63.84 36.015-11.69 24.22-6.51 53.9 12.6 72.765 19.04 18.795 48.65 23.66 72.73 12.075 24.045-11.55 38.85-37.38 36.155-63.98-2.66-26.32-22.225-48.79-47.845-55.23-3.22-.805-6.51-1.33-9.8-1.645-.7-.07-1.785.945-.63 1.05 25.76 2.45 47.88 21.07 54.705 46.06 6.895 25.235-3.08 52.815-24.5 67.83-21.595 15.12-51.1 14.665-72.345-.945-20.93-15.4-30.345-42.875-23.275-67.865 7.035-24.885 29.575-43.4 55.405-45.22 3.325-.245 6.685-.175 10.01.105.7.07 1.75-.91.63-1.015Z"
                className="fill-foreground/70"
              ></path>
              <path
                d="M180.251 173.637c-3.465-4.235-8.75-7.35-13.93-8.925-8.68-2.66-18.27-.945-25.795 3.99-1.75 1.155-3.535 2.45-4.935 4.025-.7.77.945.945 1.4.42 3.325-3.71 8.33-6.3 13.09-7.56 8.575-2.31 17.57-.315 24.605 5.04 1.435 1.085 2.87 2.31 4.025 3.71.42.56 2.03-.07 1.54-.7ZM138.912 148.086c0-1.75-1.4-3.185-3.15-3.185s-3.185 1.4-3.185 3.15 1.4 3.185 3.15 3.185 3.185-1.4 3.185-3.15ZM182.362 148.475a3.15 3.15 0 1 0-6.292-.336 3.15 3.15 0 0 0 6.292.336Z"
                className="fill-foreground/70"
              ></path>
              <path
                d="M124.593 168.52c2.532-.028 4.555-2.792 4.518-6.174-.037-3.383-2.119-6.102-4.651-6.075-2.532.028-4.555 2.792-4.518 6.174.037 3.383 2.119 6.102 4.651 6.075ZM190.356 167.783c2.532-.027 4.554-2.791 4.518-6.174-.037-3.382-2.119-6.102-4.651-6.074-2.532.027-4.555 2.791-4.518 6.174.036 3.382 2.119 6.102 4.651 6.074Z"
                className="fill-red-500"
              ></path>
            </svg>
            No results found.
          </CommandEmpty>
          <CommandGroup>
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <HiOutlineHome className="mr-3 h-4 w-4" />
              Home
            </CommandItem>
          </CommandGroup>
          {/* Blog */}
          <CommandGroup heading="Blog">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/posts"))}
            >
              <HiOutlineNewspaper className="mr-3 h-4 w-4" />
              Blog
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/posts/create?type=post"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Article
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/posts/create?type=event"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Event
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/posts/create?type=destination"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Destination
            </CommandItem>
          </CommandGroup>
          {/* Services */}
          <CommandGroup heading="Services">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/services"))}
            >
              <MdOutlineHomeRepairService className="mr-3 h-4 w-4" />
              Services
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/services/create"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create services
            </CommandItem>
          </CommandGroup>
          {/* Portfolio */}
          <CommandGroup heading="Portfolio">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/portfolio"))}
            >
              <HiOutlineDocumentReport className="mr-3 h-4 w-4" />
              Portfolio
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/portfolio/create"))
              }
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create portfolio
            </CommandItem>
          </CommandGroup>
          {/* FAQ */}
          <CommandGroup heading="FAQ">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/faqs"))}
            >
              <FaQuora className="mr-3 h-4 w-4" />
              FAQ
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/faqs/create"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create FAQ
            </CommandItem>
          </CommandGroup>

          {/* Jobs */}
          {/* <CommandGroup heading="Jobs">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/positions"))}
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Positions
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/jobs/submissions"))
              }
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Submissions
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/department"))}
            >
              <HiOutlineBriefcase className="mr-3 h-4 w-4" />
              Departments
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/jobs/positions"))}
            >
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Create Position
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
