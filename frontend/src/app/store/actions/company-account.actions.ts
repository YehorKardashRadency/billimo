import { createAction, props } from "@ngrx/store";
import { AddressesList } from "src/app/modules/company-account/components/employees/resources/models/Addresses";
import { NewAddress } from "src/app/modules/company-account/components/employees/resources/models/NewAddres";

export const fetchAddresses = createAction('[Company Account] Fetch Addresses',
  (afterUpdate: boolean = false) => ({ afterUpdate })
);
export const fetchAddressesSuccess = createAction('[Company Account] Fetch Addresses Success',
  props<{ addressesList: AddressesList }>());
export const fetchAddressesFailure = createAction('[Company Account] Fetch Addresses Failure',
  props<{ error: any }>());
export const updateAddress = createAction('[Company Account] Update Address',
  props<{ address: NewAddress }>());
export const deleteAddress = createAction('[Company Account] Delete Address',
  props<{ id: number }>());
export const addAddress = createAction('[Company Account] Add Address',
  props<{ address: NewAddress }>());
export const toggleAddress = createAction('[Company Account] Toggle deffault address', props<{ id: number }>());
export const toggleAddressSuccess = createAction('[Company Account] Toggle deffault address success', props<{ id: number }>());
export const addAddressSuccess = createAction('[Company Account] Add Address Success',);
// general for all failures
export const updateAddressesFailure = createAction('[Company Account] Update Addresses Failure',
  props<{ error: any }>());


