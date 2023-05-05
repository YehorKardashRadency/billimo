import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import * as https from 'https'
@Injectable({
  providedIn: "root"
})
export class ApiService {
  baseUrl: string = environment.baseUrl;
  httpsAgent: any;
  constructor(
    protected http: HttpClient
  ) {
  }

  get<T>(path: string, params?: any) {
    return this.http.get<T>(`${this.baseUrl}${path}`, {params});
  }

  post<T>(path: string, entity: any, params?: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<T>(`${this.baseUrl}${path}`, entity, {headers: headers, params });
  }

  put<T>(path: string, entity?: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put<T>(`${this.baseUrl}${path}`, entity, {headers: headers});
  }

  delete<T>(path: string, options: {} = {}) {
    return this.http.delete<T>(`${this.baseUrl}${path}`, options);
  }
}
