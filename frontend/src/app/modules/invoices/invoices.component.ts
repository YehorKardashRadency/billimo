import { templatesLengthSelector } from './resources/state/selectors/templates.selectors';
import { TemplatesActions } from './resources/state/actions/templates.actions';
import { Subscription } from 'rxjs';
import { selectRole } from './../../store/selectors/auth.selectors';
import { Observable, take } from 'rxjs';
import { currentInvoicesLengthSelector, regularInvoicesLengthSelector, requestsInvoicesLengthSelector } from './resources/state/selectors/invoices.selectors';
import { select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import {ButtonConfig} from "../../shared/button/button.component";
import { InvoicesActions } from './resources/state/actions/invoices.actions';
import { ArchivedInvoicesActions } from './resources/state/actions/archived-invoices.actions';
import { Role } from '../auth/resources/models/Role';
import { showSpinner } from 'src/app/store/actions/spinner.actions';
import { selectIsVerified } from 'src/app/store/selectors/company.selectors';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit, OnDestroy {

  primaryButton: ButtonConfig = { text: 'Create an Invoice', onClick: () => this.createInvoice(), disabled: false };
  secondaryButton: ButtonConfig = { text: 'Update an Invoice', onClick: () => alert("Click") };
  hasRequestsAccess = false;
  currentInvoicesLength$:Observable<number>;
  requestsInvoicesLength$:Observable<number>;
  regularInvoicesLength$: Observable<number>;
  templatesLength$:Observable<number>;
  roleSubscription: Subscription;
  companyVerifiedSubscription: Subscription;
  constructor(private router: Router, readonly store: Store<AppState>) {


    this.companyVerifiedSubscription = this.store.pipe(select(selectIsVerified)).subscribe(isVerified => {
      this.primaryButton.disabled = !isVerified;
      this.secondaryButton.disabled = !isVerified;
    })
    this.roleSubscription =this.store.pipe(select(selectRole), take(1)).subscribe(role => {
      this.hasRequestsAccess = role == Role.Admin || role == Role.Director;
    })

    this.currentInvoicesLength$ = this.store.pipe(select(currentInvoicesLengthSelector))
    this.requestsInvoicesLength$ = this.store.pipe(select(requestsInvoicesLengthSelector))
    this.templatesLength$ = this.store.pipe(select(templatesLengthSelector))
    this.regularInvoicesLength$ = this.store.pipe(select(regularInvoicesLengthSelector))
   }
  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
    this.companyVerifiedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(showSpinner());
    this.store.dispatch(InvoicesActions.getInvoices());
    this.store.dispatch(ArchivedInvoicesActions.getArchivedInvoices());
    this.store.dispatch(TemplatesActions.getTemplates());
  }

  newSearch(input: string) {
    this.store.dispatch(InvoicesActions.setSearchFilter({ query: input }));
  }
  createInvoice(){
    this.router.navigate(['/invoice/create']);
  }
}
