import {createAction, props} from "@ngrx/store";
import {DocumentsModel} from "../resources/models/documents.model";

export const loadDocuments = createAction(
  '[Documents Component] Load Documents'
);

export const loadDocumentsSuccess = createAction(
  '[Documents Effects] Load Documents Success',
  props<{ result: DocumentsModel | null }>()
);

export const loadDocumentsFailed = createAction(
  '[Documents Effects] Load Documents Failed',
  props<{ error: any }>()
);

export const updateDocuments = createAction(
  '[Documents Component] Update Documents',
  props<{ model: DocumentsModel}>()
);

export const updateDocumentsSuccess = createAction(
  '[Documents Effects] Update Documents Success',
);

export const updateDocumentsFailed = createAction(
  '[Documents Effects] Update Documents Failed',
  props<{ error: any }>()
);
