import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:shadow-neumorphic-pressed",
  {
    variants: {
      variant: {
        default: "bg-gradient-neumorphic text-foreground shadow-neumorphic hover:shadow-neumorphic-sm",
        destructive:
          "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-neumorphic hover:shadow-neumorphic-sm",
        outline:
          "border-0 bg-gradient-neumorphic-inset text-foreground shadow-neumorphic-inset hover:shadow-neumorphic-pressed",
        secondary:
          "bg-gradient-neumorphic text-foreground shadow-neumorphic hover:shadow-neumorphic-sm",
        ghost: "hover:bg-gradient-neumorphic-inset hover:shadow-neumorphic-inset",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
        primary: "bg-gradient-primary text-primary-foreground shadow-neumorphic hover:shadow-neumorphic-sm",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2",
        lg: "h-14 rounded-2xl px-8 py-4",
        icon: "h-12 w-12",
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
