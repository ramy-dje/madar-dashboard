'use client'

import React, { useEffect, useRef } from 'react'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import type ApexCharts from 'apexcharts'
import { useChartStore } from '../../../store/ChartSeries'

interface ChartsNodeViewProps {
  node: {
    attrs: {
      series: any
      options: any
    }
  }
}

const ChartsNodeView: React.FC<ChartsNodeViewProps> = ({ node }:any) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ApexCharts | null>(null)

  const { series: chartSeries, options: chartOptions} = node.attrs 
  console.log('series', chartSeries)
  console.log('options', chartOptions)
  const { setSeries } = useChartStore()

  // 1) Mount once
  useEffect(() => {
    if (!chartRef.current) return

    let alive = true

    import('apexcharts')
      .then((mod) => {
        if (!alive || !chartRef.current) return
        const ApexCharts = mod.default

        chartInstance.current = new ApexCharts(chartRef.current, {
          ...chartOptions,
          series: chartSeries,
        })
        setSeries(chartSeries)

        return chartInstance.current
          .render()
          .catch((err) => console.error('ApexCharts render error:', err))
      })
      .catch((err) => console.error('Failed to load ApexCharts:', err))

    return () => {
      alive = false
      chartInstance.current?.destroy()
    }
  }, [])

  // 2) Update only options
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateOptions(chartOptions, false, true)
    }
  }, [chartOptions])

  // 3) Update only series
  useEffect(() => {
    if (chartInstance.current) {
      setSeries(chartSeries)
      chartInstance.current.updateSeries(chartSeries, true)
    }
  }, [chartSeries])

  return (
    <NodeViewWrapper className="node-charts">
      <div
        ref={chartRef}
      />
    </NodeViewWrapper>
  )
}

export default ChartsNodeView
