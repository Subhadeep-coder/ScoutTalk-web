"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"

export function Header() {
  const [hydrated, setHydrated] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          ScoutTalk
        </Link>
        <nav className="flex items-center gap-4">
          {hydrated ? (
            isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
