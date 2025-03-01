"use client"

import {useParams} from "next/navigation";
import ResetPasswordGuard from "@/lib/guards/ResetPasswordGuard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {KeyRound} from "lucide-react";
import { motion } from "framer-motion"

const ResetPasswordPage = () => {
    const params = useParams<{ token: string }>()
    const token = params.token;
    return (
        <>
            <ResetPasswordGuard token={token}>
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4}}
                    className="w-full max-w-md mx-auto mt-32"
                >
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="space-y-3 pb-8">
                            <div
                                className="mx-auto bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center">
                                <KeyRound className="h-6 w-6 text-green-600 dark:text-green-500"/>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                            <CardDescription className="text-center text-base">
                                Please enter your new password below. Make sure it's secure and you remember it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResetPasswordForm/>
                        </CardContent>
                    </Card>
                </motion.div>
            </ResetPasswordGuard>
        </>
    )
}
export default ResetPasswordPage;