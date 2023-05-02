import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsItemComponent } from './notifications/notifications-item/notifications-item.component';
import { TransactionsItemComponent } from './transactions/transactions-item/transactions-item.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as DashboardReducer from './resources/state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './resources/state/dashboard.effects';
import { NotificationsModalSearchComponent } from './notifications/notifications-modal-search/notifications-modal-search.component';
import {
  TransactionsModalSearchComponent
} from "./transactions/transactions-modal-search/transactions-modal-search.component";
import { PlaceholderComponent } from './placeholder/placeholder.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    QuickActionsComponent,
    QuickActionsComponent,
    TransactionsComponent,
    NotificationsComponent,
    NotificationsItemComponent,
    TransactionsItemComponent,
    NotificationsModalSearchComponent,
    TransactionsModalSearchComponent,
    PlaceholderComponent,
  ],
  imports: [
    StoreModule.forFeature(
      DashboardReducer.dashboardFeatureKey,
      DashboardReducer.reducer
    ),
    EffectsModule.forFeature([DashboardEffects]),
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class DashboardModule {}
