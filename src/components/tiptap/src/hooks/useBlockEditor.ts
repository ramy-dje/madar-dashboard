import { useEditor, useEditorState } from "@tiptap/react";
import type { AnyExtension, Editor, EditorOptions } from "@tiptap/core";
import { ExtensionKit } from "../extensions/extension-kit";
import type { EditorUser } from "../components/BlockEditor/types";
import { initialContent } from "../lib/data/initialContent";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  customContent,
  allowEdit,
  userId,
  userName = "Maxi",
  ...editorOptions
}: {
  customContent: any;
  allowEdit: boolean;
  userId?: string;
  userName?: string;
} & Partial<Omit<EditorOptions, "extensions">>) => {
  const editor = useEditor(
    {
      ...editorOptions,
      editable: allowEdit,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        ctx.editor.commands.setContent(customContent || initialContent);
        ctx.editor.commands.focus("start", { scrollIntoView: true });
      },
      extensions: [...ExtensionKit({})].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    [],
  );

  if (editor && window) {
    window.editor = editor;
  }
  return { editor };
};
