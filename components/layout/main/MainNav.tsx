"use client"

import {useState} from "react"
import {HeartPulse, ChevronDown, Pill, Stethoscope, MapPin, Clock, Search, BookOpen} from 'lucide-react'
import Link from "next/link"
import {usePathname} from "next/navigation"
import {motion} from "framer-motion"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {cn} from "@/lib/utils"
import useAuthStore from "@/store/authStore";

const MainNav = () => {
    const pathname = usePathname()
    const [isHovered, setIsHovered] = useState(false);
    const {user, isAuthenticated} = useAuthStore();
    return (
        <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 relative">
                <motion.div
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? 360 : 0
                    }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    transition={{duration: 0.3}}
                >
                    <HeartPulse className="h-7 w-7 text-green-500 dark:text-green-400"/>
                </motion.div>
                <span data-testid="nav-platform-name"
                      className="font-bold text-xl inline-block bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300">
          NéoSanté
        </span>
            </Link>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger
                            className={cn(
                                "bg-transparent hover:bg-accent/50",
                                pathname.includes('/pharmacies') && "text-green-600 dark:text-green-400"
                            )}
                        >
                            Pharmacies <ChevronDown className="h-4 w-4"/>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 w-[400px] grid-cols-2">
                                <li className="col-span-2">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/find-pharmacies"
                                            className="flex items-center space-x-2 rounded-md p-3 hover:bg-accent"
                                        >
                                            <Search className="h-5 w-5 text-green-500"/>
                                            <div>
                                                <div className="text-sm font-medium mb-1">Find Pharmacies</div>
                                                <p className="text-sm text-muted-foreground">
                                                    Search for pharmacies near you
                                                </p>
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/pharmacies/open"
                                            className="block select-none space-y-1 rounded-md p-3 hover:bg-accent"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-green-500"/>
                                                <div className="text-sm font-medium">Open Now</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Currently open pharmacies
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/products"
                                            className="block select-none space-y-1 rounded-md p-3 hover:bg-accent"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Pill className="h-4 w-4 text-green-500"/>
                                                <div className="text-sm font-medium">Products</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Browse available medications
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger
                            className={cn(
                                "bg-transparent hover:bg-accent/50",
                                pathname.includes('/healthcare') && "text-green-600 dark:text-green-400"
                            )}
                        >
                            Healthcare <ChevronDown className="h-4 w-4"/>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 w-[400px] grid-cols-2">
                                <li className="col-span-2">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/healthcare/articles"
                                            className="flex items-center space-x-2 rounded-md p-3 hover:bg-accent"
                                        >
                                            <BookOpen className="h-5 w-5 text-green-500"/>
                                            <div>
                                                <div className="text-sm font-medium mb-1">Health Articles</div>
                                                <p className="text-sm text-muted-foreground">
                                                    Expert medical insights and advice
                                                </p>
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/healthcare/doctors"
                                            className="block select-none space-y-1 rounded-md p-3 hover:bg-accent"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Stethoscope className="h-4 w-4 text-green-500"/>
                                                <div className="text-sm font-medium">Doctors</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Find healthcare providers
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/healthcare/locations"
                                            className="block select-none space-y-1 rounded-md p-3 hover:bg-accent"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-green-500"/>
                                                <div className="text-sm font-medium">Locations</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Medical facilities near you
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    {isAuthenticated && (
                        <>
                            {user?.role !== 'User' && (
                                <NavigationMenuItem>
                                    <Link href="/dashboard" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn(
                                                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                                                pathname === '/dashboard' && "text-green-600 dark:text-green-400"
                                            )}
                                        >
                                            Dashboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )}
                        </>
                    )}
                    {user?.role === 'User' && (
                        <>
                            <NavigationMenuItem>
                                <Link href='/pharmacy/register' legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className='border border-input bg-background shadow-sm hover:bg-emerald-800 hover:text-accent-foreground py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
                                    >
                                        Become Pharmacies
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default MainNav

