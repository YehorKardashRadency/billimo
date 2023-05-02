import { Component, OnInit } from '@angular/core';
import {Notification} from "../resources/models/notification.model";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import * as DashboardReducer from "../resources/state/dashboard.reducer";
import * as DashboardSelector from "../resources/state/dashboard.selectors";
import * as fromDashboardActions from "../resources/state/dashboard.actions";
import {PaginatedList} from "../../../shared/models/PaginatedList";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications$?: Observable<PaginatedList<Notification> | null>;

  constructor(private store: Store<DashboardReducer.State>) {}

  ngOnInit() {
    this.notifications$ = this.store.pipe(select(DashboardSelector.selectNotifications));
    this.store.dispatch(fromDashboardActions.loadNotifications({ take: 3 }));
  }

  viewAll(){
    this.store.dispatch(fromDashboardActions.openNotificationsModal());
  }

}
