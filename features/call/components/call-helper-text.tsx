import { cn } from '@/lib/utils'

type CallHelperTextProps = {
  title: string
  options: string[]
  onOptionClick: (option: string) => void
}

export const CallHelperText = ({ title, options, onOptionClick }: CallHelperTextProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-sm text-muted-foreground">{title}</p>

      <ul className="flex flex-wrap gap-2 mt-4">
        {options.map((option, index) => (
          <li
            key={option}
            onClick={() => onOptionClick(option)}
            className={cn(
              'px-2.5 text-xs py-1 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-600 hover:-translate-y-1 transition-transform cursor-pointer',
              index === 0 && 'bg-cyan-50 text-cyan-600 border border-cyan-600',
              index === 1 && 'bg-purple-50 text-purple-600 border border-purple-600',
              index === 2 && 'bg-green-50 text-green-600 border border-green-600',
              index === 3 && 'bg-red-50 text-red-600 border border-red-600'
            )}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  )
}
