import {Component, OnInit} from '@angular/core';
import {Store, select} from '@ngrx/store';
import * as BillReducer from "../resources/state/bill/bill.reducer";
import {getSelectedBill} from "../resources/state/bill/bill.selectors";
import {Observable, lastValueFrom, take, tap} from 'rxjs';
import {Bill} from '../resources/models/bill.model';
import {payBillNow, payBillOnDate} from "../resources/state/bill/bill.actions";
import {PaymentMethodModel} from "../../company-account/components/payment-methods/resources/models/payment-method-model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { ApprovalSettingsModel } from '../../company-account/components/approval-settings/resources/models/approval-settings.model';
import { selectApprovalSettings } from '../../company-account/components/approval-settings/state/approval-settings.selectors';
import { RequestsBillsActions } from '../resources/state/requests-bills/requests-bills.actions';
import * as fromApprovalSettingsActions from 'src/app/modules/company-account/components/approval-settings/state/approval-settings.actions';
import {PayBill} from "../resources/models/PayBill";
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { Role } from '../../auth/resources/models/Role';


@Component({
  selector: 'app-pay-bill',
  templateUrl: './pay-bill.component.html',
  styleUrls: ['./pay-bill.component.scss']
})
export class PayBillComponent implements OnInit {
  selectedBill$?: Observable<Bill | null>;
  approvalSettings$!: Observable<ApprovalSettingsModel | null>;
  selectedOption?: string | null;
  payBillConfig: ButtonConfig = { text: 'Pay the bill', onClick: () => alert("Click"), disabled: true };
  approveBillConfig: ButtonConfig = { text: 'Request for approval', onClick: () => this.requestForApproval() };
  selectedDate?: string;
  canPay!: boolean;

  payingSettings: number = 0;
  totalAmount: number = 0;
  billId: number = 0;
  billStatus: string = '';

  payBillForm=new FormGroup({
    termOfPayment:new FormControl('',[Validators.required]),
    paymentMethod:new FormControl<PaymentMethodModel | undefined>(undefined ,[Validators.required]),
  })

  constructor(private store: Store<BillReducer.State>,private router: Router) {

  }

  ngOnInit() {
    this.store.dispatch(fromApprovalSettingsActions.loadApprovalSettings());
    this.selectedBill$ = this.store.select(getSelectedBill).pipe(
      tap(bill =>
        {
          this.totalAmount = bill?.invoice.total as number;
          this.billId = bill?.id as number;
          this.billStatus = bill?.approvalStatus as string;
        })
    );

    this.approvalSettings$ = this.store.select(selectApprovalSettings).pipe(
      tap(async settings => {
        this.payingSettings = settings?.payingInvoicesThreshold as number;
        const role = await lastValueFrom(this.store.pipe(select(selectRole), take(1)));
        this.canPay = this.billStatus === 'Approved' || this.payingSettings > this.totalAmount || role==Role.Admin || role==Role.Director;
    }));
  }

  requestForApproval() {
    this.store.dispatch(RequestsBillsActions.createBillRequest({ billId: this.billId as number}));
    this.router.navigate(['/bills/received']);
  }

  onDateSelected(event: any) {
    this.selectedDate = event.value?.toJSON();
  }

  payBill() {
    const value = this.payBillForm.value;

    let payBillDto: PayBill = {
      billId: this.billId,
      paymentMethodId: value.paymentMethod?.id!
    };

    if (value && value.termOfPayment == "pay-date"){
      payBillDto.payDate = this.selectedDate;
      this.store.dispatch(payBillOnDate({payBillDto: payBillDto}));
    }else{
      this.store.dispatch(payBillNow({payBillDto: payBillDto}));
    }
  }

  isPayDisabled():boolean {
    let valid = this.payBillForm.valid;
    const value = this.payBillForm.value;

    if (value && value.termOfPayment == "pay-date"){
      return !valid || this.selectedDate == null;
    }

    return !valid;
  }
}
