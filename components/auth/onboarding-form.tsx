"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/lib/hooks/use-debounce"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/lib/stores/auth-store"
import axios from "axios"

type Availability = "idle" | "checking" | "available" | "taken"

export function OnboardingForm({ ...props }: React.ComponentProps<typeof Card>) {
    const router = useRouter()
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const user = useAuthStore((s) => s.user)
    const setAuth = useAuthStore((s) => s.setAuth)
    const accessToken = useAuthStore((s) => s.accessToken)
    const refreshToken = useAuthStore((s) => s.refreshToken)

    const [username, setUsername] = useState("")
    const [availability, setAvailability] = useState<Availability>("idle")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const debouncedUsername = useDebounce(username, 500)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        apiClient
            .get<{ needsOnboarding: boolean }>("/users/me/onboarding-status")
            .then(({ data }) => {
                if (!data.needsOnboarding) {
                    router.push("/dashboard")
                }
            })
            .catch(() => {
                router.push("/login")
            })
    }, [isAuthenticated, router])

    useEffect(() => {
        if (!debouncedUsername || debouncedUsername.length < 2) {
            setAvailability("idle")
            return
        }

        setAvailability("checking")

        const baseURL = process.env.NEXT_PUBLIC_API_URL
        axios
            .get<{ available: boolean; username: string }>(
                `${baseURL}/users/username/${debouncedUsername}`,
            )
            .then(({ data }) => {
                setAvailability(data.available ? "available" : "taken")
            })
            .catch(() => {
                setAvailability("idle")
            })
    }, [debouncedUsername])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (availability === "taken") {
            setError("Username is not available")
            return
        }

        setLoading(true)

        try {
            await apiClient.post("/users/me/username", { username })

            setAuth(
                { ...user!, username },
                accessToken!,
                refreshToken!,
            )
            router.push("/dashboard")
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            setError(message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Welcome! Choose a username</CardTitle>
                <CardDescription>
                    Pick a unique username to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                placeholder="john_doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {availability === "checking" && (
                                <p className="text-sm text-muted-foreground">Checking availability...</p>
                            )}
                            {availability === "available" && (
                                <p className="text-sm text-emerald-500">Username available</p>
                            )}
                            {availability === "taken" && (
                                <p className="text-sm text-destructive">Username already taken</p>
                            )}
                        </Field>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Field>
                            <Button type="submit" disabled={loading || availability === "taken"}>
                                {loading ? "Saving..." : "Continue"}
                                <ArrowRight />
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
