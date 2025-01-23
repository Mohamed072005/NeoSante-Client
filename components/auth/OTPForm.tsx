"use client"

import React, {useState, useEffect} from 'react';
import {Timer, Mail} from 'lucide-react';
import {withLocalStorage} from "@/lib/utils/localStorage";
import {ResetCountdownOTP, VerifyOTPForm} from "@/lib/types/auth";
import {authService} from "@/lib/api/auth";
import {FormEvent} from "preact-compat";
import {useToast} from "@/hooks/use-toast";

const OTPForm = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabledButton, setIsDisabledButton] = useState(false);
    const [countDown, setCountDown] = useState(0);
    const [error, setError] = useState('');
    const { toast } = useToast();
    const resetCountDownLocalStorage = withLocalStorage<ResetCountdownOTP>("resetCountdownOTP")

    const handleResendOTP = () => {
        const expirationTime = Date.now() + 300000;
        resetCountDownLocalStorage.set({data: expirationTime.toString()})
        setIsDisabledButton(true);
        setCountDown(300);
    };

    useEffect(() => {
        const storedExpirationTime = resetCountDownLocalStorage.get();
        if (storedExpirationTime && storedExpirationTime.data) {
            const timeRemaining = Math.floor((parseInt(storedExpirationTime.data) - Date.now()) / 1000);
            if (timeRemaining > 0) {
                setIsDisabledButton(true);
                setCountDown(timeRemaining);
            } else {
                resetCountDownLocalStorage.remove();
            }
        }

        const timer = countDown > 0 && setTimeout(() => setCountDown(countDown - 1), 1000);
        if (countDown === 0) {
            setIsDisabledButton(false);
        }
        return () => clearTimeout(timer);
    }, [countDown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleInputChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            return;
        }
        const payload: VerifyOTPForm = {
            otp: otpValue
        }
        setIsLoading(true);
        try {
            const response = await authService.verifyOTP(payload);
            console.log(response)
        } catch (error: any) {
            if(error?.response?.data?.message) {
                toast({
                    variant: 'destructive',
                    title: 'Error!',
                    description: error.response.data.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error!',
                    description: error.message || "Network Error",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="bg-white backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60 shadow-xl border-0 rounded-lg shadow-lg p-6">
                <div className="space-y-4 text-center">
                    <div
                        className="mx-auto bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-green-600 dark:text-green-500"/>
                    </div>
                    <h2 className="text-2xl font-bold">Email Verification</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We've sent a 6-digit verification code to your email address. Please enter it below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`otp-${index}`}
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="w-12 h-12 text-center border rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <div className="text-center">
                        <div
                            className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Timer className="h-4 w-4"/>
                            <button
                                onClick={handleResendOTP}
                                type="button"
                                disabled={isDisabledButton}
                                className={`font-medium hover:underline ${
                                    isDisabledButton ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 dark:text-green-500'
                                }`}
                            >
                                {isDisabledButton ? `Wait for ${formatTime(countDown)}` : "Send"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPForm;