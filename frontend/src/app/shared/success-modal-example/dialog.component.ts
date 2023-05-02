import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss','../button/button.component.scss']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<Dialog>,
  ) {
  }
}
