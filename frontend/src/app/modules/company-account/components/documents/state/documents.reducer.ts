import {DocumentsModel} from "../resources/models/documents.model";
import {createReducer, on} from "@ngrx/store";
import * as DocumentsActions from "../state/documents.actions";

export const documentsKey = 'documentsKey';

export interface DocumentsState {
  documents: DocumentsModel | null;
  error: any;
}

export const initialState: DocumentsState = {
  documents: null,
  error: null,
};

export const reducer = createReducer(
  initialState,

  on(DocumentsActions.loadDocuments, (state, action) => ({
      ...state,
      error: null,
    })
  ),

  on(DocumentsActions.loadDocumentsSuccess, (state, action) => ({
      ...state,
      documents: action.result,
      error: null,
    })
  ),

  on(DocumentsActions.loadDocumentsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),
);
