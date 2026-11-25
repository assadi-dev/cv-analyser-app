"use client"

import { Fragment } from "react"
import { Check } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { CandidatureStepConfig } from "../../../_lib/candidature-steps.config"

interface CandidatureStepperProps {
  steps: CandidatureStepConfig[]
  currentIndex: number
  onStepClick: (index: number) => void
}

/**
 * Progress header of the wizard.
 *
 * Only steps already reached are clickable: going back is free, going forward
 * goes through "Suivant" so each step is validated on the way.
 */
export function CandidatureStepper({
  steps,
  currentIndex,
  onStepClick,
}: CandidatureStepperProps) {
  return (
    <nav
      aria-label="Progression"
      className="shrink-0 border-b border-[#F1F5F9] bg-white px-6 py-4"
    >
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <Fragment key={step.id}>
              <li>
                <button
                  type="button"
                  disabled={index > currentIndex}
                  onClick={() => onStepClick(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className="group flex items-center gap-2.5 rounded-[8px] disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-200",
                      isCurrent && "bg-gradient-primary text-white ring-4 ring-primary-light",
                      isDone && "bg-primary text-white group-hover:bg-primary-hover",
                      !isDone && !isCurrent && "bg-[#F1F5F9] text-[#94A3B8]"
                    )}
                  >
                    {isDone ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[12px] font-semibold transition-colors duration-200",
                      isCurrent ? "text-[#1E293B]" : "text-[#94A3B8]",
                      isDone && "text-[#475569]",
                      // On a phone only the current label fits.
                      !isCurrent && "hidden sm:inline"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              </li>

              {index < steps.length - 1 && (
                <li
                  role="presentation"
                  className="mx-3 h-[2px] flex-1 overflow-hidden rounded-full bg-[#E2E8F0]"
                >
                  <motion.span
                    className="block h-full origin-left bg-primary"
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
