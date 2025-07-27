"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { LinkMenu } from "../menus";
import { useBlockEditor } from "../../hooks/useBlockEditor";
import ImageBlockMenu from "../../extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "../../extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "../../extensions/Table/menus";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import VideoMenu from "../../extensions/Video/components/VideoMenu";
import "../../styles/index.css";
import { BlockEditorSettings } from "./types";
import { GridMenu } from "../../extensions/GridLayout/menus";
import ChartsMenu from "../../extensions/Charts/components/ChartsMenu";

export const BlockEditor = ({ customContent, allowEdit = false, onChange }: BlockEditorSettings & { onChange?: (content: any) => void }) => {
  const [isEditable, setIsEditable] = useState(true);
  const menuContainerRef = useRef(null);

  const { editor } = useBlockEditor({
    customContent,
    allowEdit,
    onTransaction({ editor: currentEditor }) {
      setIsEditable(currentEditor.isEditable);
    },
    onUpdate({ editor }) {
      const json = JSON.stringify(editor.getJSON());
      onChange?.(json); // This will push content back to form
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} isEditable={isEditable} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <VideoMenu editor={editor} appendTo={menuContainerRef} />
        <GridMenu editor={editor} appendTo={menuContainerRef} />
        <ChartsMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
