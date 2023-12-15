import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, of, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private authUrl = environment.authApiUrl;
  constructor(private http: HttpClient) { }

  getToken(credentials: ILoginModel): Observable<IAuthenticatedResponse> {
    return this.http.post<IAuthenticatedResponse>(this.authUrl, credentials)
      .pipe(
        tap(data => console.log('Token', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean { // Checks if token in local storage and not expired
    const token: string | null = localStorage.getItem("jwt");
    if (token && !this.tokenExpired(token)) {
      console.log('user is authenticated');
      return true;
    }
    console.log('user is NOT authenticated');
    return false;
  }

  isAuthenticatedObservable(): Observable<boolean> { // Checks if token in local storage and not expired
    const token: string | null = localStorage.getItem("jwt");
    if (token && !this.tokenExpired(token)) {
      console.log('user is authenticated');
      return of(true);
    }
    console.log('user is NOT authenticated');
    return of(false);
  }

  tokenExpired(token: string): boolean {
    const expiry = this.parseJwt(token).exp;
    const currentTime = Math.floor((new Date).getTime() / 1000);
    return currentTime >= expiry;
  }

  private parseJwt(token: string) {
  const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}

