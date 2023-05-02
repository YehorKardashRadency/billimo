import { ModalSuccessComponent } from './../../shared/modal-success/modal-success.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './../../core/resources/services/api.service';
import { map, of, switchMap } from 'rxjs';
import { Actions, createEffect, ofType, act } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import * as fromVerifyCompanyActions from 'src/app/store/actions/company-verification.actions';
import { AppState } from '..';
import { Store } from '@ngrx/store';
import { SuccessModalRedirectComponent, SuccessModalRedirectData } from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';


@Injectable()
export class CompanyVerificationEffects {
    constructor(private actions:Actions,private http:ApiService,
        private dialog:MatDialog){
        
    }
    verifyCompany$ = createEffect(() => 
        this.actions.pipe(
        ofType(fromVerifyCompanyActions.verifyCompany),
        switchMap(action => this.http.put(`/gateway/CompanyVerification/verify/${action.companyId}`)
        .pipe(
            map( _ => {
                const data: SuccessModalRedirectData = {
                    text:`Your company has been successfully verified`,
                    primaryButton: {
                        label: 'Close',
                    }
                } 
                this.dialog.open(SuccessModalRedirectComponent,{data})
                return fromVerifyCompanyActions.verifyCompanySuccess();
            }),
            catchError(error => {
                const data: SuccessModalRedirectData = {
                    text:`Your company wasn't verified \n please contact us at billimo@radency.tech`,
                    primaryButton: {
                        label: 'Close',
                    },
                    unsuccessful:true,
                } 
                this.dialog.open(SuccessModalRedirectComponent,{data})
                return of(fromVerifyCompanyActions.verifyCompanyFailure({errors:error?.error?.errors ?? {}}));
            })
            )
        ))
        )
    
   
}
