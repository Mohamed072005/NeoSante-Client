import {Loader2} from "lucide-react";

const Loader = () => {
    return (
        <>
            <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
                <div className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                        <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader;