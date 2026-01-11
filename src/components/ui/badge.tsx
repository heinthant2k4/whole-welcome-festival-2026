import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(236,72,153,0.55)]",
        secondary:
          "bg-cyan-400/90 text-black shadow-[0_0_12px_rgba(34,211,238,0.6)]",
        outline:
          "border border-primary/60 text-primary shadow-[0_0_10px_rgba(236,72,153,0.45)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);


function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), "backdrop-blur-sm", className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
