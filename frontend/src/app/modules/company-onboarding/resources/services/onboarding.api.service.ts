import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "src/app/core/resources/services/api.service";
import { CompanyRegistrationForm } from '../models/CompanyRegistrationForm';
import { CompanyValidationForm } from '../models/CompanyValidationForm';
import { FormValidationError } from '../models/ValidationErrors';


@Injectable({
    providedIn: "root"
  })
export class OnboardingService extends ApiService{
    constructor(http: HttpClient) {
      super(http);
    }

    ValidateRegistrationForm(form: CompanyValidationForm): Observable<FormValidationError | null>{
        return this.post<FormValidationError | null>("/gateway/Onboarding/validate-company-form/", form);
    }

    RegisterCompany(form: CompanyRegistrationForm, params = new HttpParams()): Observable<FormValidationError | null>{
        return this.post<FormValidationError | null>("/gateway/Onboarding/register-company/", form, params);
    }
}
