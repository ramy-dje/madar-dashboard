import { Node, mergeAttributes } from "@tiptap/core";

export const GridElement = Node.create({
  name: "gridelement",
  content: "block+",
  isolating: true,
  addAttributes() {
    return {
      position: {
        default: "",
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "gridelement" }), 0];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="gridelement"]',
      },
    ];
  },
});
