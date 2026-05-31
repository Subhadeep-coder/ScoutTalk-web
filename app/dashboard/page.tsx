"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/lib/stores/auth-store"

type UserProfile = {
    id: string
    googleId: string | null
    email: string
    username: string
    firstName: string
    lastName: string
    displayName: string | null
    avatar: string | null
    needsOnboarding: boolean
    createdAt: string
    updatedAt: string
}

export default function DashboardPage() {
    const router = useRouter()
    const refreshToken = useAuthStore((s) => s.refreshToken)
    const logout = useAuthStore((s) => s.logout)

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        apiClient
            .get<UserProfile>("/users/me")
            .then(({ data }) => setProfile(data))
            .catch(() => router.push("/login"))
            .finally(() => setLoading(false))
    }, [router])

    async function handleLogout() {
        try {
            await apiClient.post("/auth/logout", { refresh_token: refreshToken })
        } catch {
            // proceed with local logout regardless
        }
        logout()
        router.push("/login")
    }

    if (loading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <span className="text-sm text-muted-foreground">Name</span>
                        <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Email</span>
                        <p className="font-medium">{profile?.email}</p>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Username</span>
                        <p className="font-medium">{profile?.username}</p>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Joined</span>
                        <p className="font-medium">
                            {profile?.createdAt
                                ? new Date(profile.createdAt).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                        <LogOut />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
