"use client"

import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type ServerPreviewCardProps = Readonly<{
  name: string
  avatarPreview: string | null
  bannerPreview: string | null
  description: string | null
}>

export function ServerPreviewCard({ name, avatarPreview, bannerPreview, description }: ServerPreviewCardProps) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className={cn("relative h-28 bg-gradient-to-br from-primary/20 to-primary/5", bannerPreview && "h-36")}>
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Camera className="size-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute -bottom-9 left-4">
            <Avatar className="size-[72px] border-4 border-card ring-2 ring-background">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} />
              ) : (
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
        <div className="mt-12 px-4 pb-4">
          <div className="flex items-center gap-2">
          <span className="truncate text-base font-semibold">{name}</span>
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-2.5 rounded-full bg-green-500" />
            <span>1 Online</span>
            <span className="text-border">·</span>
            <span>1 Member</span>
          </div>
        </div>
      </div>
    </div>
  )
}
