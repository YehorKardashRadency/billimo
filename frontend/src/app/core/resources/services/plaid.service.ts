import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { ApiService } from 'src/app/core/resources/services/api.service';
import {PublicLinkTokenModel} from "../models/public-link-token.model";
import {Store} from "@ngrx/store";
import {HttpClient} from "@angular/common/http";
import {exchangeLinkToken} from "../../../modules/company-account/components/payment-methods/state/payment-methods.actions";

declare let Plaid: any;

@Injectable({
  providedIn: 'root'
})
export class PlaidService extends ApiService {

  constructor(private store$: Store, private httpClient: HttpClient) {
    super(httpClient);
  }

  createLinkToken$(): Observable<PublicLinkTokenModel> {
    return this.get("/gateway/payments/createlinktoken");
  }

  createHandler(publicToken: string): void  {
    const handler = Plaid.create({
      token: publicToken,
      onSuccess: (publicToken:string, metadata:any) => {
        this.store$.dispatch(exchangeLinkToken({ publicToken: publicToken }));
      },
      onLoad: () => {},
      onExit: (err:any, metadata:any) => {},
      onEvent: (eventName:any, metadata:any) => {},
    });

    handler.open();
  }

  exchangePublicToken(publicToken:string):Observable<any> {
    return this.post("/gateway/payments/exchangepublictoken", { publicToken: publicToken });
  }
}
