"use client"
import {motion} from "framer-motion";
import * as z from "zod"
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons/icons";
import {Button} from "@/components/ui/button";
import {authService} from "@/lib/api/auth";
import {ResetPasswordForm} from "@/lib/types/auth";
import {useToast} from "@/hooks/use-toast";
import {handleError} from "@/lib/utils/handleError";

const formSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address',
    })
})

interface Error {
    message: string;
}

const ForgotPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const {toast} = useToast();

    const form = useForm<z.infer<typeof  formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const handelSubmit = async (value: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);
        const data: ResetPasswordForm = {
            email: value.email,
        }
        try{
            const response = await authService.askResetPassword(data);
            toast({
                variant: "default",
                title: "Success!",
                description: response.data.message,
            })
        }catch(err: unknown){
            const {message, constraints} = handleError(err);
            setError({
                message: message
            } as Error);
            toast({
                variant: "destructive",
                title: message,
                description: Array.isArray(constraints)
                    ? constraints[0]
                    : constraints || "An error occurred",
            });
        }finally{
            setLoading(false);
        }
    }
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid gap-2"
            >
             <Form { ...form }>
                 <form onSubmit={form.handleSubmit(handelSubmit)} className="space-y-4">
                     <FormField
                         control={form.control}
                         name="email"
                         render={({ field }) => (
                             <FormItem>
                                 <FormLabel>Email</FormLabel>
                                 <FormControl>
                                     <Input
                                         type="email"
                                         placeholder="name@example.com"
                                         { ...field }
                                     />
                                 </FormControl>
                                 <FormMessage/>
                             </FormItem>
                         )}
                     />
                     {error && (
                         <div className="text-sm text-red-500 text-center">{error.message}</div>
                     )}
                     <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 duration-300 ease-in-out transition-all transform" disabled={loading}>
                         {loading && (
                             <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                         )}
                         Send Reset Link
                     </Button>
                 </form>
             </Form>
            </motion.div>
        </>
    )
}

export default ForgotPassword