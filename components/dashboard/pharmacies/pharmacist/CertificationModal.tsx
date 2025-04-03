"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface CertificationModalProps {
    isOpen: boolean
    onClose: () => void
    certification: {
        name: string
        image: string
        date: string
    } | null
}

export function CertificationModal({ isOpen, onClose, certification }: CertificationModalProps) {
    if (!certification) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>{certification.name}</DialogTitle>
                    </div>
                    <DialogDescription>Issued on {new Date(certification.date).toLocaleDateString()}</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
                    <img
                        src={certification.image || "/placeholder.svg"}
                        alt={`${certification.name} certificate`}
                        className="object-contain w-full h-full"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={() => window.open(certification.image, "_blank")}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

