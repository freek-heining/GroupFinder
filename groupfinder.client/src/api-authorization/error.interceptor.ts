import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, retry, throwError } from "rxjs";
import { Router } from "@angular/router";
import { ApplicationPaths } from "./api-authorization.constants";

@Injectable({
  providedIn: 'root'
})

// When 401 error on a http request, logoff and redirect to login
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req)
      .pipe(
        retry(1), // 2nd try just to make sure...
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
              case 401: // Login
                console.error('Error 401, navigating to login...');

                this.router.navigateByUrl(ApplicationPaths.Login, { state: { local: true } })
                  .then(nav => {
                    console.log(nav); // true if navigation is successful
                  }, err => {
                    console.error(err) // when there's an error
                  });
                break;
              case 403: // Forbidden
                console.error('Error 403, navigating to unauthorized...');

                this.router.navigateByUrl(ApplicationPaths.Unauthorized)
                  .then(nav => {
                    console.log(nav); // true if navigation is successful
                  }, err => {
                    console.error(err) // when there's an error
                  });
                break;
            }
          }
          console.error(errorMessage);
          return throwError(() => errorMessage);
        })
      )
  }
}
