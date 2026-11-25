"use client"

import type { ReactNode } from "react"
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react"

const SLIDE_DISTANCE = 48

// `custom` carries the direction, so a step enters from the side the user is
// heading to and the previous one leaves the opposite way — forward and back
// read as one continuous movement.
const variants: Variants = {
  enter: (direction: number) => ({ x: direction * SLIDE_DISTANCE, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction * -SLIDE_DISTANCE,
    opacity: 0,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  }),
}

interface StepTransitionProps {
  stepKey: string
  direction: number
  children: ReactNode
}

/**
 * Slides the current step in and the previous one out.
 *
 * The frame is `overflow-hidden` and keeps the height it is given, so the
 * modal never resizes while a step is on its way out or in.
 */
export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={stepKey}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
