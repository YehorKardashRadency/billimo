import { PaymentMethodModel } from "src/app/modules/company-account/components/payment-methods/resources/models/payment-method-model";

export interface CompanyDetails {
  id?: number;
  name: string;
  email: string;
  street: string;
  city: string;
  zipCode: string;
  logo: Uint8Array;
  paymentMethods: PaymentMethodModel[];
}
