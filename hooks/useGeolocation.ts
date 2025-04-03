// hooks/use-geolocation.ts
import { useState } from "react"

export function useGeolocation() {
    const [loading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getCurrentPosition = (
        successCallback: PositionCallback,
        errorCallback?: PositionErrorCallback
    ) => {
        if (!navigator.geolocation) {
            const errorMessage = "Geolocation is not supported by your browser"
            setError(errorMessage)
            errorCallback?.({
                code: 0,
                message: errorMessage,
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
            })
            return
        }

        setIsLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLoading(false)
                successCallback(position)
            },
            (err) => {
                setIsLoading(false)
                setError(err.message)
                errorCallback?.(err)
            }
        )
    }

    return { getCurrentPosition, loading, error }
}