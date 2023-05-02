import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertInvoiceNumber'
})
export class invoiceNumberPipe implements PipeTransform {
 transform(invoiceNumber: number,newInvoiceNumber="INV-") {
   return newInvoiceNumber.concat(invoiceNumber.toString());
 }
}
