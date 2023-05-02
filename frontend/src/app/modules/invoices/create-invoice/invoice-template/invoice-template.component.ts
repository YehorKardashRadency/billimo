import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CompanyModel} from 'src/app/shared/models/CompanyModel';
import {InvoiceItemModel} from 'src/app/modules/invoices/resources/models/InvoiceItemModel';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.scss']
})
export class InvoiceTemplateComponent implements OnInit {
  @Input() title!: string;
  @Input() invoiceNumber!: number;
  @Input() invoiceDate: Date = new Date();
  @Input() buyer?: CompanyModel;
  @Input() items!: InvoiceItemModel[];
  @Input() currency!: string;
  @Input() notes!: string;
  @Input() total!: string;
  @Input() seller$!: Observable<CompanyModel | null>;




  constructor() {
  }

  ngOnInit() {
  }

  ExportPdf() {
    const option = {
      margin:[0,0.72,0,0],
      filename: 'invoice.pdf',
      image: {type: 'svg'},
      html2canvas: {scale:2},
      jsPDF: {unit:'in', format:'letter',orientation: 'portrait'},
    };

    const content= document.getElementById('export-pdf-id');
    html2pdf().from(content).set(option).save();
  }
}
