'use client'
import { memo, useEffect, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Plus, Save } from 'lucide-react'
import { Toolbar } from '../../../components/ui/Toolbar'
import { Surface } from '../../../components/ui/Surface'
import isPieLike from '../../../lib/utils/isPieLike'
import prepareChartData from '../../../lib/utils/prepareChartData'
import { Icon } from '../../../components/ui/Icon'

function ChartDataPopUp({ editor, chartType }: any) {
  const MemoButton = memo(Toolbar.Button)

  const [rows, setRows] = useState([{ index: 0, name: '', values: [''] }])
  const nextIndex = useRef(1)

  const justAddedInput = useRef(false)
  const focusRowIndex = useRef<number | null>(null)
  const focusOnRemoveRef = useRef<{ rowIndex: number; inputIndex: number } | null>(null)

  const handleAddInput = (rowIndex: number) => {
    justAddedInput.current = true
    focusRowIndex.current = rowIndex

    setRows((prevRows) => {
      const updated = [...prevRows]
      const updatedRow = { ...updated[rowIndex] }
      updatedRow.values = [...updatedRow.values, '']
      updated[rowIndex] = updatedRow
      return updated
    })
  }

  const handleChange = (rowIndex: number, inputIndex: number, value: string) => {
    setRows((prevRows) => {
      const updated = [...prevRows]
      updated[rowIndex].values[inputIndex] = value
      return updated
    })
  }

  const handleNameChange = (rowIndex: number, value: string) => {
    setRows((prevRows) => {
      const updated = [...prevRows]
      updated[rowIndex].name = value
      return updated
    })
  }

  const handleRemoveInput = (rowIndex: number, inputIndex: number) => {
    const nextFocusIndex = inputIndex > 0 ? inputIndex - 1 : 0
    focusOnRemoveRef.current = { rowIndex, inputIndex: nextFocusIndex }

    setRows((prevRows) => {
      const updated = [...prevRows]
      updated[rowIndex].values.splice(inputIndex, 1)
      return updated
    })
  }

  const handleAddRow = () => {
    if (rows.length < 3) {
      justAddedInput.current = true
      focusRowIndex.current = rows.length
      setRows((prevRows) => [
        ...prevRows,
        { index: nextIndex.current++, name: '', values: [''] },
      ])
    }
  }
  const handleRemoveRow = (rowIndex: number) => {
    setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex))
  }
  
  const handleSave = (chartType: string) => {
    const preparedData = prepareChartData(chartType, rows)
    editor.commands.setSeries(preparedData)
  }

  useEffect(() => {
    if (justAddedInput.current && focusRowIndex.current !== null) {
      const rowIndex = focusRowIndex.current
      const lastInputElement = document.querySelector(
        `#input-${rowIndex}-${rows[rowIndex].values.length - 1}`
      ) as HTMLInputElement

      if (lastInputElement) {
        lastInputElement.focus()
      }
      justAddedInput.current = false
    } else if (focusOnRemoveRef.current !== null) {
      const { rowIndex, inputIndex } = focusOnRemoveRef.current
      const inputToFocus = document.querySelector(
        `#input-${rowIndex}-${inputIndex}`
      ) as HTMLInputElement

      if (inputToFocus) {
        inputToFocus.focus()
      }
      focusOnRemoveRef.current = null
    }
  }, [rows])

  function getType(): string {
    if (!editor) return 'bar'

    try {
      const attributes = editor.getAttributes('charts')
      const chartType = attributes?.options?.chart?.type

      if (typeof chartType === 'string' && chartType.trim() !== '') {
        return chartType.toLowerCase()
      }

      console.warn('Chart type not found in attributes, defaulting to "bar"')
      return 'bar'
    } catch (error) {
      console.error('Error retrieving chart type:', error)
      return 'bar'
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <MemoButton tooltip="Insert data rows ">
          <Icon name="Pencil" className="w-4 h-4" />
        </MemoButton>
      </Popover.Trigger>
      <Popover.Content side="bottom" sideOffset={16} asChild>
        <Surface className="p-2 w-80 max-h-[75vh] overflow-auto">
          <div className="flex flex-col gap-4">
            {rows.map((row, rowIndex) => (
              <div key={row.index} className="text-sm font-medium flex flex-wrap gap-2">
                {!isPieLike(chartType) && (
                  <div className='flex items-center justify-between w-full'>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleNameChange(rowIndex, e.target.value)}
                    placeholder="Data name"
                    className="w-full h-8 border-none outline-hidden text-gray-500"
                  />
                    <button
                      onClick={() => handleRemoveRow(rowIndex)}
                      className=""
                      title="Delete row"
                    >
                      <Icon name="Eraser" className="w-4 h-4 text-gray-500 cursor-pointer" />
                    </button>
                  </div>
                )}

                {!(isPieLike(chartType) && rowIndex > 0) &&
                  row.values.map((val, valIndex) => (
                    <input
                      type='number'
                      id={`input-${rowIndex}-${valIndex}`}
                      key={`${row.index}-${valIndex}`}
                      value={val}
                      onChange={(e) =>
                        handleChange(rowIndex, valIndex, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddInput(rowIndex)
                        } else if (e.key === 'Backspace' && val === '') {
                          e.preventDefault()
                          handleRemoveInput(rowIndex, valIndex)
                        }
                      }}
                      className="w-14 h-8 border border-gray-400 rounded-sm text-center"
                    />
                  ))}

                {!(isPieLike(chartType) && rowIndex > 0) && (
                  <button
                    onClick={() => handleAddInput(rowIndex)}
                    className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {!isPieLike(chartType) && (
              <button
                onClick={handleAddRow}
                className="h-8 border border-dashed border-gray-400 rounded-md text-sm hover:bg-gray-50"
              >
                + Add New Row
              </button>
            )}

            <button
              onClick={() => handleSave(chartType)}
              className="w-full h-9 border border-gray-400 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </Surface>
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChartDataPopUp
