import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as DocumentsActions from "../state/documents.actions";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {DocumentsService} from "../resources/services/documents.service";
import {Store} from "@ngrx/store";
import {coreGetCurrentUserInfo} from "../../../../../store/actions/core.actions";

@Injectable()
export class DocumentsEffects {
  loadDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentsActions.loadDocuments),
      mergeMap((action) => {
          return this.documentsService.getDocuments$().pipe(
            map((data) =>
              DocumentsActions.loadDocumentsSuccess({result: data})
            ),
            catchError((error) =>
              of(DocumentsActions.loadDocumentsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  addDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentsActions.updateDocuments),
      mergeMap((action) => {
          return this.documentsService.updateDocuments$(action.model).pipe(
            map((data) => {
                return DocumentsActions.updateDocumentsSuccess()
              }
            ),
            catchError((error) =>
              of(DocumentsActions.updateDocumentsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  updateUserInfo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DocumentsActions.updateDocumentsSuccess),
        tap(() =>
          this.store$.dispatch(coreGetCurrentUserInfo())
        )
      ),
    {dispatch: false}
  );



  constructor(
    private actions$: Actions,
    private documentsService: DocumentsService,
    private store$: Store,
  ) {
  }
}
