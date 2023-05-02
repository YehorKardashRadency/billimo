import {
  combineReducers,
} from '@ngrx/store';

import * as fromPaymentMethods from '../components/payment-methods/state/payment-methods.reducer'
import * as fromEmployee from "../components/employees/state/employee.reducer";
import * as fromDocuments from "../components/documents/state/documents.reducer";
import * as fromApprovalSettings from "../components/approval-settings/state/approval-settings.reducer";

export const companyAccountFeatureKey = 'companyAccount';

export interface State {
  [fromPaymentMethods.paymentMethodsKey]: fromPaymentMethods.State;
  [fromEmployee.employeeFeatureKey]: fromEmployee.EmployeeState;
  [fromDocuments.documentsKey]: fromDocuments.DocumentsState;
  [fromApprovalSettings.approvalSettingsKey]: fromApprovalSettings.ApprovalSettingsState
}

export const reducers = combineReducers({
    [fromPaymentMethods.paymentMethodsKey]: fromPaymentMethods.reducer,
    [fromEmployee.employeeFeatureKey]: fromEmployee.employeeReducer,
    [fromDocuments.documentsKey]: fromDocuments.reducer,
    [fromApprovalSettings.approvalSettingsKey]: fromApprovalSettings.reducer,
  }
)
