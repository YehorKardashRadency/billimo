import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PayBillComponent } from './pay-bill/pay-bill.component';
import { StoreModule } from '@ngrx/store';
import * as BillReducer from './resources/state/bill/bill.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BillEffects } from './resources/state/bill/bill.effects';
import { PaymentBillSuccessfulComponent } from './modals/payment-bill-successful/payment-bill-successful.component';
import { PublicPayBillComponent } from './public-pay-bill/public-pay-bill.component';
import { CommonModule } from '@angular/common';
import { BillsRoutingModule } from './bills-routing.module';
import { SentBillsComponent } from './components/sent-bills/sent-bills.component';
import { ReceivedBillsComponent } from './components/received-bills/received-bills.component';
import * as ReceivedBillReducer from './resources/state/received/received.bill.reducer';
import { ReceivedBillEffects } from './resources/state/received/received.bill.effects';
import {billPaymentFeatureKey, reducers} from "./reducers";
import {PaymentStatisticEffects} from "./resources/state/payment-statistic/payment-statistic.effects";
import {PaymentStatisticComponent} from "./components/payment-statistic/payment-statistic.component";
import { RequestsBillsEffects } from './resources/state/requests-bills/requests-bills.effects';
import * as RequestsBillsReducer from './resources/state/requests-bills/requests-bills.reducers';
import { RequestsBillsComponent } from './components/requests-bills/requests-bills.component';
import { BillsComponent } from './bills.component';
import { BillPopupComponent } from './components/bill-popup/bill-popup.component';
import { BillRequestConfirmComponent } from './components/bill-request-confirm/bill-request-confirm.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CancelScheduledBillComponent} from "./components/cancel-scheduled-bill/cancel-scheduled-bill.component";

const routes: Routes = [
  // { path: ':billId', component: PayBillComponent },
];

@NgModule({
  declarations: [
    PayBillComponent,
    PaymentBillSuccessfulComponent,
    PublicPayBillComponent,
    BillsComponent,
    SentBillsComponent,
    ReceivedBillsComponent,
    RequestsBillsComponent,
    PaymentStatisticComponent,
    BillPopupComponent,
    BillRequestConfirmComponent,
    CancelScheduledBillComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    StoreModule.forFeature(
      BillReducer.billsFeatureKey,
      BillReducer.reducer
    ),
    StoreModule.forFeature(
      ReceivedBillReducer.billsFeatureKey,
      ReceivedBillReducer.reducer
    ),
    StoreModule.forFeature(
      RequestsBillsReducer.requestsBillsFeatureKey,
      RequestsBillsReducer.reducer
    ),
    StoreModule.forFeature(billPaymentFeatureKey, reducers),
    EffectsModule.forFeature([
      BillEffects,
      ReceivedBillEffects,
      RequestsBillsEffects,
      PaymentStatisticEffects
    ]),
    CommonModule,
    BillsRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class BillsModule { }
