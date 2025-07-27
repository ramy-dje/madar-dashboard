"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import React, { use, useState } from "react";
import { useGetPost } from "../api-hooks";
import ErrorAlert from "@/components/error-alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { formatDate } from "date-fns";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AVAILABLE_LANGUAGES,
  LanguageCode,
} from "@/components/form-sections/title-content-multi-lang.section";

export default function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetPost({ postId: id });

  const [currentLang, setCurrenLang] = useState<LanguageCode>("en");
  if (!id) {
    router.replace("/posts");
    return null;
  }
  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Blog details
            </PageLayoutHeaderNameAndBreadcrumbsTitle>
            {/* breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/posts">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>Blog details</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>
        </PageLayoutHeader>

        {isLoading ? (
          <div className="w-full flex justify-center">
            <Skeleton className="w-full flex flex-col gap-8 h-[30em] lg:h-[45em] p-2 lg:p-4 rounded-3xl shadow-sm" />
          </div>
        ) : isError ? (
          <ErrorAlert
            error={error}
            defaultMessage="Failed to fetch post details. Please try again."
          />
        ) : data ? (
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <article>
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name.en}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  {data.title[currentLang]}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4 text-accent-foreground">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(data.createdAt, "PPP")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {data.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-lg">
                <Image
                  src={
                    data.media[0]?.presignedUrl || "/36304133_8271520(2).jpg"
                  }
                  width={800}
                  height={450}
                  alt={data.media[0]?.alt || data.title.en}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.content[currentLang],
                  }}
                />
              </div>

              {/* Article Footer */}
              <footer className="border-t pt-8">
                {/* Author Info */}
                {/* <div className="flex items-start gap-4 mb-8">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={data.author.avatar || "/placeholder.svg"}
                      alt={data.author.name}
                    />
                    <AvatarFallback>
                      {data.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg >
                      {data.author.name}
                    </h3>
                    <p className="text-accent-foreground mb-2">{data.author.bio}</p>
                  </div>
                </div> */}

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-accent-foreground mb-6">
                  <div>
                    Published on {formatDate(data.createdAt, "PPP")}
                    {data.updatedAt !== data.createdAt && (
                      <span>
                        {" "}
                        • Updated on {formatDate(data.updatedAt, "PPP")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {data.views.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {data.tags.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-accent-foreground mb-2">Tags:</p>
                    <div className="flex gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={`tag-${tag.name}`}
                          style={{
                            backgroundColor: `rgb(from ${tag.color} r g b / 0.1)`,
                            borderColor: `rgb(from ${tag.color} r g b / 0.5)`,
                            color: `rgb(from ${tag.color} r g b / 1)`,
                          }}
                          className="w-max flex items-center px-3 py-0.5 gap-2 text-xs rounded-full border font-medium"
                        >
                          {""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Available Languages */}
                <div className="mb-6">
                  <p className="text-sm text-accent-foreground mb-2">
                    Available in:
                  </p>
                  <div className="flex gap-2">
                    {Object.keys(data.title).map((lang) => (
                      <Button
                        key={lang}
                        variant={currentLang === lang ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrenLang(lang as LanguageCode)}
                      >
                        {
                          AVAILABLE_LANGUAGES.find(
                            (availableLang) => availableLang.code === lang
                          )?.name
                        }
                      </Button>
                    ))}
                  </div>
                </div>
              </footer>
            </article>
          </div>
        ) : null}
      </PageLayout>
    </>
  );
}
