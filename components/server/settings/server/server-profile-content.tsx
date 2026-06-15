"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useActiveServerStore } from "@/lib/stores/active-server-store"
import { updateServer, uploadServerAvatar, uploadServerBanner } from "@/lib/services/servers"
import { ServerPreviewCard } from "@/components/server/settings/server/server-preview-card"

type ServerProfileContentProps = Readonly<{
  serverId: string
}>

export function ServerProfileContent({ serverId }: ServerProfileContentProps) {
  const activeServer = useActiveServerStore((s) => s.activeServer)
  const setActiveServer = useActiveServerStore((s) => s.setActiveServer)

  const [name, setName] = useState(activeServer?.name ?? "")
  const [description, setDescription] = useState(activeServer?.description ?? "")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const avatarDragCounter = useRef(0)
  const [avatarDragging, setAvatarDragging] = useState(false)
  const bannerDragCounter = useRef(0)
  const [bannerDragging, setBannerDragging] = useState(false)

  const hasChanges =
    name !== (activeServer?.name ?? "") ||
    description !== (activeServer?.description ?? "") ||
    avatarUrl !== null ||
    bannerUrl !== null

  const currentAvatar = avatarPreview ?? activeServer?.avatar ?? null
  const currentBanner = bannerPreview ?? activeServer?.banner ?? null

  const processAvatarFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setAvatarUploading(true)
    try {
      const res = await uploadServerAvatar(serverId, file)
      const url = res.data?.url ?? res.data?.avatar ?? res.data
      if (url) {
        setAvatarUrl(url)
        setAvatarPreview(url)
      }
    } catch {
    } finally {
      setAvatarUploading(false)
    }
  }, [serverId])

  const processBannerFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setBannerUploading(true)
    try {
      const res = await uploadServerBanner(serverId, file)
      const url = res.data?.url ?? res.data?.banner ?? res.data
      if (url) {
        setBannerUrl(url)
        setBannerPreview(url)
      }
    } catch {
    } finally {
      setBannerUploading(false)
    }
  }, [serverId])

  async function handleSave() {
    if (!name.trim() || saving) return
    setSaving(true)
    try {
      await updateServer(serverId, {
        name: name.trim(),
        avatar: avatarUrl ?? activeServer?.avatar ?? null,
        banner: bannerUrl ?? activeServer?.banner ?? null,
        description: description.trim() || null,
      })
      if (activeServer) {
        setActiveServer({
          ...activeServer,
          name: name.trim(),
          description: description.trim() || null,
          avatar: avatarUrl ?? activeServer.avatar,
          banner: bannerUrl ?? activeServer.banner,
        })
      }
      setAvatarPreview(null)
      setAvatarUrl(null)
      setBannerPreview(null)
      setBannerUrl(null)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-8">
      <div className="flex w-full max-w-160 flex-col gap-5 pb-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Server Name
          </Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Server Icon
        </Label>
        <p className="text-xs text-muted-foreground">We recommend an image of at least 512×512.</p>
        <div className="mt-1 flex items-center gap-3">
          <div
            className="group relative size-20 cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy" }}
            onDragEnter={(e) => { e.preventDefault(); avatarDragCounter.current++; if (avatarDragCounter.current === 1) setAvatarDragging(true) }}
            onDragLeave={() => { avatarDragCounter.current--; if (avatarDragCounter.current === 0) setAvatarDragging(false) }}
            onDrop={(e) => { e.preventDefault(); avatarDragCounter.current = 0; setAvatarDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processAvatarFile(file) }}
          >
            <Avatar className={cn("size-full transition-all duration-200", avatarDragging && "scale-105 ring-2 ring-primary ring-offset-2")}>
              {currentAvatar ? (
                <AvatarImage src={currentAvatar} />
              ) : (
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {avatarUploading ? <Loader2 className="size-5 animate-spin text-white" /> : <Camera className="size-5 text-white" />}
            </div>
          </div>
          {currentAvatar && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setAvatarPreview(null)
                setAvatarUrl(null)
                if (avatarInputRef.current) avatarInputRef.current.value = ""
              }}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          )}
        </div>
        <Input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) processAvatarFile(file) }}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Server Banner
        </Label>
        <p className="text-xs text-muted-foreground">This image will appear at the top of your server&apos;s profile.</p>
        <div
          className={cn(
            "group relative mt-1 flex h-25 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-muted-foreground/40",
            bannerDragging && "border-primary bg-primary/5"
          )}
          onClick={() => bannerInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy" }}
          onDragEnter={(e) => { e.preventDefault(); bannerDragCounter.current++; if (bannerDragCounter.current === 1) setBannerDragging(true) }}
          onDragLeave={() => { bannerDragCounter.current--; if (bannerDragCounter.current === 0) setBannerDragging(false) }}
          onDrop={(e) => { e.preventDefault(); bannerDragCounter.current = 0; setBannerDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processBannerFile(file) }}
        >
          {currentBanner && (
            <Image src={currentBanner} alt="" fill className="object-cover" />
          )}
          <div className={cn(
            "relative flex flex-col items-center gap-1 text-muted-foreground transition-opacity",
            currentBanner ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}>
            {bannerUploading ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}
            <span className="text-xs">{bannerUploading ? "Uploading..." : "Upload Banner"}</span>
          </div>
          {currentBanner && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); setBannerPreview(null); setBannerUrl(null); if (bannerInputRef.current) bannerInputRef.current.value = "" }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
        <Input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) processBannerFile(file) }}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Tell people what your server is about..."
        />
      </div>

      {hasChanges && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setName(activeServer?.name ?? "")
              setDescription(activeServer?.description ?? "")
              setAvatarPreview(null)
              setAvatarUrl(null)
              setBannerPreview(null)
              setBannerUrl(null)
            }}
            disabled={saving}
          >
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!name.trim() || saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            Save Changes
          </Button>
        </div>
      )}
      </div>
      <div className="hidden w-70 shrink-0 lg:block">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
        <ServerPreviewCard
          name={name}
          avatarPreview={currentAvatar}
          bannerPreview={currentBanner}
          description={description}
        />
      </div>
    </div>
  )
}