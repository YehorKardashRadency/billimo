import { ErrorResponse } from "src/app/core/resources/models/ErrorResponse";

export interface ValidationErrors {
    Email?: string[];
    CompanyName?: string[];
    FirstName?: string[];
    LastName?: string[];
    Password?: string[];
    City?: string[];
    Country?: string[];
    Street?: string[];
    ZipCode?: string[];
    Apartment?: string[];
}

export interface FormValidationError extends ErrorResponse {
    errors: ValidationErrors
}

