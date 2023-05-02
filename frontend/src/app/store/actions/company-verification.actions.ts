import { createAction, props } from '@ngrx/store';



export const verificationValueChanged = createAction(
    '[Verification component] switch toggled',
    props<{toggleValue:boolean}>(),
)

export const verifyCompany = createAction(
    '[Address component] verify company',
    props<{companyId:number}>(),
)

export const verifyCompanySuccess = createAction(
    '[Address component] verifitication successfull'
)

export const openVerifyCompanyResultDialog = createAction(
    'Address companent verification result',
    props<{isSuccess:boolean}>()
)
export const verifyCompanyFailure = createAction(
    '[Address component] verification failure',
    props<{errors:any}>(),
)

