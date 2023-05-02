import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { InvoiceDetailsComponent } from '../../components/invoice-details/invoice-details.component';
import { Invoice } from '../models/Invoice';

export interface DialogData {
  invoice: Invoice,
  buyer: CompanyModel
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modalRef!: MatDialogRef<InvoiceDetailsComponent, DialogData>;
  constructor(public dialog: MatDialog) {
  }

  hide() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  show(component: any, data: any) {
    this.modalRef = this.dialog.open(component, {
      data: data,
    });
  }

}
