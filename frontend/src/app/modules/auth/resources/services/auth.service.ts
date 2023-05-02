import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/core/resources/services/api.service';
import { ACCES_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/app/modules/auth/resources/models/Tokens';
import { LoginResult } from '../models/LoginResult';
import { Observable } from 'rxjs';
import { TokenRequest } from '../models/TokenRequest';


@Injectable({
  providedIn: "root" //AuthModule,
})
export class AuthService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  getToken():string|null{
    return localStorage.getItem(ACCES_TOKEN_KEY);
  }

  isLogIn():boolean{
    return !!localStorage.getItem(ACCES_TOKEN_KEY) && !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  logIn(loginResult:LoginResult){
    localStorage.setItem(ACCES_TOKEN_KEY, loginResult.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginResult.refreshToken);
  }

  logOut(){
    localStorage.removeItem(ACCES_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  refreshTokens():Observable<LoginResult>{
    var token =  localStorage.getItem(ACCES_TOKEN_KEY);
    var refreshToken =  localStorage.getItem(REFRESH_TOKEN_KEY);
    var params:TokenRequest = {token:token??"", refreshToken:refreshToken??""};
    return this.post<LoginResult>("/gateway/refreshtoken", params);
  }

  deleteRefreshToken(): Observable<{ succeeded: boolean, errors: string[] }> {
    var refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    var httpOptions = { headers: new HttpHeaders({
      'RefreshToken': refreshToken!!
    })}
    return this.delete<{ succeeded: boolean, errors: string[] }>("/gateway/refreshtoken", httpOptions);
  }


  testGet(){
    this.get("/gateway/testauthorize").subscribe(data => console.log(data));
  }



}
