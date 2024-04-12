import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable, catchError, switchMap, take, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ApplicationPaths } from "./api-authorization.constants";
import { AuthenticateService } from "../services/authenticate.service";

@Injectable({
  providedIn: 'root'
})

// Handles general errors, API errors and token refreshing on a 401
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticateService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Inside error.interceptor');

          let errorMessage = '';

          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${error.error.message}`;
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;

            switch (error.status) {
              case 401: // Unauthorized
                // Don't refresh on login or refresh 401's
                if (request.url.includes('login') || request.url.includes('refresh')) { 
                  console.log('URL includes login or refresh, so skip refresh process...');
                  break;
                }

                // Start refresh process here
                return this.handleRefresh(next, request, errorMessage);
              case 403: // Forbidden
                console.log('Error 403, navigating to unauthorized...');
                this.navigateTo(ApplicationPaths.Unauthorized, true);
                break;
            }
          }
          console.error(errorMessage);
          return throwError(() => errorMessage);
        })
      )
  }

  private handleRefresh(next: HttpHandler, request: HttpRequest<unknown>, errorMessage: string): Observable<HttpEvent<unknown>> {
    return this.authService.refreshBearer$()
      .pipe(
        take(1),
        switchMap((refreshed: boolean) => {
          const accessToken: string | null = sessionStorage.getItem(environment.sessionAccessToken);

          if (refreshed && accessToken) {
            return next.handle(this.addAuthenticationToken(request, accessToken));
          } else {
            throw 'Refresh failed!';
          }
        }),
        catchError(err => {
          console.error(`Logging out, error: ` + err);
          this.navigateTo(ApplicationPaths.LogOut, true);
          return throwError(() => errorMessage);
        })
      );
  }

  private addAuthenticationToken(request: HttpRequest<unknown>, accessToken: string) {
    return request.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken } });
  }

  private navigateTo(path: string, replaceUrl: boolean) {
    this.router.navigateByUrl(path, { replaceUrl: replaceUrl, state: { local: true } })
      .then(nav => {
        console.log('Navigate succes: ' + nav); // true if navigation is successful
      }, err => {
        console.error('Navigate failure: ' + err) // when there's an error
      });
  }
}
