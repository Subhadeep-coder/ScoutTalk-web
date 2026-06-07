"use client"

import type { ReactNode } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type TooltipWrapperProps = Readonly<{
  label: string
  children: ReactNode
  side?: "top" | "bottom" | "left" | "right"
  disabled?: boolean
}>

export function TooltipWrapper({ label, children, side = "right", disabled }: TooltipWrapperProps) {
  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side}>{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}
