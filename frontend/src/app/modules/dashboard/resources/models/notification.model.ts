export interface Notification {
  id: number,
  referenceId?: number,
  operation: NotificationOperationsModel,
  message: string,
  date: string,
}

export enum NotificationOperationsModel {
  InvoiceSent = 1,
  InvoiceReceived,
  Message,
}
