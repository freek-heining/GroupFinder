import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticateService } from "../services/authenticate.service";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticateService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.authService.isAuthenticated$().subscribe()) {
      const tokenizedReq: HttpRequest<unknown> = req.clone({ headers: req.headers.set('Authorization', `Bearer ${sessionStorage.getItem(environment.localAccessToken)}`) });
      return next.handle(tokenizedReq);
    }

    return next.handle(req); 
  }
}
