import { createAction, props } from "@ngrx/store";
import { CompanyModel } from "src/app/shared/models/CompanyModel";

/* LOAD COMPANIES */
export const loadCompanies = createAction(
  '[Shell Component] Load Companies',
  props<{ searchString?: string }>()
);

export const loadCompaniesSuccess = createAction(
  '[Company Effect] Load Companies Success',
  props<{ companies: CompanyModel[] }>()
);

export const loadCompaniesFailure = createAction(
  '[Company Effect] Load Companies Failure',
  props<{ error: any }>()
);

/* LOAD COMPANY */
export const loadCompany = createAction(
  '[Shell Component] Load Company',
);

export const loadCompanySuccess = createAction(
  '[Company Effect] Load Company Success',
  props<{ company: CompanyModel}>()
);

export const loadCompanyFailure = createAction(
  '[Company Effect] Load Company Failure',
  props<{ error: any }>()
);
