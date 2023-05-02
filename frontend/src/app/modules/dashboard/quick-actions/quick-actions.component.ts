import {Component, OnInit} from '@angular/core';
import {Actions} from "../resources/models/actions.model";
import {map, Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import * as DashboardReducer from "../resources/state/dashboard.reducer";
import * as DashboardSelector from "../resources/state/dashboard.selectors";
import * as fromDashboardActions from "../resources/state/dashboard.actions";
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { Role } from '../../auth/resources/models/Role';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit {
  actions$?: Observable<Actions | null>;
  hasRequestsAccess$!: Observable<boolean | null>;

  constructor(private store: Store<DashboardReducer.State> ) {
    this.hasRequestsAccess$ = this.store.pipe(select(selectRole)).pipe(
      map(role => role == Role.Admin || role == Role.Director)
    );
  }

  ngOnInit() {
    this.actions$ = this.store.pipe(select(DashboardSelector.selectActions));
    this.store.dispatch(fromDashboardActions.loadQuickActions());
  }
}
