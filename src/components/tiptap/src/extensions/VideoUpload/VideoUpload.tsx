import { Editor, NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";

import { VideoUploader } from "./VideoUploader";

export const ImageUpload = ({ getPos, editor }: { getPos: () => number; editor: Editor }) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        console.log(url);
        editor
          .chain()
          .setVideo({ src: url })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor],
  );

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <VideoUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  );
};

export default ImageUpload;
