import {  createReducer, on } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';
import {Actions} from "../models/actions.model";
import {Transaction} from "../models/transaction.model";
import {Notification} from "../models/notification.model";
import {PaginatedList} from "../../../../shared/models/PaginatedList";
import {findNotifications} from "./dashboard.actions";

export const dashboardFeatureKey = 'dashboard';

export interface State {
  // dashboard component
  actions: Actions | null;
  transactions: PaginatedList<Transaction> | null;
  notifications: PaginatedList<Notification> | null;
  actionsFailureMessage: any;
  transactionsFailureMessage: any;
  notificationsFailureMessage: any;

  // modals
  foundTransactions: PaginatedList<Transaction> | null;
  foundTransactionsFailureMessage: any;
  foundTransactionsLoading: boolean;
  foundNotifications: PaginatedList<Notification> | null;
  foundNotificationsFailureMessage: any;
  foundNotificationsLoading: boolean;
}

export const initialState: State = {
  actions: null,
  transactions: null,
  notifications: null,

  actionsFailureMessage: null,
  transactionsFailureMessage: null,
  notificationsFailureMessage: null,

  foundTransactions: null,
  foundTransactionsLoading: false,
  foundTransactionsFailureMessage: null,
  foundNotifications: null,
  foundNotificationsLoading: false,
  foundNotificationsFailureMessage: null,
};

export const reducer = createReducer(
  initialState,

  // components

  on(DashboardActions.loadQuickActionsSuccess, (state, action) => ({
    ...state,
    actions: action.result,
    actionsFailureMessage: null
   })
  ),
  on(
    DashboardActions.loadQuickActionsFailure, (state, action) => ({
      ...state,
      actionsFailureMessage: action.error,
    })
  ),

  on(DashboardActions.loadTransactionsSuccess, (state, action) => ({
    ...state,
    transactions: action.result,
    actionsFailureMessage: null
    })
  ),
  on(
    DashboardActions.loadTransactionsFailure, (state, action) => ({
      ...state,
      actionsFailureMessage: action.error,
    })
  ),

  on(DashboardActions.loadNotificationsSuccess, (state, action) => ({
      ...state,
      notifications: action.result,
      notificationsFailureMessage: null
    })
  ),
  on(
    DashboardActions.loadNotificationsFailure, (state, action) => ({
      ...state,
      notificationsFailureMessage: action.error,
    })
  ),

  // modals
  on(
    DashboardActions.findTransactions, (state, action) => ({
      ...state,
      foundTransactionsLoading: true,
      foundTransactionsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findNotifications, (state, action) => ({
      ...state,
      foundNotificationsLoading: true,
      foundNotificationsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findNotificationsSuccess, (state, action) => ({
      ...state,
      foundNotifications: action.result,
      foundNotificationsFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findNotificationsFailed, (state, action) => ({
      ...state,
      foundNotificationsFailureMessage: action.error,
    })
  ),
  on(
    DashboardActions.findTransactionsSuccess, (state, action) => ({
      ...state,
      foundTransactions: action.result,
      foundTransactionsLoading: false,
      foundTransactionFailureMessage: null,
    })
  ),
  on(
    DashboardActions.findTransactionsFailed, (state, action) => ({
      ...state,
      foundTransactionsLoading: false,
      foundTransactionFailureMessage: action.error,
    })
  ),
);
