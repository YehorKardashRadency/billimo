import { createAction, props } from "@ngrx/store";
import { Bill } from "../../models/bill.model";
import {PayBill} from "../../models/PayBill";
import { Filter } from "src/app/core/resources/models/Filter";
import { Sort } from "src/app/core/resources/models/Sort";
import { PaginatedList } from "src/app/shared/models/PaginatedList";
import  * as BillList from '../../models/bill';
import {CancelBillModel} from "../../models/cancel-bill.model";

export const loadBillPaymentDetails = createAction(
  '[Pay Bill Component] Load Bill Payment Details',
  props<{ id: number }>()
);

export const loadBillPaymentDetailsSuccess = createAction(
  '[Bill Effects] Load Bill Payment Details Success',
  props<{ bill: Bill }>()
);

export const loadBillPaymentDetailsFailure = createAction(
  '[Bill Effects] Load Bill Payment Details Failure',
  props<{ error: any }>()
);

export const payBillNow = createAction(
  '[Pay Bill Component] Pay Bill Now',
  props<{ payBillDto: PayBill }>()
);

export const payBillOnDate = createAction(
  '[Pay Bill Component] Pay Bill On Date',
  props<{ payBillDto: PayBill }>()
);

export const openSuccessDialog = createAction(
  '[Dialog Component] Opened Successful dialog',
props<{component: any, props: any}>()
);

export const navigateToLogin = createAction(
  '[Pay Bill Component] Navigate To Login'
);

export const navigateToRegistration = createAction(
  '[Pay Bill Component] Navigate To Registration'
);

export const persistBillId = createAction(
  '[Pay Bill Component] Persist Bill Id'
);

//========================= Sent bills

export const loadSentBills = createAction(
  '[Sent Bills] Load'
);

export const loadSentBillsSuccess = createAction(
  '[Sent Bills] Load Success',
  props<{bills:PaginatedList<BillList.Bill>}>()
);

export const loadSentBillsFailure = createAction(
  '[Sent Bills] Load Failure',
  props<{error:any}>()
);

export const addFilterSentBills = createAction(
  '[Sent Bills] Filter Add',
  props<{filter: Filter}>()
);

export const removeFilterSentBills = createAction(
  '[Sent Bills] Filter Remove',
  props<{key: string}>()
);

export const setFilterSentBills = createAction(
  '[Sent Bills] Filter Set',
  props<{filter: Filter[]}>()
);

export const setSortSentBills = createAction(
  '[Sent Bills] Sort',
  props<{sort: Sort[]}>()
);

export const searchSentBills = createAction(
  '[Sent Bills] Search',
  props<{search: string | null}>()
);

export const setPageIndexSentBills = createAction(
  '[Sent Bills] Page index',
  props<{pageIndex: number}>()
);

export const setPageSizeSentBills = createAction(
  '[Sent Bills] Page size',
  props<{pageSize: number}>()
);

export const clearSentBills = createAction(
  '[Sent Bills] Clear state',
);

export const clearSentBillsFilter = createAction(
  '[Sent Bills] Clear filter',
);

export const clearSentBillsSort = createAction(
  '[Sent Bills] Clear sort',
);

export const selectedAllSentBills = createAction(
  '[Sent Bills] Selected all',
  //props<{selectedAll: boolean}>()
);

export const addSelectedSendBills = createAction(
  '[Sent Bills] Add selected bill',
  props<{id: number}>()
);

export const removeSelectedSendBills = createAction(
  '[Sent Bills] Remove selected bill',
  props<{id: number}>()
);

export const setSelectedSendBills = createAction(
  '[Sent Bills] Set selected bill',
  props<{selectedBills: number[]}>()
);

export const showBillCancellationModal = createAction(
  '[Received Bills] Show Bill Cancellation Modal',
  props<{bill: BillList.Bill, tab: string}>()
)

export const cancelBill = createAction(
  '[Bills] Cancel Bill',
  props<{model: CancelBillModel, tab: string}>()
)

export const cancelBillSuccess = createAction(
  '[Bills] Cancel Bill Success',
  props<{tab: string}>()
)

export const cancelBillFailed = createAction(
  '[Bills] Cancel Bill Failed',
  props<{ error: any }>()
)
