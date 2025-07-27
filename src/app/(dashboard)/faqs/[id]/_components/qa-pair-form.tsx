import React from "react";
import {
  QAPairSchemaType,
  QAPairValidationSchema,
} from "../../(CRUD)/_components/faq-validation.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdClose, MdSave } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function QApairForm({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: {
  initialValues?: QAPairSchemaType;
  isLoading: boolean;
  onSubmit: (data: QAPairSchemaType) => void;
  onCancel: () => void;
}) {
  const defaultValues = { question: "", answer: "" };
  const methods = useForm<QAPairSchemaType>({
    resolver: zodResolver(QAPairValidationSchema),
    defaultValues: initialValues || defaultValues,
  });
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            key={`edit-question`}
            control={methods.control}
            name={`question`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter question"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            key={`edit-answer`}
            control={methods.control}
            name={`answer`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter answer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" disabled={isLoading} type="submit">
              <MdSave className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onCancel();
                methods.reset(defaultValues);
              }}
              disabled={isLoading}
            >
              <MdClose className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
