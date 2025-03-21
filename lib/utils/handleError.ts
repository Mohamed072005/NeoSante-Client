// utils/errorHandler.ts
import { ExceptionError } from "@/lib/types/error"; // Adjust the import based on your error type location

/**
 * Handles errors and returns a consistent error message and constraints.
 * @param error - The error object (can be `unknown`, `ExceptionError`, or generic `Error`).
 * @returns An object containing the error message and constraints.
 */
export function handleError(error: unknown): {
    message: string | string[];
    constraints?: string | string[];
} {
    if (isExceptionError(error)) {
        const { data } = error.response;

        // Check if the message is an array
        if (Array.isArray(data.message)) {
            // Return the array of error messages
            console.log("this is an errro")
            return {
                message: data.message[0] as string, // Array of error messages
                constraints: data.message[0] as string, // Optional: You can also return constraints if needed
            };
        } else {
            // Handle non-array messages
            return {
                message: data.message || "An error occurred",
                constraints: data.message,
            };
        }
    } else {
        // Handle non-`ExceptionError` errors
        const err = error as Error;
        return {
            message: err?.message || "Network Error",
        };
    }
}

/**
 * Type guard to check if the error is of type `ExceptionError`.
 * @param error - The error object.
 */
function isExceptionError(error: unknown): error is ExceptionError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        'data' in (error as any).response &&
        'status' in (error as any).response
    );
}