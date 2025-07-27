"use client";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useId } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// import "./editor.css";

// The text editor interface
interface Props {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  modules?: Record<any, any>;
  content: string;
  heading?: boolean;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextEditor({
  className,
  placeholder,
  modules: customModules,
  content,
  disabled,
  heading = false,
  setContent,
}: Props) {
  // editor ref
  const quill = useRef<any>(null);

  // Generate unique ID for each editor instance
  const editorId = useId();
  const toolbarId = `toolbar-${editorId}`;

  // config
  const modules = useMemo(
    () =>
      customModules
        ? customModules
        : {
            toolbar: {
              container: `#${toolbarId}`,
              handlers: {},
            },
            clipboard: {
              matchVisual: true,
            },
          },
    [toolbarId, customModules]
  );

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Toolbar container with unique ID */}
      <div id={toolbarId}>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-font">
            <option value=""></option>
            <option value="serif"></option>
            <option value="monospace"></option>
          </select>
          <select className="ql-align">
            <option value=""></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-clean"></button>
        </span>
        {heading && (
          <span className="ql-formats">
            <select className="ql-header">
              <option value="">Normal</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
            </select>
          </span>
        )}
      </div>

      <ReactQuill
        modules={modules}
        ref={quill}
        theme="snow"
        readOnly={disabled}
        className={cn(
          "w-full h-full",
          disabled && "pointer-events-none cursor-auto opacity-50"
        )}
        placeholder={placeholder}
        value={content}
        onChange={setContent}
      />
    </div>
  );
}
