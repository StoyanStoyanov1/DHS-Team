/**
 * Common types used across the application
 */

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
}