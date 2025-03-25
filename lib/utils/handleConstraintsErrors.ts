import { ExceptionError } from "@/lib/types/error"; // Adjust the import based on your error type location

/**
 * Handles errors and returns a consistent error message and constraints.
 * @param error - The error object (can be `unknown`, `ExceptionError`, or generic `Error`).
 * @returns An object containing the error message and constraints.
 */
export function handleConstraintError(error: unknown): {
    message: string;
    constraints?: string | string[];
} {
    // Handle `ExceptionError`
    if (isExceptionError(error)) {
        const { data } = error.response;

        // Extract the first error's constraints (if available)
        const errorConstraints = data.errors?.[0]?.constraints;

        // Log errors for debugging
        if (data.errors) {
            data.errors.forEach((err) => {
                console.log(`Field: ${err.field}, Constraints: ${err.constraints}`);
            });
        }

        return {
            message: data.message || "An error occurred",
            constraints: errorConstraints,
        };
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