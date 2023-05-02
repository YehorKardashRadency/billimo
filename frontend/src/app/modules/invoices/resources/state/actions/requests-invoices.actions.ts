import { createAction, props } from "@ngrx/store";
import { InvoiceDetailsData } from "../../models/InvoiceDetailsData";
export class RequestsInvoicesActions {

  public static openRequestsInvoiceDialog = createAction('[Dialog Component] Open invoice from "Requests" tab',
    props<{ data: InvoiceDetailsData }>());
    public static openRequestsInvoiceConfirmDialog = createAction('[Dialog Component] Open confirm dialog',
    props<{ data: InvoiceDetailsData }>());

  public static approveInvoice = createAction(
    '[Requests Invoices Component] Approve Invoice',
    props<{ data: InvoiceDetailsData }>()
  );

  public static approveInvoiceSuccess = createAction(
    '[Requests Invoices Component] Approve Invoice Success',
    props<{ data: InvoiceDetailsData }>()
  );

  public static approveInvoiceFailure = createAction(
    '[Requests Invoices Component] Approve Invoice Failure',
    props<{ error: any }>()
  );
  public static declineInvoice = createAction(
    '[Requests Invoices Component] Decline Invoice',
    props<{ id: number }>()
  );

  public static declineInvoiceSuccess = createAction(
    '[Requests Invoices Component] Decline Invoice Success',
  );

  public static declineInvoiceFailure = createAction(
    '[Requests Invoices Component] Decline Invoice Failure',
    props<{ error: any }>()
  );

}

