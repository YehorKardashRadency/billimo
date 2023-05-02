import { createAction, props } from "@ngrx/store";
import { Sort } from "src/app/core/resources/models/Sort";
import { PaginatedList } from "src/app/shared/models/PaginatedList";
import { Bill } from "../../models/bill";
import { PopupDataModel } from "../../models/PopupDataModel";

export class RequestsBillsActions {

  /* LOAD REQUESTS BILLS */
  public static loadRequestsBills = createAction(
    '[Requests Bills Component] Load Requests Bills'
  );

  public static loadRequestsBillsSuccess = createAction(
    '[Requests Bills Component] Load Requests Bills Success',
    props<{ requestsBills: PaginatedList<Bill> }>()
  );

  public static loadRequestsBillsFailure = createAction(
    '[Requests Bills Component] Load Requests Bills Failure',
    props<{ error: any }>()
  );

  public static setSortRequestsBills = createAction(
    '[Requests Bills Component] Sort',
    props<{ sort: Sort[] }>()
  );

  public static clearRequestsBillsSort = createAction(
    '[Requests Bills Component] Clear sort',
  );

  public static setPageIndexRequestsBills = createAction(
    '[Requests Bills Component] Page index',
    props<{ pageIndex: number }>()
  );

  public static searchRequestsBills = createAction(
    '[Requests Bills Component] Search',
    props<{ search: string | null }>()
  );

  /* CREATE REQUESTS */
  public static createBillRequest = createAction(
    '[Requests Bills Component] Create Bill Request',
    props<{ billId: number }>()
  );

  public static createBillRequestSuccess = createAction(
    '[Requests Bills Component] Create Bill Request Success'
  );

  public static createBillRequestFailure = createAction(
    '[Requests Bills Component] Create Bill Request Failure',
    props<{ error: any }>()
  );

  public static openRequestsBillDialog = createAction(
    '[Dialog Component] Open bill from "Requests" tab',
    props<{ data: PopupDataModel }>()
  );

  public static openRequestsBillConfirmDialog = createAction(
    '[Dialog Component] Open confirm approve bill dialog',
    props<{ data: PopupDataModel, billNumber: string }>()
  );

  /* APPROVE REQUEST */
  public static approveBill = createAction(
    '[Requests Bills Component] Approve Bill',
    props<{ id: number, billNumber: string }>()
  );

  public static approveBillSuccess = createAction(
    '[Requests Bills Component] Approve Bill Success',
    props<{ number: string }>()
  );

  public static approveBillFailure = createAction(
    '[Requests Bills Component] Approve Bill Failure',
    props<{ error: any }>()
  );

  /* DECLINE REQUEST */
  public static declineBill = createAction(
    '[Requests Bills Component] Decline Bill',
    props<{ id: number }>()
  );

  public static declineBillSuccess = createAction(
    '[Requests Bills Component] Decline Bill Success'
  );

  public static declineBillFailure = createAction(
    '[Requests Bills Component] Decline Bill Failure',
    props<{ error: any }>()
  );
}
