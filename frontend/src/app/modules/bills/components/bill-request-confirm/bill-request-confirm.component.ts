import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonConfig } from 'src/app/shared/button/button.component';

export interface RequestConfirmData {
  title: string;
  primaryButton: ButtonConfig;
  declineButton: ButtonConfig;
}

@Component({
  selector: 'app-bill-request-confirm',
  templateUrl: './bill-request-confirm.component.html',
  styleUrls: ['./bill-request-confirm.component.scss']
})
export class BillRequestConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestConfirmData) { }

  ngOnInit(): void { }

}
