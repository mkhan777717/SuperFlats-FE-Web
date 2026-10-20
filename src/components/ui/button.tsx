import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 outline-none select-none active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-[13.5px] text-primary-foreground shadow-sm hover:bg-black/90",
        gold: "bg-gradient-to-r from-gold-strong to-gold text-[13.5px] text-white shadow-[0_4px_14px_rgba(180,125,20,0.28)] hover:brightness-105",
        ink: "bg-ink text-[13.5px] text-ink-foreground hover:bg-ink/90",
        outline:
          "border border-black/[0.12] bg-white/60 backdrop-blur-xl text-[13.5px] text-foreground hover:border-black/25 hover:bg-white hover:shadow-sm aria-expanded:bg-accent dark:border-white/15 dark:bg-white/5",
        glass:
          "border border-white/80 bg-white/70 backdrop-blur-2xl text-[13.5px] text-foreground shadow-sm hover:bg-white hover:border-white hover:shadow-soft",
        secondary:
          "bg-black/[0.05] text-[13.5px] text-foreground hover:bg-black/[0.08] aria-expanded:bg-secondary dark:bg-white/10 dark:hover:bg-white/15",
        ghost:
          "text-[13.5px] text-foreground/80 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/10",
        destructive:
          "bg-destructive/10 text-[13.5px] text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-[13.5px] text-link hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 text-xs",
        lg: "h-10 gap-2 px-5 text-sm",
        xl: "h-11 gap-2.5 px-6 text-[15px]",
        icon: "size-9 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a spinner and disables the button (ignored with asChild). */
    loading?: boolean
  }) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
