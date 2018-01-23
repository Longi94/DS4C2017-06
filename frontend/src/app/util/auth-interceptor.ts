import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = AuthService.getAuthorizationHeader();
    const currentUser = AuthService.getAuthenticatedUser();

    if (authHeader && currentUser) {
      const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
      return next.handle(authReq);
    }

    return next.handle(req);
  }

}
