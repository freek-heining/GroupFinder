import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subscription, catchError, concatMap, map, of, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService implements OnDestroy {
  private authUrl = environment.authApiUrl;
  private sub!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService) { }

  public login(credentials: ILoginModel): boolean {
    let loginSuccess: boolean = false;

    this.sub = this.getBearer$(credentials).pipe( //get bearer
      concatMap(bearer => this.userService.getUserByEmail$(credentials.email).pipe( // get user
        tap(() => this.setAuthData(bearer)), // set token and expiry time
        tap((user) => localStorage.setItem(environment.localUserId, user.id)), // set user id
        map(user => { return { bearer, user } })
      )),
      concatMap(({ bearer, user }) => this.tokenService.setRefreshToken$({ id: user.id, refreshToken: bearer.refreshToken })) // save refresh token to db, {} = JS object destructuring
    ).subscribe({
      complete: () => { loginSuccess = true }
    });

    if (loginSuccess) {
      console.log('Login successful');
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; // get return url from query parameters or default to home page
      this.router.navigateByUrl(returnUrl, { replaceUrl: true }); // When true, navigates while replacing the current state in history.
    }

    return loginSuccess;
  }

  public isAuthenticated$(): Observable<boolean> { // Checks if token in local storage and not expired
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionTokenExpiry);

    if (!sessionStorage.getItem(environment.sessionAccessToken)) { // Not logged in previously or logged off
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
    const userId: string | null = localStorage.getItem(environment.localUserId);
    let refreshSuccess: boolean = false;

    if (userId) {
      this.tokenService.getRefreshToken$(userId).pipe(
        concatMap(refreshToken => this.http.post<IAuthenticatedResponse>(this.authUrl + '/refresh', refreshToken).pipe(
          tap(data => console.log('Refreshing bearer...', JSON.stringify(data)))
        )),
        catchError(err => this.handleError(err))
      ).subscribe(response => {
        this.setAuthData(response);
        refreshSuccess = true;
      });
      return refreshSuccess;
    }
    else
      return refreshSuccess;
  }

  private setAuthData(response: IAuthenticatedResponse) {
    sessionStorage.setItem(environment.sessionAccessToken, response.accessToken);
    sessionStorage.setItem(environment.sessionTokenExpiry, this.calculateTokenExpiry(response.expiresIn)); // secs since Unix Epoch
  }

  private calculateTokenExpiry(tokenExpiry: string): string { // Convert time in seconds to secs since Unix Epoch
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(tokenExpiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    console.log('currentTimeInSeconds: ' + currentTimeInSeconds);
    console.log('expiryTimeInSeconds: ' + expiryTimeInSeconds);
    return expiryTimeInSeconds.toString();
  }

  private tokenExpired(): boolean {
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionTokenExpiry);

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

  private getBearer$(credentials: ILoginModel): Observable<IAuthenticatedResponse> { // Performs the API login and retrieves bearer
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

  ngOnDestroy() { this.sub.unsubscribe }
}

