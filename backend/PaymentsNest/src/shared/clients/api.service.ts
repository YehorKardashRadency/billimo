import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  baseUrl: string;
  constructor(protected readonly http: HttpService) {}
  async get<T>(path: string, params?: any) {
    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${path}`, { params })
    );
  }

  async post<T>(path: string, entity: any, params?: any) {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    return firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${path}`, entity, {
        headers: headers,
        params,
      })
    );
  }

  async put<T>(path: string, entity?: any) {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    return firstValueFrom(
      this.http.put<T>(`${this.baseUrl}${path}`, entity, {
        headers: headers,
      })
    );
  }

  async delete<T>(path: string, options: any = {}) {
    return firstValueFrom(
      this.http.delete<T>(`${this.baseUrl}${path}`, options)
    );
  }
}
