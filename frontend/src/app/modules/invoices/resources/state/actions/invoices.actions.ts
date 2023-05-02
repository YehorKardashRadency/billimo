import { CompanyModel } from './../../../../../shared/models/CompanyModel';
import { props } from '@ngrx/store';
import { createAction } from '@ngrx/store';
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { InvoiceDetailsData } from '../../models/InvoiceDetailsData';
import { InvoiceFormData } from '../../models/InvoiceFormData';

export class InvoicesActions {
    public static setLoading = createAction('[Current invoice component] Set Loading', props<{ loading: boolean }>())
    public static getInvoices = createAction(
        '[Current invoice component] get current invoices'
    );
    public static getInvoicesSuccess = createAction(
        '[Current invoice component] get current invoices success',
        props<{ invoices: Invoice[] }>()
    );
    public static getInvoicesFailure = createAction(
        '[Current invoice component] get current invoices failure',
        props<any>()
    );
    public static setCompanyFilter = createAction(
        '[Current invoice component] set filter by company',
        props<{ filter: number | string | undefined }>()
    )

    public static sortByChanged = createAction(
        '[Current invoice component] sort by property changed',
        props<{ sortByPropertyName: string }>()
    )

    public static deleteInvoice = createAction(
        '[Current invoice component] delete invoice',
        props<{ invoiceId: number }>()
    )

    public static deleteSuccess = createAction(
        '[Current invoice component] delete invoice success',
        props<{ invoiceId: number }>(),
    )

    public static deleteFailure = createAction(
        '[Current invoice component failure',
        props<{ error: any }>(),
    )
    public static sendInvoice = createAction('[Invoice Effect] Send Invoice',
        props<{ invoice: Invoice }>());
    public static sendInvoiceSuccess = createAction('[Invoice Effect] Send Invoice Success',
        props<{ invoice: Invoice }>());
    public static sendInvoiceFailure = createAction('[Invoice Effect] Send Invoice Failure',
        props<{ error: any }>());
    public static openCurrentInvoiceDialog = createAction('[Dialog Component] Open invoice from "Current" tab',
        props<{ data: InvoiceDetailsData }>());
    public static archiveInvoice = createAction(
        '[Invoices Component] Archive Invoice',
        props<{ id: number }>()
    );

    public static archiveInvoiceSuccess = createAction(
        '[Invoice Effect] Archive Invoice Success'
    );

    public static archiveInvoiceFailure = createAction(
        '[Invoice Effect] Archive Invoice Failure',
        props<{ error: any }>()
    );

    public static acceptPendingInvoice = createAction('[Invoice Effect] Accept Pending Invoice',
        props<{ id: number }>());

    public static setSearchFilter = createAction('[Invoices component] Set Search filter',
        props<{ query: string }>());
    public static toggleSortOrder = createAction('[Invoices component] Toggle sort order');
    public static setSortProp = createAction('[Invoices component] Set sort prop', props<{prop:string}>());

    public static setInvoiceFormData = createAction('[Invoice effect] save invoice to edit',
    props<InvoiceFormData>());
    public static buyerCompanySelectionChanged = createAction('[Search company compoent] selection changed',
    props<{selectedCompany:CompanyModel}>());

  
}


