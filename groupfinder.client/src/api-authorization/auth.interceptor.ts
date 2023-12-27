import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticateService } from "../services/authenticate.service";

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticateService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = localStorage.getItem("bearerToken");

    if (token && !this.authService.tokenExpired(token)) {
      const tokenizedReq: HttpRequest<unknown> = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
      return next.handle(tokenizedReq);
    }

    return next.handle(req); 
  }
}
