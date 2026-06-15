"use client"

import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"

type ServerSettingsLayoutProps = Readonly<{
  title: string
  description: string
  children: ReactNode
  sidebar?: ReactNode
}>

export function ServerSettingsLayout({ title, description, children, sidebar }: ServerSettingsLayoutProps) {
  return (
    <div className="flex h-full min-h-0 overflow-y-auto">
      <div className="flex min-w-0 flex-1 flex-col gap-0 px-10 py-8">
        <div className="mb-5">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Separator className="mb-5" />
        <div className="flex gap-8">
          <div className="flex w-full max-w-160 flex-col gap-5 pb-4">
            {children}
          </div>
          {sidebar && (
            <div className="hidden w-[280px] shrink-0 lg:block">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
