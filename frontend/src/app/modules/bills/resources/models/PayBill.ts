export interface PayBill {
  billId: number;
  paymentMethodId: number;
  spreadDays?: number,
  payDate?: string,
}
