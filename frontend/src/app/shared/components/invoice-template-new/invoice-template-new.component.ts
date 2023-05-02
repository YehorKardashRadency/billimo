import { Component, Input, OnInit } from '@angular/core';
import { CompanyDetails } from 'src/app/modules/bills/resources/models/company.model';
import { Invoice } from 'src/app/modules/bills/resources/models/invoice.model';

@Component({
  selector: 'app-invoice-template-new',
  templateUrl: './invoice-template-new.component.html',
  styleUrls: ['./invoice-template-new.component.scss']
})
export class InvoiceTemplateNewComponent implements OnInit {
  @Input() title!: string;
  @Input() invoice!: Invoice;
  @Input() buyer?: CompanyDetails;
  @Input() seller?: CompanyDetails;
  @Input() showTermsAndConditions: boolean = true;
  @Input() classList: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  companyAddress(company: CompanyDetails) {
    return `${company.street}, ${company.city}, ${company.zipCode}`;
  }
}
