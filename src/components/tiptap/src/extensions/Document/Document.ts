import { Document as TiptapDocument } from "@tiptap/extension-document";

export const Document = TiptapDocument.extend({
  content: "(block|columns|grid|charts)+",
});

export default Document;
