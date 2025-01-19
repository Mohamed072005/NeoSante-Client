"use client"

import {useState} from "react"
import * as z from 'zod'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Icons} from "@/components/icons/icons"
import {authService} from "@/lib/api/auth"
import {motion} from "framer-motion"
import {Check, ChevronsUpDown, Eye, EyeOff, Lock} from 'lucide-react'
import {useToast} from "@/hooks/use-toast"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/auth";

const countries = [
    {label: "United States", value: "US"},
    {label: "Canada", value: "CA"},
    {label: "United Kingdom", value: "GB"},
    {label: "Australia", value: "AU"},
    {label: "Germany", value: "DE"},
    {label: "France", value: "FR"},
    {label: "Spain", value: "ES"},
    {label: "Italy", value: "IT"},
    {label: "Japan", value: "JP"},
    {label: "Brazil", value: "BR"},
    {label: "Morocco", value: "MR"}
    // Add more countries as needed
]

const formSchema = z.object({
    first_name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    phone_number: z.string().min(8, {
        message: "Phone number must be in a valid Morocco format",
    }),
    cin_number: z.string().min(8, {
        message: "Cin number must be in a valid Morocco format",
    }).min(6, {
        message: "Cin number must be in a valid Morocco format",
    }),
    country: z.string({
        required_error: "Please select a country.",
    }),
    city: z.string().min(3, {
        message: "City must be in a valid Morocco format",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    })

})

const RegisterForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const {toast} = useToast()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            country: "",
            city: "",
            address: "",
            phone_number: "",
            cin_number: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await authService.register(values)
            toast({
                title: "Success",
                description: "Registration successful!",
            })
            if(response.status === 200){
                toast({
                    title: "Success",
                    description: response.data.message,
                })
            }
        } catch (error: any) {
            console.log(error)
            if (error.response?.status) {
                setError(error.response.data.error || error.response.data.message || error.response.data.errorMessage)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.response.data.error || error.response.data.message || error.response.data.errorMessage,
                })
            }else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error?.message || 'Network eError',
                })
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            className="grid gap-6"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Doe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Lock className="h-4 w-4"/>
                                        </div>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                            className="pl-9 pr-9"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"/>
                                            ) : (
                                                <Eye
                                                    className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"/>
                                            )}
                                            <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="address" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="mb-2.5">Country</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? countries.find(
                                                            (country) => country.value === field.value
                                                        )?.label
                                                        : "Select country"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..."/>
                                                <CommandEmpty>No country found.</CommandEmpty>
                                                <CommandGroup className="max-h-[200px] overflow-auto">
                                                    {countries.map((country) => (
                                                        <CommandItem
                                                            value={country.label}
                                                            key={country.value}
                                                            onSelect={() => {
                                                                form.setValue("country", country.value)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === country.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {country.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cin_number"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>CIN Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="CIN" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="city" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="address" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 duration-300 ease-in-out transition-all transform"
                            disabled={loading}
                        >
                            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                            Create Account
                        </Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Button variant="outline" disabled={loading}>
                    <Icons.gitHub className="mr-2 h-4 w-4"/>
                    Github
                </Button>
                <Button variant="outline" disabled={loading}>
                    <Icons.google className="mr-2 h-4 w-4"/>
                    Google
                </Button>
            </div>
        </motion.div>
    )
}

export default RegisterForm

