import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex flex-1 flex-col items-center justify-center px-6">
                <section className="flex max-w-3xl flex-col items-center gap-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Connect, Share, and{" "}
                        <span className="text-primary">Discover</span>
                    </h1>
                    <p className="max-w-lg text-lg text-muted-foreground">
                        ScoutTalk brings people together. Join conversations, share your
                        stories, and build your community.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    )
}
