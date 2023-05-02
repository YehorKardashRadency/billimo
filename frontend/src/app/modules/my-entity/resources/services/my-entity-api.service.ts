import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IMyEntity } from '../models/my-entity.model';
import { ApiService } from 'src/app/core/resources/services/api.service';

@Injectable({
  providedIn: MyEntityService,
})
export class MyEntityService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getData(id: string): Observable<IMyEntity | null> {
    return this.get<IMyEntity>(`/gateway/first/${id}`);
  }
}
