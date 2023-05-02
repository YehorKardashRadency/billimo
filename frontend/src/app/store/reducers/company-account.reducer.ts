import { createReducer, on } from '@ngrx/store';
import { Address } from 'src/app/modules/company-account/components/employees/resources/models/Address';
import * as fromCompanyAccountActions from '../actions/company-account.actions';

export const companyAccountFeatureKey = 'company-account';

export interface State {
  addresses: Address[],
  defaultAddressId: number,
  modalErrors?: any,
}

const initialState: State = {
  addresses: [],
  defaultAddressId: 0
};

export const reducer = createReducer(
  initialState,
  on(fromCompanyAccountActions.fetchAddressesSuccess, (state, action) => {
    return {
      ...state,
      addresses: action.addressesList.addresses,
      defaultAddressId: action.addressesList.defaultAddressId,
    };
  }),
  on(fromCompanyAccountActions.toggleAddressSuccess, (state, action) => {
    return {
      ...state,
      defaultAddressId: action.id,
    };
  }),
  on(fromCompanyAccountActions.updateAddressesFailure, (state, action) => {
    return {
      ...state,
      modalErrors: action.error
    };
  }),
);

export const addresses = (state: State) => state.addresses;
export const defaultAddressId = (state: State) => state.defaultAddressId;
