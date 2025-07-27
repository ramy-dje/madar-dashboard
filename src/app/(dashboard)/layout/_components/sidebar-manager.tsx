import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Trash } from "lucide-react";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";



type WidgetType =
  | "file-upload"
  | "html"
  | "text"
  | "button"
  | "share-buttons"
  | "recent-posts"
  | "categories"
  | "tag-cloud"
  | "image"
  | "banner"
  | "icon-box"
  | "form";

type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  content?: string; // For HTML, Text
  buttonText?: string; // For Button, Banner, Icon Box
  buttonLink?: string; // For Button, Banner, Icon Box
  categoryIds?: string[]; // For Categories
  imageUrl?: string; // For Image, Banner
  isVisible: boolean;
  // Banner Widget properties
  overlayColor?: string;
  overlayGradient?: string;
  bannerText?: string;
  bannerIcon?: string; // Placeholder for icon name
  // Icon Box Widget properties
  iconBoxIcon?: string; // Placeholder for icon name
  iconBoxText?: string;
  // Form Widget properties
  formId?: string;
};
const availableForms = [
  { id: "form-1", name: "Contact Us Form" },
  { id: "form-2", name: "Newsletter Signup" },
  { id: "form-3", name: "Feedback Survey" },
];

const availableCategories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Lifestyle" },
  { id: "3", name: "Travel" },
  { id: "4", name: "Food" },
];

