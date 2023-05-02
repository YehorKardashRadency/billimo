import {Injectable} from "@angular/core";
import {ApiService} from "../../../../../../core/resources/services/api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApprovalSettingsModel} from "../models/approval-settings.model";

@Injectable({
  providedIn: 'root'
})
export class ApprovalSettingsService extends ApiService{

  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getSettings$():Observable<ApprovalSettingsModel>{
    return this.get('/gateway/company/approvalsettings');
  }

  updateSettings$(model: ApprovalSettingsModel):Observable<any> {
    return this.put('/gateway/company/approvalsettings', model);
  }
}
