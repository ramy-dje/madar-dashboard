import { Node, ReactNodeViewRenderer } from "@tiptap/react";
import ImageUpload from "./VideoUpload";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoUpload: {
      setVideoUpload: () => ReturnType;
    };
  }
}

export const VideoUpload = Node.create({
  name: "videoUpload",

  isolating: true,

  defining: true,

  group: "block",

  draggable: true,

  selectable: true,

  inline: false,

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-type": this.name }];
  },

  addCommands() {
    return {
      setVideoUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUpload);
  },
});

export default VideoUpload;
