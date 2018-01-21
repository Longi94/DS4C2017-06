import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { User } from "./model/user";
import { of } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import { tap } from "rxjs/operators";

const USER_KEY = 'authenticatedUser';

@Injectable()
export class AuthService {

  constructor() {
  }

  private loginSource = new Subject<User>();
  private logoutSource = new Subject();

  login$ = this.loginSource.asObservable();
  logout$ = this.logoutSource.asObservable();

  login(username: string, password: string): Observable<User> {
    let user: User = {
      id: 1,
      password: password,
      username: username
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return of(user).pipe(
      tap(user => this.loginSource.next(user)),
    );
  }

  logout() {
    localStorage.removeItem(USER_KEY);
    this.logoutSource.next();
  }

  static authenticated(): boolean {
    return localStorage.getItem(USER_KEY) != null;
  }

  static getAuthenticatedUser(): User {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
}