function SidebarManager() {
  const { toast } = useToast();
  const [sidebarWidgets, setSidebarWidgets] = React.useState<Widget[]>([
    { id: "1", type: "recent-posts", title: "Recent Posts", isVisible: true },
    {
      id: "2",
      type: "categories",
      title: "Categories",
      categoryIds: ["1", "2"],
      isVisible: true,
    },
    {
      id: "3",
      type: "text",
      title: "About Us",
      content: "A short description about our blog.",
      isVisible: false,
    },
  ]);

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setSidebarWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, ...updates } : widget
      )
    );
  };

  const removeWidget = (id: string) => {
    setSidebarWidgets((prev) => prev.filter((widget) => widget.id !== id));
    toast({
      title: "Widget Removed",
      description: "The widget has been removed.",
    });
  };

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = sidebarWidgets.findIndex((widget) => widget.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sidebarWidgets.length) return;

    const updatedWidgets = [...sidebarWidgets];
    const [movedWidget] = updatedWidgets.splice(index, 1);
    updatedWidgets.splice(newIndex, 0, movedWidget);
    setSidebarWidgets(updatedWidgets);
  };
  const handleImageUpload = (
    widgetId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateWidget(widgetId, { imageUrl: reader.result as string });
        toast({
          title: "Image Uploaded",
          description: "Image uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const renderWidgetConfig = (widget: Widget) => {
    switch (widget.type) {
      case "text":
      case "html":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`content-${widget.id}`}>
              Content ({widget.type === "html" ? "HTML" : "Text"})
            </Label>
            <Textarea
              id={`content-${widget.id}`}
              value={widget.content || ""}
              onChange={(e) =>
                updateWidget(widget.id, { content: e.target.value })
              }
              rows={4}
              placeholder={`Enter ${widget.type} content`}
            />
          </div>
        );
      case "button":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor={`button-text-${widget.id}`}>Button Text</Label>
              <Input
                id={`button-text-${widget.id}`}
                value={widget.buttonText || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonText: e.target.value })
                }
                placeholder="e.g., Learn More"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`button-link-${widget.id}`}>Button Link</Label>
              <Input
                id={`button-link-${widget.id}`}
                value={widget.buttonLink || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonLink: e.target.value })
                }
                placeholder="e.g., /about-us"
              />
            </div>
          </>
        );
      case "image":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`image-upload-${widget.id}`}>Image Upload</Label>
            <Input
              id={`image-upload-${widget.id}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(widget.id, e)}
              className="flex-1"
            />
            {widget.imageUrl && (
              <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md border">
                <img
                  src={widget.imageUrl || "/placeholder.svg"}
                  alt="Widget Preview"
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() =>
                    updateWidget(widget.id, { imageUrl: undefined })
                  }
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            )}
          </div>
        );
      case "banner":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor={`banner-image-${widget.id}`}>
                Background Image
              </Label>
              <Input
                id={`banner-image-${widget.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(widget.id, e)}
              />
              {widget.imageUrl && (
                <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md border">
                  <img
                    src={widget.imageUrl || "/placeholder.svg"}
                    alt="Banner Background"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() =>
                      updateWidget(widget.id, { imageUrl: undefined })
                    }
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-overlay-color-${widget.id}`}>
                Overlay Color (e.g., #00000080)
              </Label>
              <Input
                id={`banner-overlay-color-${widget.id}`}
                value={widget.overlayColor || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { overlayColor: e.target.value })
                }
                placeholder="#00000080"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-overlay-gradient-${widget.id}`}>
                Overlay Gradient (CSS value)
              </Label>
              <Input
                id={`banner-overlay-gradient-${widget.id}`}
                value={widget.overlayGradient || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { overlayGradient: e.target.value })
                }
                placeholder="linear-gradient(to right, #ff0000, #0000ff)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-text-${widget.id}`}>Banner Text</Label>
              <Textarea
                id={`banner-text-${widget.id}`}
                value={widget.bannerText || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { bannerText: e.target.value })
                }
                rows={2}
                placeholder="Enter banner text"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-button-text-${widget.id}`}>
                Button Text
              </Label>
              <Input
                id={`banner-button-text-${widget.id}`}
                value={widget.buttonText || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonText: e.target.value })
                }
                placeholder="e.g., Shop Now"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-button-link-${widget.id}`}>
                Button Link
              </Label>
              <Input
                id={`banner-button-link-${widget.id}`}
                value={widget.buttonLink || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonLink: e.target.value })
                }
                placeholder="e.g., /products"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`banner-icon-${widget.id}`}>
                Icon Name (e.g., Star, Home)
              </Label>
              <Input
                id={`banner-icon-${widget.id}`}
                value={widget.bannerIcon || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { bannerIcon: e.target.value })
                }
                placeholder="e.g., Sparkles"
              />
            </div>
          </>
        );
      case "icon-box":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor={`icon-box-icon-${widget.id}`}>
                Icon Name (e.g., Star, Home)
              </Label>
              <Input
                id={`icon-box-icon-${widget.id}`}
                value={widget.iconBoxIcon || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { iconBoxIcon: e.target.value })
                }
                placeholder="e.g., Star"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`icon-box-text-${widget.id}`}>Text Content</Label>
              <Textarea
                id={`icon-box-text-${widget.id}`}
                value={widget.iconBoxText || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { iconBoxText: e.target.value })
                }
                rows={3}
                placeholder="Enter text for the icon box"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`icon-box-button-text-${widget.id}`}>
                Button Text
              </Label>
              <Input
                id={`icon-box-button-text-${widget.id}`}
                value={widget.buttonText || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonText: e.target.value })
                }
                placeholder="e.g., Read More"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`icon-box-button-link-${widget.id}`}>
                Button Link
              </Label>
              <Input
                id={`icon-box-button-link-${widget.id}`}
                value={widget.buttonLink || ""}
                onChange={(e) =>
                  updateWidget(widget.id, { buttonLink: e.target.value })
                }
                placeholder="e.g., /details"
              />
            </div>
          </>
        );
      case "form":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`form-select-${widget.id}`}>Select Form</Label>
            <Select
              value={widget.formId || ""}
              onValueChange={(value) =>
                updateWidget(widget.id, { formId: value })
              }
            >
              <SelectTrigger id={`form-select-${widget.id}`}>
                <SelectValue placeholder="Select a form" />
              </SelectTrigger>
              <SelectContent>
                {availableForms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "categories":
        return (
          <div className="grid gap-2">
            <Label>Select Categories</Label>
            <div className="grid gap-1">
              {availableCategories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${widget.id}-${category.id}`}
                    checked={widget.categoryIds?.includes(category.id)}
                    onCheckedChange={(checked) => {
                      const currentCategories = widget.categoryIds || [];
                      if (checked) {
                        updateWidget(widget.id, {
                          categoryIds: [...currentCategories, category.id],
                        });
                      } else {
                        updateWidget(widget.id, {
                          categoryIds: currentCategories.filter(
                            (id) => id !== category.id
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`category-${widget.id}-${category.id}`}>
                    {""}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case "file-upload":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`file-upload-${widget.id}`}>
              File Upload (Placeholder)
            </Label>
            <Input id={`file-upload-${widget.id}`} type="file" disabled />
            <p className="text-sm text-muted-foreground">
              This is a placeholder for file upload functionality.
            </p>
          </div>
        );
      case "share-buttons":
        return (
          <p className="text-sm text-muted-foreground">
            Share buttons will automatically be generated (e.g., Facebook,
            Twitter, LinkedIn).
          </p>
        );
      case "recent-posts":
        return (
          <p className="text-sm text-muted-foreground">
            Displays a list of your most recent blog posts.
          </p>
        );
      case "tag-cloud":
        return (
          <p className="text-sm text-muted-foreground">
            Displays a cloud of popular tags.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Manager</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* <AddWidgetModal
            isOpen={isAddWidgetModalOpen}
            onOpenChange={setIsAddWidgetModalOpen}
            onAddWidget={addWidget}
          /> */}

        {sidebarWidgets.length === 0 ? (
          <p className="text-muted-foreground">Add widgets to your sidebar.</p>
        ) : (
          <div className="grid gap-4">
            {sidebarWidgets.map((widget, index) => (
              <Collapsible key={widget.id} className="rounded-md border">
                <div className="flex items-center justify-between p-4">
                  <h4 className="font-semibold">{widget.title}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveWidget(widget.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span className="sr-only">Move Up</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveWidget(widget.id, "down")}
                      disabled={index === sidebarWidgets.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                      <span className="sr-only">Move Down</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove Widget</span>
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Toggle settings</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="border-t p-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`widget-title-${widget.id}`}>
                        Widget Title
                      </Label>
                      <Input
                        id={`widget-title-${widget.id}`}
                        value={widget.title}
                        onChange={(e) =>
                          updateWidget(widget.id, { title: e.target.value })
                        }
                      />
                    </div>
                    {renderWidgetConfig(widget)}
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`widget-visible-${widget.id}`}
                        checked={widget.isVisible}
                        onCheckedChange={(checked) =>
                          updateWidget(widget.id, { isVisible: checked })
                        }
                      />
                      <Label htmlFor={`widget-visible-${widget.id}`}>
                        Visible
                      </Label>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SidebarManager;
