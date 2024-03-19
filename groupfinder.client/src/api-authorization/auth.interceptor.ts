import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, share } from "rxjs";
import { AuthenticateService } from "../services/authenticate.service";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

// When authenticated: during http requests, the interceptor clones the request and attaches the bearer in the header 'Authorization' 
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticateService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Inside auth.interceptor');

    const authenticated$ = this.authService.isAuthenticated$().pipe(share()); // share not working... remove?

    if (authenticated$.subscribe()) {
      const tokenizedReq: HttpRequest<unknown> = request.clone({ headers: request.headers.set('Authorization', `Bearer ${sessionStorage.getItem(environment.sessionAccessToken)}`) });
      return next.handle(tokenizedReq);
    }

    return next.handle(request); // If unauthorized, pass along unedited http request
  }
}
