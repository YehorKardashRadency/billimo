import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ApiService} from "src/app/core/resources/services/api.service";
import {DocumentsModel} from "../models/documents.model";
import {Observable} from "rxjs";
import {ResponseDuplicateStatusModel} from "../models/ResponseDuplicateStatus.model";

@Injectable({
  providedIn: "root",
})
export class DocumentsService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getDocuments$(): Observable<DocumentsModel> {
    return this.get<DocumentsModel>("/gateway/company/documents");
  }

  updateDocuments$(documents: DocumentsModel): Observable<any> {
    return this.put("/gateway/company/documents", documents);
  }

  getCheckDuplicateEmail$(email: string) {
    return this.get<ResponseDuplicateStatusModel>("/gateway/company/check-on-duplicate-email", {email});
  }
}
