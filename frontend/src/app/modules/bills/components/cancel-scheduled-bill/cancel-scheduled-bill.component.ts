import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ButtonConfig} from "../../../../shared/button/button.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {BillCancellationModel} from "../../resources/models/bill-cancellation.model";
import {CancelBillModel} from "../../resources/models/cancel-bill.model";
import {cancelBill} from "../../resources/state/bill/bill.actions";
import {selectModalLoading} from "../../resources/state/bill/bill.selectors";

@Component({
  selector: 'app-cancel-scheduled-bill',
  templateUrl: './cancel-scheduled-bill.component.html',
  styleUrls: ['./cancel-scheduled-bill.component.scss']
})
export class CancelScheduledBillComponent implements OnInit, OnDestroy {

  closeButtonConfig: ButtonConfig = {
    text: 'Close',
    disabled: false,
    onClick: undefined,
  };

  submitButtonConfig: ButtonConfig = {
    text: 'Submit',
    disabled: true,
    onClick: undefined,
  }

  isLoading$?: Observable<boolean>
  formChanges$?: Subscription;
  viewOnly: boolean = false;

  form = new FormGroup({
    "billId": new FormControl<number>(this.bill.id, [Validators.required]),
    "reason": new FormControl<string>(this.bill.cancellation?.reason ?? "", [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public bill: {id: number, cancellation?: BillCancellationModel, tab: string }, private store: Store, private ref: MatDialogRef<CancelScheduledBillComponent>) {
    console.log(bill)
    if (bill.cancellation?.cancellationTime) {
      this.viewOnly = true;
      this.form.controls.reason.disable();
    }
  }

  ngOnInit(): void {
    this.formChanges$ = this.form.valueChanges.subscribe(x => {
      console.log(this.form.value)
      this.submitButtonConfig.disabled = !this.form.valid;
    })

    this.isLoading$ = this.store.pipe(select(selectModalLoading))
  }

  ngOnDestroy() {
    this.formChanges$?.unsubscribe();
  }

  onSubmit(){
    const values = this.form.value;

    if (!this.form.valid)
      return;

    const model:CancelBillModel = {
      billId: values.billId!,
      cancellationReason: values.reason!,
    };

    this.store.dispatch(cancelBill({model: model, tab: this.bill.tab}))
  }

  close() {
    this.ref.close();
  }
}
