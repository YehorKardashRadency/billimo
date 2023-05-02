import { createAction, props } from '@ngrx/store';
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { InvoiceDetailsData } from '../../models/InvoiceDetailsData';

export class ArchivedInvoicesActions {

    public static setLoading = createAction('[Archived invoices] Set Loading', props<{ loading: boolean }>());
    public static setCompanyFilter = createAction(
        '[Current invoice component] set filter by company in archived',
        props<{ filter: number | string | undefined }>()
    )
    public static getArchivedInvoices = createAction(
        '[Archived invoices] get',
    )
    
    public static getArchivedInvoicesSucess = createAction(
        '[Archived invoices] get archived invoices success',
        props<{invoices:Invoice[]}>(),
    )
    
    public static getArhivedInvoicesFailure = createAction(
        '[Archived invoices] get archived invoices failure',
        props<{error:any}>(),
    )
    public static addToExportedInvoices = createAction(
        '[Archived invoices] add to exported invoices',
        props<{exportedInvoice:Invoice}>()
    )
    
    public static removeFromExportedInvoices = createAction(
        '[Archived invoices] remove from exported invoices',
        props<{excludedInvoice:Invoice}>(),
    )
    
    public static addInvoicesToExported = createAction(
        '[Archived invoices] add invoices to exported',
        props<{exportedInvoices:Invoice[]}>()
    )
    
    public static removeAllInvoicesFromExported = createAction(
        '[Archived invoices] remove all from exported invoices',
    )
    
    public static exportInvoices = createAction(
        '[Archived invoices] export invoices'
    )
    public static openArchivedInvoiceDialog = createAction('[Dialog Component] Open  archived invoice',
    props<{ data: InvoiceDetailsData }>());
}


