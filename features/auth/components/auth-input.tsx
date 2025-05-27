import { Input, InputProps } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type AuthInputProps = InputProps & {
  roundedFrom?: 'top' | 'bottom' | 'none'
}

export default function AuthInput({ roundedFrom = 'none', name, className, ...props }: AuthInputProps) {
  return (
    <div>
      <Label htmlFor={props.id} className="sr-only">
        {name}
      </Label>
      <Input {...props} id={name} name={name} className={cn('focus-visible:border-primary focus-visible:ring-offset-0 focus-visible:ring-0', roundedFrom === 'top' && 'rounded-t-xl rounded-b-none border-b-0', roundedFrom === 'bottom' && 'rounded-b-md rounded-t-none', className)} />
    </div>
  )
}
