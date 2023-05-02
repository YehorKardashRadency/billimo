import {createSelector} from "@ngrx/store";
import {selectCompanyAccountState} from "../../../state/company-account.selector";
import {documentsKey} from "./documents.reducer";

export const selectDocumentsState = createSelector(
  selectCompanyAccountState,
  state => state[documentsKey]
)

export const selectDocuments = createSelector(
  selectDocumentsState,
  state =>state.documents
)
