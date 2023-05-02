import { Component, OnInit } from '@angular/core';
import * as fromProductActions from './state/my-entity.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import * as MyEntitySelector from './state/my-entity.selectors';
import { Observable } from 'rxjs';
import { IMyEntityDetail } from './resources/models/my-entity-detail.model';
import { IMyEntity } from './resources/models/my-entity.model';

// Example of smart component (container) - has dependency on Store
@Component({
  selector: 'app-my-entity',
  templateUrl: './my-entity.component.html',
  styleUrls: ['./my-entity.component.scss'],
})
export class MyEntityComponent implements OnInit {
  detail$?: Observable<IMyEntityDetail | undefined>;
  data$?: Observable<IMyEntity | null>;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.data$ = this.store.pipe(select(MyEntitySelector.selectData));
    this.detail$ = this.store.pipe(select(MyEntitySelector.selectDetail));
    this.store.dispatch(
      fromProductActions.loadMyEntity({ id: '1' })
    );
  }
}
