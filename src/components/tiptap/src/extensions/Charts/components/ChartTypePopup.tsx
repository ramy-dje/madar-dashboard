import * as Popover from '@radix-ui/react-popover'
import React, { memo } from 'react'
import { Toolbar } from '../../../components/ui/Toolbar'
import { Surface } from '../../../components/ui/Surface'
import prepareChartData from '../../../lib/utils/prepareChartData'
import { useChartStore } from '../../../store/ChartSeries'
import isPieLike from '../../../lib/utils/isPieLike'
import { Icon } from '../../../components/ui/Icon'


function ChartTypePopup({editor,setChartType}:any) {
      const MemoButton = memo(Toolbar.Button)
      const {getSeries} = useChartStore()
      const chartOptions = [
        {
          label: 'Bar',
          value: 'bar',
          icon: <Icon name='ChartColumnBig' className="w-4 h-4" />,
        },
        {
          label: 'Line',
          value: 'line',
          icon: <Icon name='ChartLine' className="w-4 h-4" />,
        },
        {
          label: 'Area',
          value: 'area',
          icon: <Icon name='ChartArea' className="w-4 h-4" />,
        },
        {
          label: 'Heatmap',
          value: 'heatmap',
          icon: <Icon name='Columns3' className="w-4 h-4" />,
        },
        {
          label: 'Scatter',
          value: 'scatter',
          icon: <Icon name='ChartScatter' className="w-4 h-4" />,
        },
      ]
  return (
    <Popover.Root>
    <Popover.Trigger asChild>
      <MemoButton tooltip="Choose chart type">
        <Icon name="ChartSpline" className="w-4 h-4" />
      </MemoButton>
    </Popover.Trigger>
  
    <Popover.Content side="bottom" sideOffset={16} asChild>
      <Surface className="p-3 w-36 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3">
          Chart Styles
        </div>
        <div className="flex flex-col gap-1">
        {chartOptions.map(({ label, value, icon }) => (
          <div
            key={value}
            className="
              flex items-center cursor-pointer gap-2 p-1.5 text-sm font-medium
              text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full rounded
              hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200
            "
            onClick={() => {
              console.log('series', getSeries())
              setChartType(value)
              editor.commands.setOptionsType(value)

              if (isPieLike(value)) {
                editor.commands.setSeries([10, 30, 50, 30])
              } else {
                editor.commands.setSeries([{ name: 'a', data: [10, 30, 50, 30] }])
              }
            }}
          >
            {icon}
            {label}
          </div>
        ))}

        </div>
      </Surface>
    </Popover.Content>
  </Popover.Root>
  
  )
}

export default ChartTypePopup