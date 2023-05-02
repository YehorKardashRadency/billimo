import { createAction, props } from "@ngrx/store";
import { CreateInvoiceResult } from "../../models/CreateInvoiceResult";
import { NewInvoiceModel } from "../../models/NewInvoiceModel";
import {GetInvoiceNumber} from "../../models/GetInvoiceNumber";

export const createInvoicePage = createAction(
  '[Create Invoice Component] Create Invoice',
  props<{ invoice: NewInvoiceModel }>()
);

export const createInvoiceSuccess = createAction(
  '[Create Invoice Effect] Create Invoice Success',
  props<{ invoice: NewInvoiceModel, result: CreateInvoiceResult }>()
);

export const createInvoiceFailure = createAction(
  '[Create Invoice Effect] Create Invoice Failure',
  props<{ error: any }>()
);

export const editInvoice = createAction(
  '[Edit invoice] save edited invoice',
  props<{invoiceToEdit:NewInvoiceModel}>()
);

export const editInvoiceSuccess = createAction(
  '[Edit invoice] success',
  props<{invoiceToSave:NewInvoiceModel}>()
);

export const editInvoiceFailure = createAction(
  '[Edit invoice] failure',
  props<{errors:any}>()
);

export const getInvoiceNumber=createAction(
  '[Create Invoice Component] Get Invoice Number'
);
export const getInvoiceNumberSuccess=createAction(
  '[Create Invoice Effect] Get Invoice Number Success',
  props<{invoiceNumber:GetInvoiceNumber}>()
)
