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

    const form = useForm<z.infer<typeof  formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    });

    const handelSubmit = (value: z.infer<typeof formSchema>) => {
        console.log(value);
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