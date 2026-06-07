import { useCallback, useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      setThemeState(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  const setTheme = useCallback((t: "dark" | "light") => {
    setThemeState(t)
    localStorage.setItem("theme", t)
    document.documentElement.classList.toggle("dark", t === "dark")
  }, [])

  return { theme, setTheme }
}
