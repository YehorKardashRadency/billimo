import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as DashboardReducer from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardReducer.State>(
  DashboardReducer.dashboardFeatureKey
);

export const selectActions = createSelector(
  selectDashboardState,
  state => state.actions
);

export const selectNotifications = createSelector(
  selectDashboardState,
  state => state.notifications
);

export const selectTransactions = createSelector(
  selectDashboardState,
  state => state.transactions
);

export const selectFoundNotifications = createSelector(
  selectDashboardState,
  state => state.foundNotifications
);

export const selectFoundTransactions = createSelector(
  selectDashboardState,
  state => state.foundTransactions
);

export const selectFoundTransactionsLoading = createSelector(
  selectDashboardState,
  state => state.foundTransactionsLoading
);

export const selectFoundNotificationsLoading = createSelector(
  selectDashboardState,
  state => state.foundNotificationsLoading
);

