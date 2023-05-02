import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, Observable, switchMap, tap, throwError } from "rxjs";
import { AppState } from "src/app/store";
import { LoginResult } from "../models/LoginResult";
import { AuthService } from "./auth.service";
import * as AuthAction from  'src/app/store/actions/auth.actions';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
    private store: Store<AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = this.addTokenHeader(req, this.authService.getToken() ?? "");
    return next.handle(authReq).pipe(
      catchError((error) => {
        if(error.status === 401 && this.authService.isLogIn()){
          return this.handleRefreshToken(req,next);
        }
        return throwError(() => error);
      })
    );
  }

  addTokenHeader(req: HttpRequest<any>, token:string):HttpRequest<any>{
    return req.clone({
      headers: req.headers.set('Authorization', "Bearer ".concat(token))
    });
  }

  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.refreshTokens().pipe(
        switchMap((data) => {
          this.authService.logIn(data);
          return next.handle(this.addTokenHeader(req,data.token))
        })
        ,catchError((error) => {
          this.store.dispatch(AuthAction.loginFailure({error: ""}));
          return throwError(() => error);
        })
    );
  }
}
