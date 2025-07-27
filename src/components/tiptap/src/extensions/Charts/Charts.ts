'use client'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Node } from '@tiptap/core'

import dynamic from 'next/dynamic'

// Import dynamically without SSR
const ChartsNodeView = dynamic(() => import('./components/ChartsCompoenent'), { ssr: false })

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Charts: {
      setCharts: () => ReturnType,
      setSeriesName : (name:string,index:number) => ReturnType,
      setSeriesData : (data:any,index:number) => ReturnType,
      setOptionsType : (type:string) => ReturnType,
      setOptionsXaxis : (xaxis:any) => ReturnType,
      setSeries : (series:any) => ReturnType, 
      setLabels : (labels:any) => ReturnType,
    }
  }
}

export const Charts = Node.create({
  name: 'charts',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      series:{
        default :[{
          name: 'data',
          data: [10, 20, 10, 60, 20, 30],
        }]
      },
      options : {
        default:{
          chart: {
            type: 'scatter',
            height: 350,
          },
          labels: ['Jan', 'Feb','Jan', 'Feb'],
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          },
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'charts',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['charts', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      setCharts:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
      },
      setSeries:
        (series) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            series: series,
          })
        },
      setSeriesName:
      (name, index = 0) =>
      ({ commands, editor }) => {
        const currentAttrs = editor.getAttributes(this.name);
        const currentSeries = currentAttrs.series || [];

        const updatedSeries = [...currentSeries];
        if (updatedSeries[index]) {
          updatedSeries[index] = {
            ...updatedSeries[index],
            name,
          };
        }
        return commands.updateAttributes(this.name, {
          series: updatedSeries,
        });
      },
      setSeriesData:
      (data, index = 0) =>
      ({ commands, editor }) => {
        const currentAttrs = editor.getAttributes(this.name);
        const currentSeries = currentAttrs.series || [];

        const updatedSeries = [...currentSeries];
        if (updatedSeries[index]) {
          updatedSeries[index] = {
            ...updatedSeries[index],
            data,
          };
        }
        return commands.updateAttributes(this.name, {
          series: updatedSeries,
        });
      },
      setOptionsType:
      (type) =>
      ({ commands, editor }) => {
        const currentAttrs = editor.getAttributes(this.name);
        const currentOptions = currentAttrs.options ;
        const updatedOptions = {
          ...currentOptions,
          chart: {
            ...currentOptions.chart,
            type:type 
          },
        };

        return commands.updateAttributes(this.name, {
          options: updatedOptions,
        });
      },
      setOptionsXaxis:
      (xaxis) =>
      ({ commands, editor }) => {
        const currentAttrs = editor.getAttributes(this.name);
        const currentOptions = currentAttrs.options || {};
        const updatedOptions = {
          ...currentOptions,
          labels:[...xaxis],
          xaxis: {
            categories: [...xaxis],
          },
        };
        return commands.updateAttributes(this.name, {
          options: updatedOptions,
        });
      },

    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartsNodeView as any)
  },
})
