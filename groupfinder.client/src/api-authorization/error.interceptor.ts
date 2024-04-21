import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable, catchError, switchMap, take, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ApplicationPaths } from "./api-authorization.constants";
import { AuthenticateService } from "../services/authenticate.service";

@Injectable({ providedIn: 'root' })

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
              case 401: // 401 Unauthorized
                if (request.url.includes('login') && error.error?.detail === 'LockedOut') { // Locked out! Show this to user and tell to wait
                  errorMessage = `Server returned code: ${error.status}, error detail is: ${error.error?.detail}, error message is: ${error.message}`;
                  break;
                }
                else if (request.url.includes('login')) { // Login failure 401
                  console.log('URL includes "login", so skip refresh process');
                  break;
                } else if (request.url.includes('refresh')) { // Refresh token expired 401
                  console.log('URL includes "refresh", so skip refresh process, logout and reset');
                  this.navigateTo(ApplicationPaths.LogOut, true);
                }
                else { // Other 401's
                  return this.handleRefresh(next, request, errorMessage); // Start refresh process here for all other 401 cases
                }
                break;
              case 403: // 403 Forbidden
                console.log('Error 403, navigating to unauthorized...');
                this.navigateTo(ApplicationPaths.Unauthorized, true);
                break;
            }
          }
          console.error('errorMessage: ' + errorMessage);
          return throwError(() => errorMessage);
        })
      )
  }

  // Performs the refresh and request forwarding for all 401 errors, EXCEPT for "login" and "refresh" 401 errors
  private handleRefresh(next: HttpHandler, request: HttpRequest<unknown>, errorMessage: string): Observable<HttpEvent<unknown>> { 
    console.log('Refresh started from error.interceptor');
    return this.authService.refreshBearer$()
      .pipe(
        take(1),
        switchMap((refreshed: boolean) => {
          const accessToken: string | null = localStorage.getItem(environment.localAccessToken);

          if (refreshed && accessToken) {
            return next.handle(this.addAuthenticationToken(request, accessToken));
          } else {
            console.error(`errorMessage: ` + errorMessage);
            this.navigateTo(ApplicationPaths.LogOut, true);
            return throwError(() => errorMessage);
          }
        })
      );
  }

  private addAuthenticationToken(request: HttpRequest<unknown>, accessToken: string) {
    return request.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken } });
  }

  private navigateTo(path: string, replaceUrl: boolean) {
    this.router.navigateByUrl(path, { replaceUrl: replaceUrl, state: { local: true } })
      .then(nav => {
        console.log('Navigate from error.interceptor succes: ' + nav); // true if navigation is successful
      }, err => {
        console.error('Navigate from error.interceptor failure: ' + err) // when there's an error
      });
  }
}
