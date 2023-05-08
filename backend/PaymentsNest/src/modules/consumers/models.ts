export interface IntegrationEvent {
  id: string;
  creationDate: Date;
}

export interface UpdatePaymentStatisticMessage extends IntegrationEvent {
  buyerId?: number;
  sellerId?: number;
  forPayment: string;
}

export interface CreatePaymentStatisticMessage extends IntegrationEvent {
  companyId: number;
  companyName: string;
}
