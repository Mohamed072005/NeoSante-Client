'use client'

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import {HeartPulse} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPassword from "@/components/auth/ForgotPassword";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState<string>('login');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
                    <CardHeader className="space-y-1 flex flex-col items-center pb-8">
                        <motion.div
                            initial={{scale: 0.8}}
                            animate={{scale: 1}}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            className="flex items-center gap-2 text-primary mb-2"
                        >
                            <HeartPulse className="h-8 w-8 text-red-400"/>
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-pink-700 bg-clip-text text-transparent">
                                NeoSante
                            </h2>
                        </motion.div>
                        <CardDescription className="text-center text-base">
                            {activeTab === "login" && "Access your healthcare dashboard"}
                            {activeTab === "register" && "Join our healthcare platform"}
                            {activeTab === "forgot" && "Reset your account password"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
                            <TabsList  className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="login">Sign In</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                                <TabsTrigger value="forgot">Reset</TabsTrigger>
                            </TabsList>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TabsContent value="login" className="mt-0">
                                        <LoginForm />
                                    </TabsContent>
                                    <TabsContent value="register" className="mt-0">
                                        <RegisterForm />
                                    </TabsContent>
                                    <TabsContent value="forgot" className="mt-0">
                                        <ForgotPassword />
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default AuthPage;