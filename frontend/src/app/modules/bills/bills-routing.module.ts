import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsComponent } from './bills.component';
import { ReceivedBillsComponent } from './components/received-bills/received-bills.component';
import { RequestsBillsComponent } from './components/requests-bills/requests-bills.component';
import { SentBillsComponent } from './components/sent-bills/sent-bills.component';

export const sendBillPath="sent";
export const receiveBillPath="received";
export const requestsBillPath="requests";
const routes: Routes = [
  {
    path: '',
    redirectTo: 'sent',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BillsComponent,
    children: [
      { path: 'sent', component: SentBillsComponent },
      { path: 'received', component: ReceivedBillsComponent},
      { path: 'requests', component: RequestsBillsComponent}
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsRoutingModule {}
