import { Component, OnInit } from '@angular/core';
import * as AuthSelectors from 'src/app/store/selectors/auth.selectors'
import { User } from 'src/app/modules/auth/resources/models/User';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Router } from '@angular/router';
import * as AuthActions from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  employeeName: string = 'employeeName';
  companyName: string = 'companyName';
  userInfo$:Observable<User|null> = new Observable();

  constructor(private store: Store<AppState>,
    private router: Router) { }

  ngOnInit() {
    this.userInfo$ = this.store.select(AuthSelectors.selectUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
