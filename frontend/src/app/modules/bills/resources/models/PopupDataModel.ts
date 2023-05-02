import { Observable } from "rxjs";
import { ButtonConfig } from "src/app/shared/button/button.component";
import { Bill } from "./bill.model";

export interface PopupDataModel{
  title: string,
  billId: number,
  primaryButton?: ButtonConfig,
  secondaryButton?: ButtonConfig,
  declineButton?: ButtonConfig,
}
