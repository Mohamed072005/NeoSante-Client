"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons/icons"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import {authService} from "@/lib/api/auth";
import {ResetPasswordForm} from "@/lib/types/auth";
import {handleError} from "@/lib/utils/handleError";
import {useRouter} from "next/navigation";

const formSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

const ResetPasswordForm = () => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        const payload: ResetPasswordForm = {
            password: values.password,
            confirmPassword: values.confirmPassword
        }
        try {
            const response = await authService.resetPassword(payload);
            toast({
                title: "Password Reset Successful",
                description: response.data.message,
                variant: "default",
            })
            router.push("/");
        } catch (error: unknown) {
            const { message, constraints } = handleError(error);
            toast({
                variant: "destructive",
                title: message,
                description: Array.isArray(constraints)
                    ? constraints[0]
                    : constraints || "An error occurred",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
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
                                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                        )}
                                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <Input type={showConfirmPassword ? "text" : "password"} {...field} className="pl-9 pr-9" />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                        )}
                                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 duration-300 ease-in-out transition-all transform"
                    disabled={isLoading}
                >
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                </Button>
            </form>
        </Form>
    )
}

export default ResetPasswordForm