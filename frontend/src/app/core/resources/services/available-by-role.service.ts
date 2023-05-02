import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable, of, tap } from 'rxjs';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { AppState } from 'src/app/store';
import { selectRole } from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AvailableByRoleService {

  constructor(private store: Store<AppState>) { }

  available(roles: Array<Role> | undefined | null): Observable<boolean> {
    if (!roles || roles.length === 0) {
      return of(true);
    }

    return this.store.pipe(
      select(selectRole),
      map((role) => roles.includes(role)
      )
    );
  }
}
