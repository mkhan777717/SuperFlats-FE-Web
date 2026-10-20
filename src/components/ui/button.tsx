import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none active:scale-[0.98] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-[0.8rem] font-semibold tracking-[0.12em] text-primary-foreground uppercase shadow-soft hover:bg-primary/92 hover:shadow-lift",
        gold: "bg-gradient-to-r from-gold-strong to-gold text-[0.8rem] font-semibold tracking-[0.12em] text-white uppercase shadow-[0_4px_16px_rgba(180,125,20,0.22)] hover:shadow-[0_8px_24px_rgba(180,125,20,0.32)] hover:brightness-105",
        ink: "bg-ink text-ink-foreground hover:bg-ink/90",
        outline:
          "border border-foreground/20 bg-white/40 backdrop-blur-md text-[0.8rem] font-semibold tracking-[0.12em] text-foreground uppercase hover:border-primary/40 hover:bg-white/80 hover:shadow-soft aria-expanded:bg-accent dark:bg-input/20",
        glass:
          "border border-white/70 bg-white/70 backdrop-blur-xl text-foreground text-[0.8rem] font-semibold tracking-[0.12em] uppercase shadow-sm hover:bg-white/95 hover:border-white hover:shadow-soft",
        secondary:
          "bg-secondary/80 backdrop-blur-md text-secondary-foreground hover:bg-secondary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-black/5 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-white/10",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3.5 text-[0.8125rem]",
        lg: "h-11 gap-2 px-5 text-[0.9375rem]",
        xl: "h-12 gap-2.5 px-6 text-base",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-11 rounded-2xl",
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
