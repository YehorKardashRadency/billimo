import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { closeDialogs } from 'src/app/store/actions/dialog.actions';
import * as fromStore from 'src/app/store';
@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnInit {

  @Input() maxWidth?: string;
  @Input() minWidth: string = '300px';
  @Input() minHeight: string = '200px';
  @Input() maxHeight?: string;
  @Input() showClose = true;
  constructor(private store: Store<fromStore.AppState>) { }

  close() {
    this.store.dispatch(closeDialogs());
  }

  ngOnInit(): void {
  }

}
