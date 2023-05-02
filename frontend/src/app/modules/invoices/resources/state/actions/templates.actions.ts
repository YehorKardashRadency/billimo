import { createAction, props } from "@ngrx/store";
import { Invoice } from "../../models/Invoice";
import { InvoiceDetailsData } from "../../models/InvoiceDetailsData";

export class TemplatesActions {
  public static setLoading = createAction('[Templates component] Set Loading', props<{ loading: boolean }>())
  public static getTemplates = createAction(
      '[Templates component] get templates'
  );
  public static getTemplatesSuccess = createAction(
      '[Templates component] get templates success',
      props<{ templates: Invoice[] }>()
  );
  public static getTemplatesFailure = createAction(
      '[Templates component] get templates failure',
      props<any>()
  );
  public static deleteTemplate = createAction(
      '[Templates component] delete template',
      props<{ id: number }>()
  )

  public static deleteSuccess = createAction(
      '[Templates component] delete template success',
      props<{ id: number }>(),
  )

  public static deleteFailure = createAction(
      '[Templates component] delete template failure',
      props<{ error: any }>(),
  )
  public static openTemplateDialog = createAction('[Dialog Component] Open template from "Templates" tab',
      props<{ data: InvoiceDetailsData }>());
}


