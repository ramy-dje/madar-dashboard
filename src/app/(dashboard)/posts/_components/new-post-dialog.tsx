"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useAccess from "@/hooks/use-access";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";

export function NewPostDialog() {
  const { has } = useAccess();
  const [open, setOpen] = useState(false);
  return has(["post:create"]) ? (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 font-normal w-full md:w-auto dark:bg-gradient-primary-madar dark:font-semibold"
      >
        <HiOutlinePlus className="size-4" /> New Post
      </Button>
      <Dialog open={open} onClose={setOpen} className="relative z-[999]">
        <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm ease-out data-closed:opacity-0" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform space-y-4 p-5 md:p-8 lg:p-12 rounded-lg bg-background text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="grid grid-cols-1 ">
                <DialogTitle as="h3" className="text-2xl font-medium mb-10">
                  Start creating new post
                </DialogTitle>

                <div className="flex flex-col gap-2">
                  {[
                    {
                      title: "Create new article",
                      name: "post",
                      icon: "elements-icon-menu.webp",
                    },
                    {
                      title: "Create event post",
                      name: "event",
                      icon: "whats-new-icon-menu.webp",
                    },
                    {
                      title: "Create destination",
                      name: "destination",
                      icon: "prebuilt-websites-icon-menu.webp",
                    },
                    {
                      title: "Create new podcast",
                      name: "podcast",
                      icon: "studio-icon-menu.webp",
                      comingSoon: true,
                    },
                  ].map((type) => (
                    <Link
                      className={cn(
                        "w-full py-5 px-8 flex items-center justify-between gap-2 rounded-lg border hover:primary hover:border-primary",
                        type.comingSoon && "cursor-not-allowed"
                      )}
                      href={
                        type.comingSoon
                          ? "#"
                          : `/posts/create?type=${type.name}`
                      }
                      key={type.name}
                    >
                      <div className="flex gap-1 flex-col">
                        {type.comingSoon && (
                          <Badge className="text-xs bg-primary/10 text-primary w-fit hover:bg-primary/20">
                            Coming soon
                          </Badge>
                        )}
                        <h3 className="capitalize text-xl font-semibold">
                          Create news {type.name}
                        </h3>
                      </div>
                      <Image
                        width={62}
                        height={62}
                        src={`/icons/${type.icon}`}
                        loading="lazy"
                        className="size-16"
                        alt="Blog Icon"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  ) : null;
}
