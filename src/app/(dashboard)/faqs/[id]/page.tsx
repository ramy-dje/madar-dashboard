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
import { Calendar, Clock, MessageCircle, Plus } from "lucide-react";
import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useCreateQAPairs,
  useDeleteQAPairs,
  useGetFAQ,
  useUpdateQAPairs,
} from "../faq_hooks";
import FaqStatus from "../_components/faq-status";
import { QAPairInterface } from "@/interfaces/faq_interface";
import { Button } from "@/components/ui/button";
import DeleteConfirmPopup from "@/components/delete-confirm-popup";

import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { QAPairSchemaType } from "../(CRUD)/_components/faq-validation.schema";
import QApairForm from "./_components/qa-pair-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast } = useToast();
  const { id } = use(params);
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const createMutation = useCreateQAPairs();
  const updateMutation = useUpdateQAPairs();
  const deleteMutation = useDeleteQAPairs();
  const { data, isLoading, isError, error } = useGetFAQ({ faqId: id });

  if (!id) {
    router.replace("/faqs");
    return null;
  }

  const handleEdit = (qaPair: QAPairInterface) => {
    setSelectedItemId(qaPair._id);
  };

  const handleSaveEdit = async (values: QAPairSchemaType) => {
    if (!selectedItemId) return;
    try {
      await updateMutation.mutateAsync({
        faqId: data!.id,
        data: { _id: selectedItemId, ...values },
      });

      handleCancelEdit();

      toast({
        title: "QA updated",
        description: "QA has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update QA",
        description:
          (error as any).response?.data?.message ??
          "There was an error updating QA. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setSelectedItemId(null);
  };

  const handleDelete = async () => {
    if (!selectedItemId) return;
    try {
      await deleteMutation.mutateAsync({
        faqId: data!.id,
        qaPairId: selectedItemId,
      });
      setSelectedItemId(null);
      setDeleteOpen(false);

      toast({
        title: "QA deleted",
        description: "QA has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete QA",
        description:
          (error as any).response?.data?.message ??
          "There was an error deleting QA. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (values: QAPairSchemaType) => {
    try {
      await createMutation.mutateAsync({
        faqId: data!.id,
        data: values,
      });

      setIsCreateDialogOpen(false);

      toast({
        title: "QA created",
        description: "QA has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Failed to create QA",
        description:
          (error as any).response?.data?.message ??
          "There was an error creating QA. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              FAQ details
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
                    <Link href="/faqs">FAQ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <span className="size-1 block rounded-full bg-muted-foreground/50" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>FAQ details</BreadcrumbItem>
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
                    {""}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold  mb-4">{data.title}</h1>

              <div className="flex items-center gap-6 text-accent-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(data.createdAt, "PPP")}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated {formatDate(data.updatedAt, "PPP")}
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {data.qaPairs.length} questions
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* FAQ Details */}
                <section>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Questions and answers</CardTitle>
                        <Dialog
                          open={isCreateDialogOpen}
                          onOpenChange={setIsCreateDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add New Question</DialogTitle>
                              <DialogDescription>
                                Create a new question and answer pair for this
                                FAQ section.
                              </DialogDescription>
                            </DialogHeader>
                            <QApairForm
                              isLoading={createMutation.isPending}
                              onSubmit={handleCreate}
                              onCancel={() => setIsCreateDialogOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Questions and Answers */}
                      <div className="space-y-6">
                        {data.qaPairs.length === 0 ? (
                          <Card className="border-dashed border-2 border-muted-foreground">
                            <CardContent className="p-12 text-center">
                              <MessageCircle className="h-12 w-12 text-accent-foreground mx-auto mb-4" />
                              <h3 className="text-lg font-medium mb-2">
                                No questions yet
                              </h3>
                              <p className="text-accent-foreground mb-6">
                                Get started by adding your first question and
                                answer.
                              </p>
                              <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Question
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          data.qaPairs.map((qaPair, index) => (
                            <Card key={qaPair._id} className="overflow-hidden">
                              <CardHeader className="bg-muted border-b">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 dark:bg-blue-200 dark:text-blue-700 rounded-full text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-accent-foreground">
                                        Question {index + 1}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(qaPair)}
                                    >
                                      <HiOutlinePencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedItemId(qaPair._id);
                                        setDeleteOpen(true);
                                      }}
                                    >
                                      <HiOutlineTrash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="p-6">
                                {selectedItemId === qaPair._id ? (
                                  <QApairForm
                                    isLoading={updateMutation.isPending}
                                    initialValues={qaPair}
                                    onSubmit={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                  />
                                ) : (
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2 flex items-start gap-2">
                                        <span>Q:</span>
                                        {qaPair.question}
                                      </h3>
                                    </div>
                                    <div>
                                      <div className="flex items-start gap-2">
                                        <span className="font-semibold">
                                          A:
                                        </span>
                                        <p className="leading-relaxed">
                                          {qaPair.answer}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
              <DeleteConfirmPopup
                title="Delete Question"
                description="Are you sure you want to delete this
                                            question? This action cannot be
                                            undone."
                open={isDeleteOpen}
                setOpen={setDeleteOpen}
                handleDelete={() => {
                  handleDelete();
                }}
                isLoading={deleteMutation.isPending}
              />

              {/* Sidebar */}
              <div className="space-y-6">
                {/* FAQ Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      FAQ Information
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
                      <FaqStatus status={data.status} />
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
