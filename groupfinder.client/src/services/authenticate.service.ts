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

  public getToken(credentials: ILoginModel): Observable<IAuthenticatedResponse> {
    return this.http.post<IAuthenticatedResponse>(this.authUrl + '/login', credentials) /*<IAuthenticatedResponse> = generic parameter*/
      .pipe(
        tap(data => console.log('Token', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  public isAuthenticated(): boolean { // Checks if token in local storage and not expired
    const token: string | null = localStorage.getItem(environment.localToken);
    const expires: string | null = localStorage.getItem(environment.localTokenExpiry);

    if (!token || !expires) {
      console.log('user is NOT authenticated');
      return false;
    }

    if (this.tokenExpired(expires)) {
      console.log('user is NOT authenticated');
      return false;
    }

    console.log('user IS authenticated');
    return true;
  }

  public isAuthenticatedObservable(): Observable<boolean> { // Checks if token in local storage and not expired
    const token: string | null = localStorage.getItem(environment.localToken);
    const expires: string | null = localStorage.getItem(environment.localTokenExpiry);

    if (!token || !expires) {
      console.log('user is NOT authenticated');
      return of(false);
    }

    if (this.tokenExpired(expires)) {
      console.log('user is NOT authenticated');
      return of(false);
    }

    console.log('user IS authenticated');
    return of(true);
  }

  public tokenExpired(expires: string): boolean {
    const currentTime = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiry = parseInt(expires);
    return currentTime >= expiry;
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

