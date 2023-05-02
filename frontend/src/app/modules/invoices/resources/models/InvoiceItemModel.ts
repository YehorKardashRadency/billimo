export interface InvoiceItemModel{
  id?: number;
  description: string;
  metric: string;
  count: number;
  price: number;
  subtotal: number;
}
