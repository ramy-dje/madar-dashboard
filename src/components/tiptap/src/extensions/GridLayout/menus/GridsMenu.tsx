import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { sticky } from "tippy.js";
import { v4 as uuid } from "uuid";

import { MenuProps } from "../../../components/menus/types";
import { getRenderContainer } from "../../../lib/utils/getRenderContainer";
import { Toolbar } from "../../../components/ui/Toolbar";
import { GridLayout } from "../Grid";
import { Icon } from "../../../components/ui/Icon";
import { ChevronLeft } from "lucide-react";

export const GridMenu = ({ editor, appendTo }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "grid");
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive("grid");
    return isColumns;
  }, [editor]);

  const onColumnTopTwoRowsBottom = useCallback(() => {
    editor.chain().focus().setGridLayout(GridLayout.ColumnTopTwoRowsBottom).run();
  }, [editor]);

  const onColumnRightTwoRowsLeft = useCallback(() => {
    editor.chain().focus().setGridLayout(GridLayout.ColumnRightTwoRowsLeft).run();
  }, [editor]);

  const onColumnBottomTwoRowsTop = useCallback(() => {
    editor.chain().focus().setGridLayout(GridLayout.ColumnBottomTwoRowsTop).run();
  }, [editor]);

  const onColumnLeftTwoRowsRight = useCallback(() => {
    editor.chain().focus().setGridLayout(GridLayout.ColumnLeftTwoRowsRight).run();
  }, [editor]);

  const {
    isColumnBottomTwoRowsTop,
    isColumnLeftTwoRowsRight,
    isColumnRightTwoRowsLeft,
    isColumnTopTwoRowsBottom,
    isGridBorderActive,
  } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isColumnBottomTwoRowsTop: ctx.editor.isActive("grid", {
          layout: GridLayout.ColumnBottomTwoRowsTop,
        }),
        isColumnLeftTwoRowsRight: ctx.editor.isActive("grid", {
          layout: GridLayout.ColumnLeftTwoRowsRight,
        }),
        isColumnRightTwoRowsLeft: ctx.editor.isActive("grid", {
          layout: GridLayout.ColumnRightTwoRowsLeft,
        }),
        isColumnTopTwoRowsBottom: ctx.editor.isActive("grid", {
          layout: GridLayout.ColumnTopTwoRowsBottom,
        }),
        isGridBorderActive: ctx.editor.isActive("grid", { border: true }),
      };
    },
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`gridMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => appendTo?.current,
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <Toolbar.Wrapper>
        <Toolbar.Button
          style={{ transform: "rotate(180deg)" }}
          tooltip="row bottom two column top"
          active={isColumnBottomTwoRowsTop}
          onClick={onColumnBottomTwoRowsTop}
        >
          <Icon name="LayoutPanelTop" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="row top two columns bottom"
          active={isColumnTopTwoRowsBottom}
          onClick={onColumnTopTwoRowsBottom}
        >
          <Icon name="LayoutPanelTop" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="row left two columns right"
          active={isColumnLeftTwoRowsRight}
          onClick={onColumnLeftTwoRowsRight}
        >
          <Icon name="LayoutPanelLeft" />
        </Toolbar.Button>
        <Toolbar.Button
          style={{ transform: "rotate(180deg)" }}
          tooltip="row right two columns left"
          active={isColumnRightTwoRowsLeft}
          onClick={onColumnRightTwoRowsLeft}
        >
          <Icon name="LayoutPanelLeft" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip="toggle grid border"
          active={isGridBorderActive}
          onClick={() =>
            isGridBorderActive
              ? editor.commands.toggleGridBorderOff()
              : editor.commands.toggleGridBorderOn()
          }
        >
          <Icon name="SquareDashed" />
        </Toolbar.Button>
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default GridMenu;
