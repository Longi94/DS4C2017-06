import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { User } from "./model/user";
import { of } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { HttpUtils } from "./util/http-utils";
import { AccessToken } from "./model/access-token";

const USER_KEY = 'authenticatedUser';
const ACCESS_TOKEN = 'accessToken';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  private authUrl = environment.apiBaseUrl + '/Clients';

  private loginSource = new Subject<User>();
  private logoutSource = new Subject();

  login$ = this.loginSource.asObservable();
  logout$ = this.logoutSource.asObservable();

  login(username: string, password: string, callback: Function, fail: Function) {
    let user: User = new User(username, password);

    this.httpClient.post<AccessToken>(this.authUrl + "/login", user).subscribe(accessToken => {
      if (!accessToken) {
        return fail("login failed");
      }

      localStorage.setItem(USER_KEY, JSON.stringify({username: user.username}));
      localStorage.setItem(ACCESS_TOKEN, JSON.stringify(accessToken));
      this.loginSource.next(user);
      callback();
    }, error => {
      fail(error.error.message || error.error.error.message);
    });
  }

  logout(): Observable<any | null> {
    return this.httpClient.post(this.authUrl + "/logout", null).pipe(
      tap(() => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ACCESS_TOKEN);
        this.logoutSource.next();
      }),
      catchError(HttpUtils.handleError("logout"))
    );
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(this.authUrl + "/register", user);
  }

  static authenticated(): boolean {
    return localStorage.getItem(USER_KEY) != null;
  }

  static getAuthenticatedUser(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  static getAuthorizationHeader() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return accessToken == null ? null : JSON.parse(accessToken).id;
  }
}
