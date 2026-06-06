"use client"

import { useState } from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"
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
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signup } from "@/lib/services/auth"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [successEmail, setSuccessEmail] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            await signup(email, password, firstName, lastName)
            setSuccessEmail(email)
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message

            if (status === 409) {
                setError(message || "Email already in use")
            } else {
                setError(message || "Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    if (successEmail) {
        return (
            <Card {...props}>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <MailCheck className="size-6 text-primary" />
                    </div>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a verification link to{" "}
                        <span className="font-medium text-foreground">{successEmail}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
                    <p>Click the link in the email to verify your account and get started.</p>
                    <p>
                        Didn&apos;t receive it?{" "}
                        <button
                            type="button"
                            onClick={() => setSuccessEmail("")}
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Try again
                        </button>
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                <Input
                                    id="first-name"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not share your email
                                with anyone else.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <FieldDescription>Please confirm your password.</FieldDescription>
                        </Field>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                                <Button variant="outline" type="button" disabled={loading}>
                                    Sign up with Google
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <Link href="/login">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
