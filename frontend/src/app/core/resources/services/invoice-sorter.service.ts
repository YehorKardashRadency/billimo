import { Injectable } from '@angular/core';
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';


export class InvoiceSorterService{
    static groupByCompany(invoices: Invoice[]) {
        let set:{[companyName:string]:number} = {};
        invoices.forEach(i => {
            if(set[i.company?.name ?? 'No company']){
                set[i.company?.name ?? 'No company']++;
            }
            else{
                set[i.company?.name ?? 'No company'] = 1;
            }
        });
        const map = new Map<string | CompanyModel,number>();
        for(let item in set){
            let invoice = invoices.filter(x => x.company?.name === item);
            if(invoice.length === 0){
                map.set('No company', set['No company']);
                continue;
            }

            map.set(invoice[0].company, set[invoice[0].company.name]);
        }
        return map;
    }
    
    static sortBy(invoices: Invoice[], sortByPropertyName: string) {
        let sortedInvoices:Invoice[] = [];
        switch(sortByPropertyName){
            case 'Name (A-Z)':
                    sortedInvoices = [...invoices]
                        .sort((a,b) => a.company?.name?.localeCompare(b.company?.name));
                break;
            case 'Name (Z-A)':
                sortedInvoices = [...invoices]
                .sort((a,b) => b.company?.name?.localeCompare(a.company?.name));
                break;
            case 'From recent to old':
                sortedInvoices = [...invoices]
                    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                break;
            case 'From old to recent':
                sortedInvoices = [...invoices]
                    .sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
                break;
            default:
                sortedInvoices = invoices;
        }

        return sortedInvoices;
    }

    public static filterByCompanyName(values:Invoice[], companyName:string){
        let result:Invoice[] = [];
        switch(companyName){
            case 'All companies':
                result = values;
                break;
            case 'No company':
                result = values.filter(x => x.company === null);
                break;
            default:
                result = values.filter(x => x.company?.name === companyName);
        }

        return result;
    }

}
