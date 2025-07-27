import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import FaqComponent from "./FAQComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    faq: {
      setFAQ: () => ReturnType;
    };
  }
}

export const FaqNode = Node.create({
  name: "faq",
  group: "block",
  defining: true,
  atom: true,
  addAttributes() {
    return {
      faqs: {
        default: [{ question: "", answer: "", isOpen: false }],
        parseHTML: (element) => {
          const raw = element.getAttribute("data-faqs");
          try {
            return raw ? JSON.parse(raw) : [];
          } catch {
            return [];
          }
        },
        renderHTML: (attributes) => {
          return {
            "data-faqs": JSON.stringify(attributes.faqs),
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="faq"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "faq", ...HTMLAttributes }, 0];
  },

  addCommands() {
    return {
      setFAQ:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FaqComponent);
  },
});
