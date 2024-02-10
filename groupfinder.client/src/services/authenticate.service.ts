import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subscription, catchError, concatMap, map, of, take, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
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
    private tokenService: TokenService,
    private userService: UserService) { }

  public login(credentials: ILoginModel): Observable<boolean> {
    return this.getBearer$(credentials) // get bearer (IAuthenticatedResponse$)
      .pipe( 
        take(1),    
        concatMap(bearer => this.userService.getUserByEmail$(credentials.email) // get user (IUser$)
          .pipe( 
            tap(() => this.setAuthData(bearer)), // set token and expiry time
            tap((user) => localStorage.setItem(environment.localUserId, user.id)), // set user id
            map(user => { return { bearer, user } }), // returns an anonymous object with 2 properties
            catchError(this.handleError)
          )
        ),
        concatMap(({ bearer, user }) => this.tokenService.setRefreshToken$({ id: user.id, refreshToken: bearer.refreshToken }) // save refresh token to current user in db, {} = JS object destructuring (IRefreshModel)
          .pipe(
            take(1),
            tap(setRefreshSuccess => {
              setRefreshSuccess ? console.log('Login successful') : console.log('Login NOT successful');
            }),
            catchError(this.handleError)
          )
        ) 
      )
  }

  public isAuthenticated$(): Observable<boolean> { // Checks if token in local storage and not expired
    const accessToken: string | null = sessionStorage.getItem(environment.sessionAccessToken);
    const tokenExpired: boolean = this.tokenExpired();
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionTokenExpiry);

    if (!accessToken) { // No token stored = Not logged in previously or logged off
      console.log('user is NOT authenticated');
      return of(false);
    }
    else if (expiryTimeInSeconds && tokenExpired) { // If expiry time AND expired, try refreshing
      return this.tryRefreshingBearer$()
        .pipe(
          take(1),
          tap(refreshSuccess => refreshSuccess ? console.log('token refreshed: user IS authenticated') : console.log('token expired: user is NOT authenticated')),
          catchError(this.handleError)
        );
    }
    else { // If expiry time AND NOT expired = Logged in normally
      console.log('user IS authenticated');
      return of(true);
    }
  }

  private tryRefreshingBearer$(): Observable<boolean> {
    const userId: string | null = localStorage.getItem(environment.localUserId);

    if (!userId) {
      return of(false);
    }
    else {
      return this.tokenService.getRefreshToken$(userId) // Get user's refreshtoken from db (IRefreshResponse)
        .pipe(
          take(1),
          concatMap(refreshToken => this.http.post<IAuthenticatedResponse>(this.authUrl + '/refresh', refreshToken) // Get new bearer (IAuthenticatedResponse)
            .pipe(
              tap(authResponse => {
                console.log('Refreshing bearer...', JSON.stringify(authResponse));
                this.setAuthData(authResponse); // Set new bearer (IAuthenticatedResponse)
              }),
              map(authResponse => { return authResponse ? true : false })
            )
          ),
          catchError(this.handleError)
        );
    }
  }

  private setAuthData(response: IAuthenticatedResponse): void {
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

    if (!expiryTimeInSeconds) 
      return true; // No expiryTime stored counts as true/expired
    else {
      console.log('expiryTimeInSeconds = true');
      const currentTime: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
      const expiryTime: number = parseInt(expiryTimeInSeconds);
      console.log('currentTime: ' + currentTime);
      console.log('expiryTime: ' + expiryTime);
      return currentTime >= expiryTime;
    }
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

