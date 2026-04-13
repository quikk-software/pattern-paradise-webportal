import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 
          "rounded-full bg-gradient-to-br from-[#F08833] to-primary text-primary-foreground shadow-clay-button hover:-translate-y-1 hover:shadow-[15px_15px_30px_rgba(180,74,5,0.4),-8px_-8px_18px_rgba(255,252,246,0.6)] active:scale-[0.94] active:shadow-clay-pressed",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-clay-button hover:-translate-y-1 active:scale-[0.94]",
        outline:
          "rounded-full border border-secondary text-secondary hover:bg-secondary/10 hover:-translate-y-0.5 active:scale-[0.97]",
        secondary:
          "rounded-full bg-card text-foreground shadow-clay-card hover:-translate-y-1 hover:shadow-clay-card-hover active:scale-[0.94]",
        ghost: 
          "rounded-full hover:bg-muted hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-2",
        sm: "h-10 px-4",
        lg: "h-16 px-10 text-base",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
