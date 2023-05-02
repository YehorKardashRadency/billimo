import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Transaction} from "../../resources/models/transaction.model";
import { TransactionStatus } from '../../resources/models/transactionStatus.model';

@Component({
  selector: 'app-transactions-item',
  templateUrl: './transactions-item.component.html',
  styleUrls: ['./transactions-item.component.scss']
})
export class TransactionsItemComponent implements OnInit, OnChanges {
  @Input() transaction?: Transaction;
  status:TransactionStatus = 0;
  statusName:string = '';
  statusType:string = 'negative';
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.status = this.transaction?.status ?? 0;
    this.statusName = this.getStatusName();
    if (this.status === TransactionStatus.Failed){
      this.statusType = 'negative';
    }
    if (this.status === TransactionStatus.Pending
      || this.status === TransactionStatus.Posted){
      this.statusType = 'yellow';
    }

    if (this.status === TransactionStatus.Settled){
      this.statusType = 'positive';
    }
  }

  ngOnInit(): void {
 
  }

  getStatusName():string{
    return TransactionStatus[this.status];
  }

}
