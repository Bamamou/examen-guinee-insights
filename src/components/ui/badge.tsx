import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl border-0 px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-0 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-primary-foreground shadow-neumorphic-sm hover:shadow-neumorphic",
        secondary:
          "bg-gradient-neumorphic text-secondary-foreground shadow-neumorphic-sm hover:shadow-neumorphic",
        destructive:
          "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-neumorphic-sm hover:shadow-neumorphic",
        outline: "text-foreground bg-gradient-neumorphic-inset shadow-neumorphic-inset hover:shadow-neumorphic-pressed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
