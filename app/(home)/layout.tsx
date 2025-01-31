import MainNav from "@/components/home/MainNav";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Link from "next/link";

export default function Layout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
            <header
                className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-8 lg:px-16">
                    <MainNav/>
                    <div className="flex items-center gap-4">
                        <ThemeToggle/>
                        {/*<Button className=" bg-red-500 ml-2">*/}
                            <Link data-testid="auth-link" href="/auth" className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                                Log In
                            </Link>
                        {/*</Button>*/}
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <div className="container px-4 py-8 sm:px-8 lg:px-16">
                    {children}
                </div>
            </main>
        </div>
    )
}