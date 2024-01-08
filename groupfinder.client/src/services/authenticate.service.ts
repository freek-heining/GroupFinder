import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, of, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private authUrl = environment.authApiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  public login(credentials: ILoginModel): boolean {
    this.getBearer(credentials).subscribe({
      next: (response: IAuthenticatedResponse) => {
        console.log('logging in...');
        this.setResponse(response);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; // get return url from query parameters or default to home page
        this.router.navigateByUrl(returnUrl, { replaceUrl: true }); // When true, navigates while replacing the current state in history.
      },
      error: err => {
        this.handleError(err);
        return false;
      }
    })
    return true;
  }

  public isAuthenticated$(): Observable<boolean> { // Checks if token in local storage and not expired
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.localTokenExpiry);

    if (!sessionStorage.getItem(environment.localAccessToken)) { // Not logged in previously or logged off
      console.log('user is NOT authenticated');
      return of(false);
    }
    else if (expiryTimeInSeconds && this.tokenExpired()) { // If expiry time and expired, try refreshing
      const refreshTokenSucces: boolean = this.tryRefreshingBearer();
      refreshTokenSucces ? console.log('token refreshed: user IS authenticated') : console.log('token expired: user is NOT authenticated');
      return of(refreshTokenSucces);
    }
    else { // Logged in normally
      console.log('user IS authenticated');
      return of(true);
    }
  }

  private tryRefreshingBearer(): boolean {
    const refreshToken: string | null = sessionStorage.getItem(environment.localRefreshToken);

    if (refreshToken) {
      this.http.post<IAuthenticatedResponse>(this.authUrl + '/refresh', refreshToken)
        .subscribe({
          next: (response: IAuthenticatedResponse) => {
            console.log('refreshing bearer...');
            this.setResponse(response);
            return true;
          },
          error: (err) => { // refresh token expired
            this.handleError(err);
            return false;
          }
        })
    }
    console.log('returning false refresh...');
    return false;
  }

  private setResponse(response: IAuthenticatedResponse) {
    sessionStorage.setItem(environment.localAccessToken, response.accessToken);
    sessionStorage.setItem(environment.localTokenExpiry, this.calculateTokenExpiry(response.expiresIn)); // secs since Unix Epoch
    sessionStorage.setItem(environment.localRefreshToken, response.refreshToken);
  }

  private calculateTokenExpiry(tokenExpiry: string): string {
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(tokenExpiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    console.log('currentTimeInSeconds: ' + currentTimeInSeconds);
    console.log('expiryTimeInSeconds: ' + expiryTimeInSeconds);
    return expiryTimeInSeconds.toString();
  }

  private tokenExpired(): boolean {
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.localTokenExpiry);

    if (expiryTimeInSeconds) {
      console.log('expiryTimeInSeconds = true');
      const currentTime: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
      const expiryTime: number = parseInt(expiryTimeInSeconds);
      console.log('currentTime: ' + currentTime);
      console.log('expiryTime: ' + expiryTime);
      return currentTime >= expiryTime;
    }

    return true;
  }

  private getBearer(credentials: ILoginModel): Observable<IAuthenticatedResponse> {
    return this.http.post<IAuthenticatedResponse>(this.authUrl + '/login', credentials) /*<IAuthenticatedResponse> = generic parameter*/
      .pipe(
        tap(data => console.log('Bearer', JSON.stringify(data))),
        catchError(this.handleError)
      );
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

