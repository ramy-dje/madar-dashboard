export const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "center",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "👋 Hello & Welcome!",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "This is a powerful text editor built with ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://hello.com/",
                target: "_blank",
              },
            },
          ],
          text: "Madar CMS",
        },
        {
          type: "text",
          text: ". You can easily create, format, and customize your content.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Here’s what you can do:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Format text (bold, italic, underline, etc.)" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Add headings, lists, and blockquotes" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Embed images and code blocks" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Use a real-time collaborative editor" }],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "center",
      },
      content: [
        {
          type: "text",
          text: "🚀 Start typing and explore the features!",
        },
      ],
    },
  ],
};
