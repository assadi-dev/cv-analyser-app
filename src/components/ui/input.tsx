import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center" style={{ color: "var(--color-text-subtle)" }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-[40px] rounded-[8px] text-[13px] outline-none transition-all",
              "bg-[var(--color-surface-muted)] border border-[var(--color-border)]",
              "focus:border-[var(--color-primary)] focus:bg-white",
              "placeholder:text-[var(--color-text-subtle)]",
              leftIcon  ? "pl-9" : "pl-3",
              rightIcon ? "pr-9" : "pr-3",
              error && "border-[var(--color-danger)]",
              className,
            )}
            style={{ color: "var(--color-text-secondary)" }}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 flex items-center cursor-pointer" style={{ color: "var(--color-text-subtle)" }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span className="text-[11px]" style={{ color: "var(--color-danger-text)" }}>
            {error}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

// ─── Textarea variant ─────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[10px] text-[12px] outline-none transition-all resize-none p-3",
            "bg-[var(--color-surface-muted)] border border-[var(--color-border)]",
            "focus:border-[var(--color-primary)] focus:bg-white",
            "placeholder:text-[var(--color-text-subtle)]",
            error && "border-[var(--color-danger)]",
            className,
          )}
          style={{ color: "var(--color-text-secondary)" }}
          {...props}
        />
        {error && (
          <span className="text-[11px]" style={{ color: "var(--color-danger-text)" }}>
            {error}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"
