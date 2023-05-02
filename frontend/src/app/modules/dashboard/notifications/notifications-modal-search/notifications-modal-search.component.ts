import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import * as DashboardReducer from "../../resources/state/dashboard.reducer";
import * as DashboardSelector from "../../resources/state/dashboard.selectors";
import {findNotifications} from "../../resources/state/dashboard.actions";
import {PaginatedList} from "../../../../shared/models/PaginatedList";
import {Notification} from "../../resources/models/notification.model";


@Component({
  selector: 'app-notifications-modal-search',
  templateUrl: './notifications-modal-search.component.html',
  styleUrls: ['./notifications-modal-search.component.scss']
})
export class NotificationsModalSearchComponent implements OnInit {
  notifications$?: Observable<PaginatedList<Notification> | null>;
  notificationsLoading$?: Observable<boolean>;

  days?: number = undefined;
  isDescending: boolean = true;
  searchString: string = "";
  take = 3;

  items: ({ isDescending: boolean; days?: number; title: string })[] = [
    {title: "From recent to latest", days: undefined, isDescending: true},
    {title: "From latest to recent", days: undefined, isDescending: false},
    {title: "1 Day", days: 1, isDescending: true},
    {title: "2 Days", days: 2, isDescending: true},
    {title: "Week", days: 7, isDescending: true},
    {title: "Month", days: 30, isDescending: true},
  ];

  constructor(private store: Store<DashboardReducer.State>) {}

  ngOnInit(): void {
    this.notifications$ = this.store.pipe(
      select(DashboardSelector.selectFoundNotifications),
    );

    this.newSearch("");
  }

  newSearch(input: string): void {
    this.searchString = input;

    this.store.dispatch(findNotifications({searchString: input, page: 1,
      take: this.take, isDescending: this.isDescending, days: this.days}));
  }

  toPage(page: number): void {
    this.store.dispatch(findNotifications({searchString: this.searchString, page: page,
      take: this.take, isDescending: this.isDescending, days: this.days}));
  }

  applySort($event: { isDescending: boolean; days?: number; title: string }) {
    this.days = $event.days;
    this.isDescending = $event.isDescending;

    this.newSearch(this.searchString);
  }
}
