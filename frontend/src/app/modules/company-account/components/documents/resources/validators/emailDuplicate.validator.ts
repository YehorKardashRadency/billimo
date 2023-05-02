import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from "@angular/forms";
import {DocumentsService} from "../services/documents.service";
import {map, Observable} from "rxjs";

export class EmailDuplicateValidator {
  static createValidator(documentsService: DocumentsService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {

      return documentsService.getCheckDuplicateEmail$(control.value).pipe(
        map(response => {
         return {emailDuplicate: response.isDuplicate};
        })
      );
    };
  }
}
