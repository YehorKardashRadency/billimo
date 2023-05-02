export interface ApprovalSettingsModel {
  onPayingInvoicesHigherThan: boolean,
  payingInvoicesThreshold: number,

  onSendingInvoicesHigherThan: boolean,
  sendingInvoicesThreshold: number,

  onSendingAllInvoices: boolean,
}
