import { TemplatesActions } from './../actions/templates.actions';
import { createReducer, on } from '@ngrx/store';
import { InvoicesActions } from '../actions/invoices.actions';
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { ArchivedInvoicesActions } from '../actions/archived-invoices.actions';
export interface State {
    templates: Invoice[],
    templatesLoading: boolean,
    error: any,
}
export const templatesFeatureKey = 'templates'
export const initialState: State = {
    templates: [],
    templatesLoading: true,
    error: null
}

export const reducer = createReducer(
    initialState,
    on(TemplatesActions.setLoading, (state, action) => {
        return {
            ...state,
            templatesLoading:action.loading
        };
    }),
    on(TemplatesActions.getTemplatesSuccess, (state, action) => {
        return {
            ...state,
            templates:action.templates,
            templatesLoading: false,
            error: null,
        };
    }),
    on(TemplatesActions.getTemplatesFailure, (state, action) => {
        return {
            ...state,
            templates: [],
            error: action.error,
        };
    }),
    on(TemplatesActions.deleteSuccess, (state, action) => {
        return {
            ...state,
            templates: state.templates.filter(x => x.id != action.id),
            error: null,
        }
    }),
);
