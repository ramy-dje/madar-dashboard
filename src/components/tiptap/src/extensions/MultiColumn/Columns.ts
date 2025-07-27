import { Node } from "@tiptap/core";

export enum ColumnLayout {
  SidebarLeft = "sidebar-left",
  SidebarRight = "sidebar-right",
  TwoColumn = "two-column",
  ThreeColumn = "three-column",
  ExpandedThreeColumn = "expanded-three-column",
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      setLayout: (layout: ColumnLayout) => ReturnType;
      makeThreeColumn: () => ReturnType;
      makeTwoColumn: () => ReturnType;
      toggleColumnBorderOn: () => ReturnType;
      toggleColumnBorderOff: () => ReturnType;
    };
  }
}

export const Columns = Node.create({
  name: "columns",

  group: "columns",

  content: "column+",

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.TwoColumn,
      },
      border: {
        default: true,
      },
    };
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }) =>
          commands.insertContent(
            `<div data-type="columns"><div data-type="column" data-position="left"><p></p></div><div data-type="column" data-position="right"><p></p></div></div>`,
          ),
      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes("columns", { layout }),
      toggleColumnBorderOn:
        () =>
        ({ editor }: any) => {
          const { state, commands } = editor;
          const node = state.selection.$from.node(-1);
          const hasBorder = node.attrs.border;
          return commands.updateAttributes("columns", { border: true });
        },
      toggleColumnBorderOff:
        () =>
        ({ editor }: any) => {
          const { state, commands } = editor;
          const node = state.selection.$from.node(-1);
          const hasBorder = node.attrs.border;
          console.log("hasBorder", hasBorder);
          return commands.updateAttributes("columns", { border: false });
        },
      makeThreeColumn:
        () =>
        ({ editor }: any) => {
          const { state, chain } = editor;
          const transaction = state.tr;
          const columnsNode = state.selection.$from.node();
          const depth = state.selection.$from.depth;
          const parentNode = state.selection.$from.node(depth - 2);
          console.log(parentNode.type.name);
          console.log(parentNode.childCount);
          if (parentNode.childCount >= 3) {
            return false;
          }
          editor.commands
            .insertContentAt(state.selection.from, {
              type: "column",
              content: [{ type: "paragraph" }],
            })
            .run();
          return true;
        },
      makeTwoColumn:
        () =>
        ({ editor }: any) => {
          const { state, chain } = editor;
          const columnsNode = state.selection.$from.node();
          const depth = state.selection.$from.depth;
          const parentNode = state.selection.$from.node(depth - 2);
          if (parentNode.childCount == 2) {
            return false;
          }
          const columnToRemove = parentNode.child(parentNode.childCount - 1);
          if (!columnToRemove) {
            return false;
          }
          editor.commands.deleteNode(columnToRemove.type.name);
          return true;
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "columns",
        class: `layout-${HTMLAttributes.layout} ${HTMLAttributes.border && "with-border"}`,
      },
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },
});

export default Columns;
