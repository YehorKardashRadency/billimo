import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store';
import { Bill } from '../../resources/models/bill.model';
import { PopupDataModel } from '../../resources/models/PopupDataModel';
import { getSelectedBill } from '../../resources/state/bill/bill.selectors';

@Component({
  selector: 'app-bill-popup',
  templateUrl: './bill-popup.component.html',
  styleUrls: ['./bill-popup.component.scss']
})
export class BillPopupComponent implements OnInit {
  bill$!: Observable<Bill | null>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupDataModel,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.bill$ = this.store.pipe(select(getSelectedBill));
  }
}
