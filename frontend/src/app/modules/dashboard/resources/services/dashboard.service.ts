import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Actions} from "../models/actions.model";
import {Notification} from "../models/notification.model";
import {PaginatedList} from "../../../../shared/models/PaginatedList";
import {Transaction} from "../models/transaction.model";
import {ApiService} from "../../../../core/resources/services/api.service";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public getActions$(): Observable<Actions> {
    return this.get<Actions>('/gateway/QuickActions');
  }

  public getNotifications$(page: number, take: number, searchString: string, isDescending: boolean, days?: number)
    : Observable<PaginatedList<Notification>> {
      //const baseUrl = "https://localhost:7086/";
      //const path = "api/notifications";
      const path = "/gateway/notifications";

      let queryParams = new HttpParams()
        .append("searchString", searchString)
        .append("isDescending", isDescending)
        .append("page", page)
        .append("take", take)

      if (days)
        queryParams = queryParams.append("days", days)

      return this.http.get<PaginatedList<Notification>>(`${this.baseUrl}${path}`, {params: queryParams});
  }

  public getTransactions$(page: number, take: number, searchString: string, isDescending: boolean, days?: number)
    : Observable<PaginatedList<Transaction>> {
    //const baseUrl = "https://localhost:7239";
    //const path = "/api/Transactions";
    const path = "/gateway/transactions";

    let queryParams = new HttpParams()
      .append("searchString", searchString)
      .append("isDescending", isDescending)
      .append("page", page)
      .append("take", take)

    if (days)
      queryParams = queryParams.append("days", days)

    return this.http.get<PaginatedList<Transaction>>(`${this.baseUrl}${path}`, {params: queryParams});
  }
}
