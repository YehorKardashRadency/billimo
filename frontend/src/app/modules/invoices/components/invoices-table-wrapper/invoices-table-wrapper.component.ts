import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoices-table-wrapper',
  templateUrl: './invoices-table-wrapper.component.html',
  styleUrls: ['./invoices-table-wrapper.component.scss']
})
export class InvoicesTableWrapperComponent implements OnInit {
  @Input() handleArchivedInvoices = false;
  @Input() isLoading = false;
  @Input() title = '';
  @Input() subTitle = '';

  constructor() {
    
   }

  ngOnInit(): void {
  }

}
