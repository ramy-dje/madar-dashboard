import { memo, useEffect, useRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Plus, Save } from 'lucide-react'
import { Toolbar } from '../../../components/ui/Toolbar'
import { Surface } from '../../../components/ui/Surface'
import isPieLike from '../../../lib/utils/isPieLike'
import { Icon } from '../../../components/ui/Icon'

function ChartCategoriesPopUp({editor,chartType}:any) {
    const lastInputRef = useRef<HTMLInputElement | null>(null)
    const MemoButton = memo(Toolbar.Button)
    const [inputs, setInputs] = useState<string[]>([''])

  const handleAddInput = () => {
    setInputs((data)=>[...data, ''])
  }

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
  }

  const handleSave = () => {
    if (inputs.length > 0){

        editor.commands.setOptionsXaxis(inputs)   
      
    }
  }
  useEffect(() => {
    // Focus the last input on render
    if (lastInputRef.current) {
      lastInputRef.current.focus()
    }
  }, [inputs.length])


  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <MemoButton tooltip="insert Categories">
          <Icon name="Tags" className="w-4 h-4" />
        </MemoButton>
      </Popover.Trigger>
      <Popover.Content side="bottom" sideOffset={16} asChild>
        <Surface className="p-2 w-80">
          <div className="text-sm font-medium mb-2 flex flex-wrap gap-2">
            {inputs.map((val, index) => (
              <input
                ref={index === inputs.length - 1 ? lastInputRef : null}
                key={index}
                type="text"
                value={val}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddInput()
                    } else if (e.key === 'Backspace' && inputs[index] === '') {
                      e.preventDefault()
                      const newInputs = [...inputs]
                      newInputs.splice(index, 1)
                      setInputs(newInputs)
                    }
                  }}
                className="w-14 h-8 border border-gray-400 rounded-sm text-center"
              />
            ))}
            <button
              onClick={handleAddInput}
              className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-9 border border-gray-400 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </Surface>
      </Popover.Content>
    </Popover.Root>
  )
}
export default ChartCategoriesPopUp