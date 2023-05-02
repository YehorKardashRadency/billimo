export interface PaymentMethodModel{
  id: number;
  title: string;
  additional?: string;
  methodType: PaymentMethodType;
}

export enum PaymentMethodType{
  Card,
  Bank,
  Paypal,
}
