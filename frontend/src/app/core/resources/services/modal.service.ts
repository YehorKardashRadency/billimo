import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";

@Injectable({
  providedIn: ModalService
})
export class ModalService {
  dialogRef!: MatDialogRef<any>;
  constructor(public dialog: MatDialog) { }

  openModal<T, R=any, U=any>(
    component: ComponentType<T>,
    props: R
  ): void {
    this.dialogRef = this.dialog.open(component, { data: props });
  }
}
