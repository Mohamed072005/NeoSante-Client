import OTPForm from "@/components/auth/OTPForm";
import AuthGuard from "@/lib/guards/AuthGuard";

const OTPPage = () => {
    return (
        <>
            <AuthGuard>
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="w-full max-w-lg space-y-2"
                    >
                        <OTPForm/>
                    </div>
                </div>
            </AuthGuard>
        </>
    )
}

export default OTPPage;