import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store';
import * as CoreActions from 'src/app/store/actions/core.actions';
import * as AuthSelectors from 'src/app/store/selectors/auth.selectors';
import { isSpinnerShowing } from 'src/app/store/selectors/spinner.selectors';
import { loadCompany } from 'src/app/store/actions/company.actions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, AfterViewChecked, OnDestroy {

  loading!: Observable<boolean>;
  isLoggedIn$!: Subscription;
  isLoggedIn: boolean | null = null;
  constructor(private store: Store<AppState>, private cdRef: ChangeDetectorRef) {

  }
  ngOnDestroy(): void {
    this.isLoggedIn$.unsubscribe();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }


  ngOnInit(): void {
    this.store.dispatch(CoreActions.coreGetCurrentUserInfo());
    this.loading = this.store.pipe(
      select(isSpinnerShowing))
    this.isLoggedIn$ = this.store.pipe(
      select(AuthSelectors.selectIsLoggedIn)
    ).subscribe(loggedIn => {
      
      this.isLoggedIn = loggedIn;
      if(this.isLoggedIn){
        this.store.dispatch(loadCompany());
      }
    });
  }
}
