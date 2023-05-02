import { AddressForm } from "./AddressForm";
import { CompanyValidationForm } from "./CompanyValidationForm";

export interface CompanyRegistrationForm {
    companyData: CompanyValidationForm,
    address: AddressForm
}
