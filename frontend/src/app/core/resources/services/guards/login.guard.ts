import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, Observable, of, take } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/resources/services/auth.service';
import { AppState } from 'src/app/store';
import * as AuthSelectors from 'src/app/store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanActivateChild {

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!this.authService.isLogIn()) {
      this.router.navigateByUrl("/");
      return of(false);
    }
    return of(true);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.authService.isLogIn()) {
      if (state.url == '/') {return of(this.router.createUrlTree(['/dashboard']));}
    }
    return of(true)
  }
}
