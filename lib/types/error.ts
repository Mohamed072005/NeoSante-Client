export interface ExceptionError {
    response: {
        data: DataError;
        status: number;
    };
}

export interface DataError {
    errors: Error[] | null;
    message: string;
    path: string;
    statusCode: number;
    timestamp: string;
}

export interface Error {
    constraints: string[] | string;
    field: string;
}