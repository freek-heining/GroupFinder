import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AuthenticateService } from "../services/authenticate.service";

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticateService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken: string | null = sessionStorage.getItem(environment.sessionAccessToken);

    if (accessToken) {
      request = this.addAuthenticationToken(request, accessToken)
    }

    return next.handle(request);
  }

  private addAuthenticationToken(request: HttpRequest<unknown>, accessToken: string) {
    return request.clone({ setHeaders: {Authorization: 'Bearer ' + accessToken} });
  }
}
