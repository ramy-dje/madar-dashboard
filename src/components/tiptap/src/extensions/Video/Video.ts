import { ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, Range } from "@tiptap/core";

import { VideoView } from "./components/VideoView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Video: {
      setVideo: (attributes: { src: string }) => ReturnType;
      setVideoAt: (attributes: { src: string; pos: number | Range }) => ReturnType;
      setVideoAlign: (align: "left" | "center" | "right") => ReturnType;
      setVideoWidth: (width: number) => ReturnType;
    };
  }
}

export const Video = Node.create({
  name: "video",

  group: "block",

  defining: true,

  isolating: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: "video", attrs: { src: attrs.src } });
        },

      setVideoAt:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContentAt(attrs.pos, { type: "video", attrs: { src: attrs.src } });
        },

      setVideoAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes("video", { align }),

      setVideoWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes("video", { width: `${Math.max(0, Math.min(100, width))}%` }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});

export default Video;
