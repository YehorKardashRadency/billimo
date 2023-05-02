import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Notification, NotificationOperationsModel} from "../../resources/models/notification.model";

@Component({
  selector: 'app-notifications-item',
  templateUrl: './notifications-item.component.html',
  styleUrls: ['./notifications-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsItemComponent implements OnInit {

  @Input() notification?: Notification;

  constructor() { }

  ngOnInit(): void { }

  getIconByOperation(type: NotificationOperationsModel): string {
    switch (type){
      case NotificationOperationsModel.InvoiceReceived: return "assets/images/icons/invoice_recv.svg";
      case NotificationOperationsModel.InvoiceSent: return "assets/images/icons/invoice_sent.svg";
      default: return "assets/images/icons/approval.svg";
    }
  }

}
