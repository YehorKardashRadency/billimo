import { createAction, props } from '@ngrx/store';
import {Actions} from "../models/actions.model";
import {Notification} from "../models/notification.model";
import {Transaction} from "../models/transaction.model";
import {PaginatedList} from "../../../../shared/models/PaginatedList";

// load actions

export const loadQuickActions = createAction(
  '[Dashboard Component] Load MyEntity'
);

export const loadQuickActionsSuccess = createAction(
  '[Dashboard Effects] Load Quick Actions Success',
  props<{ result: Actions | null }>()
);

export const loadQuickActionsFailure = createAction(
  '[Dashboard Effects] Load Quick Actions Failure',
  props<{ error: any }>()
);

// load notifications

export const loadNotifications = createAction(
  '[Dashboard Component] Load Notifications',
  props<{ take: number }>()
);

export const loadNotificationsSuccess = createAction(
  '[Dashboard Effects] Load Notifications Success',
  props<{ result: PaginatedList<Notification> | null }>()
);

export const loadNotificationsFailure = createAction(
  '[Dashboard Effects] Load Notifications Failure',
  props<{ error: any }>()
);

// load transactions

export const loadTransactions = createAction(
  '[Dashboard Component] Load Transactions',
  props<{ take: number }>()
);

export const loadTransactionsSuccess = createAction(
  '[Dashboard Effects] Load Transactions Success',
  props<{ result: PaginatedList<Transaction> | null }>()
);

export const loadTransactionsFailure = createAction(
  '[Dashboard Effects] Load Transactions Failure',
  props<{ error: any }>()
);


// modal actions

export const openNotificationsModal = createAction(
  '[Dashboard Component] Open Notifications Modal'
);

export const openTransactionsModal = createAction(
  '[Dashboard Component] Open Transactions Modal'
);

export const findNotifications = createAction(
  '[Dashboard Modal Notifications Component] Load Notifications',
  props<{ searchString?: string, isDescending: boolean, days?: number, page: number, take: number }>()
);

export const findNotificationsSuccess = createAction(
  '[Dashboard Effects] Find Notifications Success',
  props<{ result: PaginatedList<Notification> | null }>()
);

export const findNotificationsFailed = createAction(
  '[Dashboard Effects] Find Notifications Failed',
  props<{ error: any }>()
);

export const findTransactions = createAction(
  '[Dashboard Modal Transactions Component] Load Transactions',
  props<{ searchString?: string, isDescending: boolean, days?: number, page: number, take: number }>()
);

export const findTransactionsSuccess = createAction(
  '[Dashboard Effects] Find Transactions Success',
  props<{ result: PaginatedList<Transaction> | null }>()
);

export const findTransactionsFailed = createAction(
  '[Dashboard Effects] Find Transactions Failed',
  props<{ error: any }>()
);

