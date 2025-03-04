import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          error && "border-destructive ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && <span className="mt-1 text-sm text-destructive">{error}</span>}
    </div>
  )
}

export { Input }
