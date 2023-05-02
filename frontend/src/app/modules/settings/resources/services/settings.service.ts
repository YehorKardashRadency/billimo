import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "src/app/core/resources/services/api.service";
import {UserSettingsModel} from "../models/user-settings.model";
import {Observable} from "rxjs";
import {EmailSettingsModel} from "../models/email-settings.model";
import {ProfileSettingsModel} from "../models/profile-settings.model";
import {PasswordSettingsModel} from "../models/password-settings.model";

@Injectable({
  providedIn: "root",
})
export class SettingsService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getUserSettings$(): Observable<UserSettingsModel> {
    return this.get<UserSettingsModel>("/gateway/user/settings");
  }

  updateEmailSettings$(settings:EmailSettingsModel): Observable<any>{
    return this.put("/gateway/user/settings/email", settings)
  }

  updateProfileSettings$(settings:ProfileSettingsModel): Observable<any>{
    return this.put("/gateway/user/settings/profile", settings)
  }

  updatePasswordSettings$(settings:PasswordSettingsModel):Observable<any>{
    return this.put("/gateway/user/settings/password", settings)
  }
}
