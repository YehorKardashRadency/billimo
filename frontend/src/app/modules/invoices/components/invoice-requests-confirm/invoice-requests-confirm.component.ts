import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonConfig } from 'src/app/shared/button/button.component';


export interface RequestConfirmData {
  title: string;
  primaryButton: ButtonConfig;
  declineButton: ButtonConfig;
}


@Component({
  selector: 'app-invoice-requests-confirm',
  templateUrl: './invoice-requests-confirm.component.html',
  styleUrls: ['./invoice-requests-confirm.component.scss']
})
export class InvoiceRequestsConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestConfirmData) { }

  ngOnInit(): void {
  }

}
