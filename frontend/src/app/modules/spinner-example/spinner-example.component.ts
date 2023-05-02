import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { hideSpinner, showSpinner } from 'src/app/store/actions/spinner.actions';

@Component({
  selector: 'app-spinner-example',
  template: `
  <app-header 
        [title]="'Dashboard'" 
        [icon]="'assets/images/icons/dashboard.svg'"
        ></app-header>
    <p>
      spinner-example works!
    </p>
  `,
  styles: [
  ]
})
export class SpinnerExampleComponent implements AfterContentInit {

  constructor(private store: Store<AppState>) {
    this.store.dispatch(showSpinner());
  }
  ngAfterContentInit(): void {
   
    setTimeout(() => this.store.dispatch(hideSpinner()), 2500);
  }
}
