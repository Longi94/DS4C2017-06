import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { User } from "./model/user";
import { catchError } from "rxjs/operators";
import { HttpUtils } from "./util/http-utils";

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  private userUrl = environment.apiBaseUrl + '/User';

  getAll() {
    return this.http.get<User[]>(this.userUrl);
  }

  getById(id: number) {
    return this.http.get<User>(this.userUrl + '/' + id).pipe(catchError(HttpUtils.handleError("GET User", null)));
  }

  create(user: User) {
    return this.http.post(this.userUrl, user).pipe(catchError(HttpUtils.handleError("POST User", null)));
  }

  update(user: User) {
    return this.http.put(this.userUrl + '/' + user.id, user).pipe(catchError(HttpUtils.handleError("PUT User", null)));
  }

  delete(id: number) {
    return this.http.delete(this.userUrl + '/' + id).pipe(catchError(HttpUtils.handleError("DELETE User", null)));
  }
}
