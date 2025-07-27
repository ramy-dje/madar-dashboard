import { Node, mergeAttributes } from "@tiptap/core";

export enum GridLayout {
  ColumnLeftTwoRowsRight = "column-left-two-rows-right",
  ColumnRightTwoRowsLeft = "column-right-two-rows-left",
  ColumnTopTwoRowsBottom = "column-top-two-rows-bottom",
  ColumnBottomTwoRowsTop = "column-bottom-two-rows-top",
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Grid: {
      setGrid: () => ReturnType;
      setGridLayout: (layout: GridLayout) => ReturnType;
      toggleGridBorderOn: () => ReturnType;
      toggleGridBorderOff: () => ReturnType;
    };
  }
}

export const Grid = Node.create({
  name: "grid",

  content: "gridelement+", // Children of grid are grid elements

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: GridLayout.ColumnBottomTwoRowsTop,
      },
      border: {
        default: true,
      },
    };
  },

  addCommands() {
    return {
      setGrid:
        () =>
        ({ commands }: any) =>
          commands.insertContent(
            `<div data-type="grid"><div data-type="gridelement"><p></p></div><div data-type="gridelement"><p></p></div><div data-type="gridelement"><p></p></div></div>`,
          ),
      setGridLayout:
        (layout: GridLayout) =>
        ({ commands }: any) => {
          commands.updateAttributes(this.name, { layout });
          return true;
        },
      toggleGridBorderOn:
        () =>
        ({ editor }: any) => {
          const { state, commands } = editor;
          const node = state.selection.$from.node(-1);
          const hasBorder = node.attrs.border;
          return commands.updateAttributes("grid", { border: true });
        },
      toggleGridBorderOff:
        () =>
        ({ editor }: any) => {
          const { state, commands } = editor;
          const node = state.selection.$from.node(-1);
          const hasBorder = node.attrs.border;
          console.log("hasBorder", hasBorder);
          return commands.updateAttributes("grid", { border: false });
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": this.name,
        class: `${HTMLAttributes.layout} ${HTMLAttributes.border && "with-border"}`,
      },
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type=${this.name}]`,
      },
    ];
  },
});
