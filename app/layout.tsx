import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/theme/ThemeProvider";
import {Toaster} from "@/components/ui/toaster";
import RouteGuard from "@/lib/guards/RouteGuard";
import AuthGuard from "@/lib/guards/AuthGuard";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: 'NéoSanté',
    description: 'Your Healthcare Platform',
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable}`}>
        <RouteGuard>
            <AuthGuard>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="neosante-theme"
                >
                    <div
                        className="absolute inset-0 bg-grid-primary/[0.02] -z-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(68, 149, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(68, 149, 255, 0.05) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent -z-10"/>
                    {children}
                    <Toaster/>
                </ThemeProvider>
            </AuthGuard>
        </RouteGuard>

        </body>
        </html>
    );
}
