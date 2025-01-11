"use client"

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons/icons";
import {authService} from "@/lib/api/auth";
import {motion} from "framer-motion";

const formSchema = z.object({
    identifier: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

const LoginForm = () => {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>();

    useEffect(() => {
        if (searchParams?.get('error')) {
            setError(searchParams.get('error'));
        }
    }, [searchParams]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await authService.login(values);
            console.log(response)
        } catch (error: any) {
            if (error.response.status) {
                setError(error.response.data.error ? error.response.data.error : error.response.data.message);
            }
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
                            name="identifier"
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
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}
                        <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-pink-700 hover:scale-105 duration-300 ease-in-out transition-all transform" disabled={loading}>
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Sign In
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
        </>
    )
}

export default LoginForm