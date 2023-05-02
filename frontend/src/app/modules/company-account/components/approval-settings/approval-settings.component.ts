import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SwitchComponent} from "../../../../shared/switch/switch.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";
import {debounceTime, Subscription} from "rxjs";
import {ApprovalSettingsModel} from "./resources/models/approval-settings.model";
import { select, Store } from '@ngrx/store';
import {selectApprovalSettings} from "./state/approval-settings.selectors";
import {loadApprovalSettings, updateApprovalSettings} from "./state/approval-settings.actions";
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { Role } from 'src/app/modules/auth/resources/models/Role';

@Component({
  selector: 'app-approval-settings',
  templateUrl: './approval-settings.component.html',
  styleUrls: ['./approval-settings.component.scss'],
  providers: [CurrencyPipe]
})
export class ApprovalSettingsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('payingCheckbox') payingCheckbox!: SwitchComponent;
  @ViewChild('sendingCheckbox') sendingCheckbox!: SwitchComponent;
  @ViewChild('globalCheckbox') globalSendingCheckbox!: SwitchComponent;
  currencyMaskConfig: any = { prefix: '$ ', thousands: ',', decimal: '.' };

  form = new FormGroup({
    "onPayingInvoicesHigherThan": new FormControl<boolean>(false, Validators.required),
    "onSendingInvoicesHigherThan": new FormControl<boolean>(false, Validators.required),
    "onSendingAllInvoices": new FormControl<boolean>(false, Validators.required),

    "payingInvoicesThreshold": new FormControl<number>(0, Validators.required),
    "sendingInvoicesThreshold": new FormControl<number>(0, Validators.required),
  }, );

  private settings$?: Subscription;
  private changes$?: Subscription;
  private role$?: Subscription;
  canEdit = false;

  constructor(private currencyPipe: CurrencyPipe, private store$: Store) { }

  ngOnInit(): void {
    this.role$ = this.store$.pipe(select(selectRole)).subscribe(role => {
      this.canEdit = role == Role.Admin || role == Role.Director;
      if (!this.canEdit)
        this.form.disable()
    })
    this.changes$ = this.form.valueChanges.pipe(
      debounceTime(1000)
      ).subscribe(x => {
        const model:ApprovalSettingsModel = {
          onSendingAllInvoices: x.onSendingAllInvoices!,
          onPayingInvoicesHigherThan: x.onPayingInvoicesHigherThan!,
          onSendingInvoicesHigherThan: x.onSendingInvoicesHigherThan!,
          payingInvoicesThreshold: x.payingInvoicesThreshold ?? 0,
          sendingInvoicesThreshold: x.sendingInvoicesThreshold ?? 0,
        }

      this.onSubmit(model);
    });

    this.store$.dispatch(loadApprovalSettings());
  }

  onSubmit(model:ApprovalSettingsModel) {
    this.store$.dispatch(updateApprovalSettings({model: model}));
  }

  setPayingCheckbox(state: boolean) { }

  setSendingCheckbox(state: boolean) {
    const globalState = !state;

    if (state && this.globalSendingCheckbox.checked)
      this.globalSendingCheckbox.setValue(globalState);
  }

  setGlobalCheckbox(state: boolean) {
    const childState = !state;

    if (state && this.sendingCheckbox.checked)
      this.sendingCheckbox.setValue(childState);
  }

  ngOnDestroy(): void {
    this.settings$?.unsubscribe();
    this.changes$?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.settings$ = this.store$.select(selectApprovalSettings)
      .subscribe(x => {
        if (x) {
          this.form.patchValue({
            payingInvoicesThreshold: x.payingInvoicesThreshold,
            sendingInvoicesThreshold: x.sendingInvoicesThreshold,
            onSendingInvoicesHigherThan: x.onSendingInvoicesHigherThan,
            onSendingAllInvoices: x.onSendingAllInvoices,
          }, {emitEvent: false});

          this.payingCheckbox.setValue(x.onPayingInvoicesHigherThan, false);
          this.sendingCheckbox.setValue(x.onSendingInvoicesHigherThan, false);
          this.globalSendingCheckbox.setValue(x.onSendingAllInvoices, false);
        }
      });
  }
}
