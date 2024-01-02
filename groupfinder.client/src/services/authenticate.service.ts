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
    const accessToken: string | null = localStorage.getItem(environment.localAccessToken);
    const expiryTimeInSeconds: string | null = localStorage.getItem(environment.localTokenExpiry);

    if (!accessToken || !expiryTimeInSeconds) {
      console.log('user is NOT authenticated');
      return false;
    }
    else if (this.tokenExpired(expiryTimeInSeconds)) {
      console.log('token expired: user is NOT authenticated');
      return false;
    }
    else {
      console.log('user IS authenticated');
      return true;
    }
  }

  public isAuthenticated$(): Observable<boolean> { // Checks if token in local storage and not expired
    const accessToken: string | null = localStorage.getItem(environment.localAccessToken);
    const expiryTimeInSeconds: string | null = localStorage.getItem(environment.localTokenExpiry);

    if (!accessToken || !expiryTimeInSeconds) {
      console.log('user is NOT authenticated');
      return of(false);
    }
    else if (this.tokenExpired(expiryTimeInSeconds)) {
      console.log('token expired: user is NOT authenticated');
      return of(false);
    }
    else {
      console.log('user IS authenticated');
      return of(true);
    }
  }

  private tokenExpired(expiryTimeInSeconds: string): boolean {
    const currentTime = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTime = parseInt(expiryTimeInSeconds);
    console.log('currentTime: ' + currentTime);
    console.log('expiryTime: ' + expiryTime);
    return currentTime >= expiryTime;
  }

  public calculateTokenExpiry(tokenExpiry: string): string {
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(tokenExpiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    console.log('currentTimeInSeconds: ' + currentTimeInSeconds);
    console.log('expiryTimeInSeconds: ' + expiryTimeInSeconds);
    return expiryTimeInSeconds.toString();
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

