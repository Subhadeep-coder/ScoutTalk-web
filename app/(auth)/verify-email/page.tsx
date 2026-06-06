"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail } from "@/lib/services/auth"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const setAuth = useAuthStore((s) => s.setAuth)

    useEffect(() => {
        if (!token) {
            router.push("/")
            return
        }

        verifyEmail(token)
            .then(({ data }) => {
                setAuth(data.user, data.access_token, data.refresh_token)
                router.push(data.user.needsOnboarding ? "/onboarding" : "/dashboard")
            })
            .catch(() => {
                router.push("/")
            })
    }, [token, router, setAuth])

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>Verifying your email</CardTitle>
                    <CardDescription>Please wait while we verify your email address...</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
