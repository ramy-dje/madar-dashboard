import { BubbleMenu as BaseBubbleMenu, useEditorState } from '@tiptap/react'
import { useCallback } from 'react'
import { sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

import { MenuProps } from '../../../components/menus/types'
import { getRenderContainer } from '../../../lib/utils/getRenderContainer'
import { Toolbar } from '../../../components/ui/Toolbar'
import { Icon } from '../../../components/ui/Icon'
import { ChevronLeft } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Surface } from '../../../components/ui/Surface'
import { ColorPicker } from '../../../components/panels'
import ChartDataPopUp from './ChartDataPopUp'
import ChartCategoriesPopUp from './ChartCategoriesPopUp'
import ChartTypePopup from './ChartTypePopup'


export const GridMenu = ({ editor, appendTo }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'node-charts')
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)
    
    return rect
  }, [editor])

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive('charts')
    return isColumns
  }, [editor])

  const [chartType, setChartType] = useState('')

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`gridMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => appendTo?.current,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <Surface className="flex gap-1 p-2 ">
    {/* Choose Chart Popup */}
   
      <ChartTypePopup editor={editor} setChartType={setChartType}/>
    {/* Show Data Popup */}
    <ChartDataPopUp editor={editor} chartType={chartType}/>

    {/* Labels with Popups */}
    <ChartCategoriesPopUp editor={editor} chartType={chartType}/>
    </Surface>
    </BaseBubbleMenu>
  )
}

export default GridMenu
