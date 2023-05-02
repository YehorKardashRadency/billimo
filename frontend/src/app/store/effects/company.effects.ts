import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as CompanyActions from '../actions/company.actions';
import { ApiService } from 'src/app/core/resources/services/api.service';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';

@Injectable()
export class CompanyEffects {

  loadCompany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActions.loadCompany),
      concatMap(() =>
        this.apiService.get<CompanyModel>("/gateway/company/currentcompanyinfo").pipe(
          map((company) => CompanyActions.loadCompanySuccess({ company: company }))
          ,catchError((error) => of(CompanyActions.loadCompanyFailure({ error: error?.error?.errors  ?? {}})) )
        )
      )
    );
  });

  loadCompanies$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(CompanyActions.loadCompanies),
        mergeMap((action) =>
          this.invoiceService.getCompanies$(action.searchString ?? "").pipe(
            map((companies) => CompanyActions.loadCompaniesSuccess({ companies: companies }))
            ,catchError((error) => of(CompanyActions.loadCompaniesFailure({ error: error?.error?.errors ?? {} })) )
          )
        ));
  });

  constructor(private actions$: Actions,
    private apiService: ApiService,
    private invoiceService: InvoiceService) {}
}
