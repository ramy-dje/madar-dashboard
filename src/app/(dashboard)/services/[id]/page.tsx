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
import {
  Calendar,
  CheckCircle,
  Clock,
  Code,
  ImageIcon,
  Play,
} from "lucide-react";
import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetService } from "@/app/(dashboard)/services/service_hooks";
import ServiceStatus from "@/app/(dashboard)/services/_components/service-status";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AVAILABLE_LANGUAGES,
  LanguageCode,
} from "@/components/form-sections/title-content-multi-lang.section";
import { Button } from "@/components/ui/button";

export default function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [currentLang, setCurrenLang] = useState<LanguageCode>("en");
  const { data, isLoading, isError, error } = useGetService({ serviceId: id });

  if (!id) {
    router.replace("/services");
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
              Service details
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
                    <Link href="/services">Services</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>Service details</BreadcrumbItem>
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
            defaultMessage="Failed to fetch service details. Please try again."
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

              <div className="flex items-center gap-6 text-accent-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(data.createdAt, "PPP")}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated {formatDate(data.updatedAt, "PPP")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Media Gallery */}
                {data.media && data.media.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold  mb-4">
                      Service Gallery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.media.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-video relative group cursor-pointer">
                            <img
                              src={
                                item.presignedUrl ||
                                "/placeholder.svg?height=300&width=400"
                              }
                              alt={item.alt || `Service media ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                <Play className="h-12 w-12 text-white" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <Badge
                                variant="secondary"
                                className="bg-black/70 text-white"
                              >
                                {item.type === "video" ? (
                                  <Play className="h-3 w-3 mr-1" />
                                ) : (
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                )}
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Service Details */}
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: data.content[currentLang],
                        }}
                      />
                      <footer className="border-t pt-8 mt-5">
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
                        </div>
                        {/* Available Languages */}
                        <div className="mb-6">
                          <p className="text-sm text-accent-foreground mb-2">
                            Available in:
                          </p>
                          <div className="flex gap-2">
                            {Object.keys(data.title).map((lang) => (
                              <Button
                                key={lang}
                                variant={
                                  currentLang === lang ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setCurrenLang(lang as LanguageCode)
                                }
                              >
                                {
                                  AVAILABLE_LANGUAGES.find(
                                    (availableLang) =>
                                      availableLang.code === lang
                                  )?.name
                                }
                              </Button>
                            ))}
                          </div>
                        </div>
                      </footer>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Features */}
                {data.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
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

                {/* Service Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Service Information
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
                      <ServiceStatus status={data.status} />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Information */}
                {data.seo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">SEO Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-xs font-medium ">
                          Meta Title:
                        </span>
                        <p className="text-xs text-accent-foreground mt-1">
                          {data.seo.metaTitle || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium ">
                          Meta Description:
                        </span>
                        <p className="text-xs text-accent-foreground mt-1">
                          {data.seo.metaDescription || "-"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </PageLayout>
    </>
  );
}
