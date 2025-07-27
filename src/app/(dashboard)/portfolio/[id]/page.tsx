"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import React, { use, useState } from "react";
import ErrorAlert from "@/components/error-alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { formatDate } from "date-fns";
import { useGetPortfolio } from "@/app/(dashboard)/portfolio/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PortfolioStatus from "../_components/portfolio-status";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  const { data, isLoading, isError, error } = useGetPortfolio({
    portfolioId: id,
  });
  const [currentLang, setCurrenLang] = useState<LanguageCode>("en");

  if (!id) {
    router.replace("/portfolio");
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
              Portfolio details
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
                    <Link href="/portfolio">Portfolio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>Portfolio details</BreadcrumbItem>
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
            defaultMessage="Failed to fetch portfolio details. Please try again."
          />
        ) : data ? (
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {data.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name.en}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold  mb-4">
                {data.title[currentLang]}
              </h1>
              <p className="text-xl text-accent-foreground mb-6">
                {data.summary[currentLang]}
              </p>

              <div className="flex items-center gap-6 text-accent-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(data.createdAt, "PPP")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Media Gallery */}
                {data.media.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Project Gallery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.media.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-video bg-gray-200 relative cursor-pointer">
                            <img
                              src={
                                item.presignedUrl ||
                                "/placeholder.svg?height=300&width=400"
                              }
                              alt={item.alt || `Project media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Project Details */}
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: data.content[currentLang],
                        }}
                      />
                    </CardContent>
                  </Card>
                </section>
                <footer className="border-t pt-8">
                  {/* Tags */}
                  {data.tags?.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-accent-foreground mb-2">
                        Tags:
                      </p>
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Features */}
                {data.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Project Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {data.features.map((feature, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-sm">
                              {feature.key}
                            </span>
                          </div>
                          <span className="text-sm text-accent-foreground ml-6">
                            {feature.value}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Project Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium ">Created</span>
                      <span className="text-sm text-accent-foreground">
                        {formatDate(data.createdAt, "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium ">Last Updated</span>
                      <span className="text-sm text-accent-foreground">
                        {formatDate(data.updatedAt, "PPP")}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium ">Status</span>
                      <PortfolioStatus status={data.status} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : null}
      </PageLayout>
    </>
  );
}
