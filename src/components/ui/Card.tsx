import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

const PADDING = { sm: "p-4", md: "p-5", lg: "p-6" }

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border bg-[var(--color-surface)]",
        "shadow-[var(--shadow-card)]",
        PADDING[padding],
        className,
      )}
      style={{ borderColor: "var(--color-border)" }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  icon?: ReactNode
  iconBg?: string
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ icon, iconBg = "var(--color-primary-light)", title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2.5 mb-4", className)}>
      {icon && (
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[14px] font-bold" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </span>
        {subtitle && (
          <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}


function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "cn-font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}


function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}


export {
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
