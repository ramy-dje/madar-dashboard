"use client"

import * as React from "react"
import {

  LayoutTemplate,
  LayoutPanelLeftIcon as LayoutSidebarLeft,
  LayoutPanelLeftIcon as LayoutSidebarRight,
  Grid3X3,
  List,
  Columns,
  Infinity,
  ChevronRight,
  FileText,

} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"
import { LayoutGrid } from "lucide-react"
import SidebarManager from "./_components/sidebar-manager"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLayoutValidationSchemaType } from "./create-layout.schema";

type LayoutOption = "full-width" | "left-sidebar" | "right-sidebar"
type ArchiveDisplayType = "grid" | "list" | "masonry"
type ArchiveNavigationType = "pagination" | "infinite-scroll"


const layoutOptions = [
  { value: "full-width", label: "Full Width", icon: LayoutTemplate },
  { value: "left-sidebar", label: "Left Sidebar", icon: LayoutSidebarLeft },
  { value: "right-sidebar", label: "Right Sidebar", icon: LayoutSidebarRight },
]

const archiveDisplayOptions = [
  { value: "grid", label: "Grid", icon: Grid3X3 },
  { value: "list", label: "List", icon: List },
  { value: "masonry", label: "Masonry", icon: Columns },
]

const archiveNavigationOptions = [
  { value: "pagination", label: "Pagination", icon: ChevronRight },
  { value: "infinite-scroll", label: "Infinite Scroll", icon: Infinity },
]

export default function BlogSettingsPage() {
  const [singlePostLayout, setSinglePostLayout] = React.useState<LayoutOption>("full-width")
  const [archivePageLayout, setArchivePageLayout] = React.useState<LayoutOption>("full-width")
  const [archiveDisplayType, setArchiveDisplayType] = React.useState<ArchiveDisplayType>("grid")
  const [archiveNavigationType, setArchiveNavigationType] = React.useState<ArchiveNavigationType>("pagination")
  const [blogCategoryLayout, setBlogCategoryLayout] = React.useState<LayoutOption>("full-width")
  const [blogCategoryDisplayType, setBlogCategoryDisplayType] = React.useState<ArchiveDisplayType>("grid")
  
 /* const methods = useForm<CreateLayoutValidationSchemaType>({
    resolver: zodResolver(CreateLayoutValidationSchema),
    defaultValues: {
      media_facebook_account: [],
      media_instagram_account: [],
      media_youtube_account: [],
      media_linkedin_account: [],
      media_other_account: [],
      media_website_account: [],
      phone_number_mobile: [],
      phone_number_fax: [],
      phone_number_viber: [],
      phone_number_whatsapp: [],
      phone_number_direct_line: [],
      industry: "",
      category: "",
      resource: "",
      emails: [],
    },
  });
*/





  return (
    <div className="grid gap-6 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Blog Layout Configurator</CardTitle>
          <p className="text-muted-foreground">Customize how your blog pages are displayed to your visitors</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Single Blog Post Layout */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Single Blog Post Layout
              </h3>
              <p className="text-sm text-muted-foreground">Choose how individual blog posts are displayed</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {layoutOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md",
                    singlePostLayout === option.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setSinglePostLayout(option.value as LayoutOption)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div
                      className={cn(
                        "rounded-full p-3",
                        singlePostLayout === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.value === "full-width" && "Content spans the full width"}
                        {option.value === "left-sidebar" && "Sidebar on the left side"}
                        {option.value === "right-sidebar" && "Sidebar on the right side"}
                      </p>
                    </div>
                  </div>
                  {singlePostLayout === option.value && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
                      <svg className="h-4 w-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Archive Page Layout */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                Archive Page Layout
              </h3>
              <p className="text-sm text-muted-foreground">Layout for blog archive and search result pages</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {layoutOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md",
                    archivePageLayout === option.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setArchivePageLayout(option.value as LayoutOption)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div
                      className={cn(
                        "rounded-full p-3",
                        archivePageLayout === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.value === "full-width" && "Content spans the full width"}
                        {option.value === "left-sidebar" && "Sidebar on the left side"}
                        {option.value === "right-sidebar" && "Sidebar on the right side"}
                      </p>
                    </div>
                  </div>
                  {archivePageLayout === option.value && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
                      <svg className="h-4 w-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Archive Display & Navigation */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                  Archive Display Style
                </h3>
                <p className="text-sm text-muted-foreground">How posts are arranged on archive pages</p>
              </div>
              <div className="space-y-3">
                {archiveDisplayOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm",
                      archiveDisplayType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                    onClick={() => setArchiveDisplayType(option.value as ArchiveDisplayType)}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2",
                        archiveDisplayType === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-xs text-muted-foreground">
                        {option.value === "grid" && "Posts arranged in a grid layout"}
                        {option.value === "list" && "Posts displayed in a vertical list"}
                        {option.value === "masonry" && "Pinterest-style masonry layout"}
                      </p>
                    </div>
                    {archiveDisplayType === option.value && (
                      <div className="rounded-full bg-primary p-1">
                        <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-primary" />
                  Navigation Style
                </h3>
                <p className="text-sm text-muted-foreground">How users navigate through multiple pages</p>
              </div>
              <div className="space-y-3">
                {archiveNavigationOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm",
                      archiveNavigationType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                    onClick={() => setArchiveNavigationType(option.value as ArchiveNavigationType)}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2",
                        archiveNavigationType === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-xs text-muted-foreground">
                        {option.value === "pagination" && "Traditional page numbers"}
                        {option.value === "infinite-scroll" && "Load more posts automatically"}
                      </p>
                    </div>
                    {archiveNavigationType === option.value && (
                      <div className="rounded-full bg-primary p-1">
                        <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Blog Category Layout */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                Blog Category Layout
              </h3>
              <p className="text-sm text-muted-foreground">Layout for category-specific blog pages</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {layoutOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-md",
                    blogCategoryLayout === option.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setBlogCategoryLayout(option.value as LayoutOption)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div
                      className={cn(
                        "rounded-full p-3",
                        blogCategoryLayout === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{option.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.value === "full-width" && "Content spans the full width"}
                        {option.value === "left-sidebar" && "Sidebar on the left side"}
                        {option.value === "right-sidebar" && "Sidebar on the right side"}
                      </p>
                    </div>
                  </div>
                  {blogCategoryLayout === option.value && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
                      <svg className="h-4 w-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Category Display Style */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Columns className="h-5 w-5 text-primary" />
                Category Display Style
              </h3>
              <p className="text-sm text-muted-foreground">How posts are arranged on category pages</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {archiveDisplayOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm",
                    blogCategoryDisplayType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setBlogCategoryDisplayType(option.value as ArchiveDisplayType)}
                >
                  <div
                    className={cn(
                      "rounded-full p-2",
                      blogCategoryDisplayType === option.value ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <option.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{option.label}</h4>
                  </div>
                  {blogCategoryDisplayType === option.value && (
                    <div className="rounded-full bg-primary p-1">
                      <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <SidebarManager />
    

    </div>
  )
}
