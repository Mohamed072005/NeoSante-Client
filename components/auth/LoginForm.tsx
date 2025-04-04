"use client"

import {useState} from "react";
import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons/icons";
import {authService} from "@/lib/api/auth";
import {motion} from "framer-motion";
import {Eye, EyeOff, Lock} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/localStorage";
import {UserID} from "@/lib/types/localStorage";
import {handleError} from "@/lib/utils/handleError";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

const LoginForm = () => {
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {toast} = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await authService.login(values);
            toast({
                variant: "default",
                title: "Success!",
                description: response.data.message,
            })
            if (response.data.statusCode === 201) {
                const OTPLocalStorage = withLocalStorage<Token>("OTP_token");
                const UserIDLocalStorage = withLocalStorage<UserID>("userId");
                OTPLocalStorage.set({data: response.data.token});
                UserIDLocalStorage.set({data: response.data.user_id});
                setTimeout(() => {
                    router.push("/auth/otp")
                }, 2000)
            }
            if (response.data.statusCode === 202) {
                const tokenLocalStorage = withLocalStorage<Token>("token");
                tokenLocalStorage.set({data: response.data.token});
                setTimeout(() => {
                    router.push("/")
                }, 2000)
            }
        } catch (error: unknown) {
            console.log(error)
            const { message, constraints } = handleError(error);
            setError(message);
            toast({
                variant: "destructive",
                title: message,
                description: Array.isArray(constraints)
                    ? constraints[0]
                    : constraints || "An error occurred",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3}}
                className="grid gap-6"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            {...field}
                                        />
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
                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}
                        <Button type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 duration-300 ease-in-out transition-all transform"
                                disabled={loading}>
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Sign In
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </>
    )
}

export default LoginForm