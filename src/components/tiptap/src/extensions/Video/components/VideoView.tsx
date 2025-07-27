import { cn } from "../../../lib/utils";
import { convertToEmbedUrl, isEmbedVideo } from "../../../lib/utils/prepareVideo";
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { useScreenWidth } from "../../../hooks/useScreenWidth";

interface VideoViewProps {
  editor: Editor;
  getPos: () => number;
  node: Node;
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const VideoView = (props: VideoViewProps) => {
  const { editor, getPos, node } = props as VideoViewProps & {
    node: Node & {
      attrs: {
        src: any;
      };
    };
  };
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { src } = node.attrs;

  const wrapperClassName = cn(
    node.attrs.align === "left" ? "ml-0" : "ml-auto",
    node.attrs.align === "right" ? "mr-0" : "mr-auto",
    node.attrs.align === "center" && "mx-auto",
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  const isExternal = isEmbedVideo(src);
  const embedUrl = convertToEmbedUrl(src);
  const screenWidth = useScreenWidth();
  return (
    <NodeViewWrapper>
      <div
        className={wrapperClassName}
        style={{ width: screenWidth > 600 ? node.attrs.width : "100%" }}
        data-drag-handle
      >
        <div contentEditable={false} ref={imageWrapperRef}>
          {isExternal ? (
            <iframe
              className="w-full h-full aspect-video rounded-lg"
              src={embedUrl}
              allowFullScreen
              title="Embedded Video"
              onClick={onClick}
            />
          ) : (
            <video autoPlay controls className="block" src={src} onClick={onClick} />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default VideoView;
