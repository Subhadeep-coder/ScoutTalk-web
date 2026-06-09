"use client"

import { useState } from "react"
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Grid } from "@giphy/react-components"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!)

type GifPickerProps = Readonly<{
  onSelect: (gifUrl: string) => void
  onClose: () => void
}>

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [search, setSearch] = useState("")

  const fetchGifs = (offset: number) =>
    search
      ? gf.search(search, { offset, limit: 20 })
      : gf.trending({ offset, limit: 20 })

  return (
    <div className="flex flex-col rounded-xl border bg-popover shadow-lg">
      <div className="flex items-center gap-2 border-b p-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search GIFs..."
          className="h-8"
        />
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <div className="h-80 w-96 overflow-y-auto">
        <Grid
          width={384}
          columns={3}
          fetchGifs={fetchGifs}
          onGifClick={(gif, e) => {
            e.preventDefault()
            onSelect(gif.images.fixed_height.url)
          }}
          noLink
          key={search}
        />
      </div>
    </div>
  )
}
