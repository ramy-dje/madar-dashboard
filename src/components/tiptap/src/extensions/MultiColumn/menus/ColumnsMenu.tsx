import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import { useCallback } from "react";
import { sticky } from "tippy.js";
import { v4 as uuid } from "uuid";

import { MenuProps } from "../../../components/menus/types";
import { getRenderContainer } from "../../../lib/utils/getRenderContainer";
import { Toolbar } from "../../../components/ui/Toolbar";
import { ColumnLayout } from "../Columns";
import { Icon } from "../../../components/ui/Icon";
import { ChevronLeft } from "lucide-react";

export const ColumnsMenu = ({ editor, appendTo }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "columns");
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive("columns");
    return isColumns;
  }, [editor]);

  const onColumnLeft = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run();
    editor.commands.makeTwoColumn();
  }, [editor]);

  const onColumnRight = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run();
    editor.commands.makeTwoColumn();
  }, [editor]);

  const onColumnTwo = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run();
    editor.commands.makeTwoColumn();
  }, [editor]);

  const onColumnTthree = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.ThreeColumn).run();
    editor.commands.makeThreeColumn();
  }, [editor]);

  const onColumnThreeExpanded = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.ExpandedThreeColumn).run();
    editor.commands.makeThreeColumn();
  }, [editor]);

  const {
    isColumnLeft,
    isColumnRight,
    isColumnTwo,
    isColumnThree,
    isColumnThreeExpanded,
    isColumnBorderActive,
  } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isColumnLeft: ctx.editor.isActive("columns", { layout: ColumnLayout.SidebarLeft }),
        isColumnRight: ctx.editor.isActive("columns", { layout: ColumnLayout.SidebarRight }),
        isColumnTwo: ctx.editor.isActive("columns", { layout: ColumnLayout.TwoColumn }),
        isColumnThree: ctx.editor.isActive("columns", { layout: ColumnLayout.ThreeColumn }),
        isColumnThreeExpanded: ctx.editor.isActive("columns", {
          layout: ColumnLayout.ExpandedThreeColumn,
        }),
        isColumnBorderActive: ctx.editor.isActive("columns", { border: true }),
      };
    },
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${uuid()}`}
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
        <Toolbar.Button tooltip="Sidebar left" active={isColumnLeft} onClick={onColumnLeft}>
          <Icon name="PanelLeft" />
        </Toolbar.Button>
        <Toolbar.Button tooltip="Two columns" active={isColumnTwo} onClick={onColumnTwo}>
          <Icon name="Columns2" />
        </Toolbar.Button>
        <Toolbar.Button tooltip="Sidebar right" active={isColumnRight} onClick={onColumnRight}>
          <Icon name="PanelRight" />
        </Toolbar.Button>
        <Toolbar.Button tooltip="three columns" active={isColumnThree} onClick={onColumnTthree}>
          <Icon name="Columns3" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="expanded three columns"
          active={isColumnThreeExpanded}
          onClick={onColumnThreeExpanded}
        >
          <Icon name="Columns3" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip="toggle column border"
          active={isColumnBorderActive}
          onClick={() =>
            isColumnBorderActive
              ? editor.commands.toggleColumnBorderOff()
              : editor.commands.toggleColumnBorderOn()
          }
        >
          <Icon name="SquareDashed" />
        </Toolbar.Button>
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ColumnsMenu;
