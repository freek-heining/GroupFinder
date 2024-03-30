import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { EMPTY, Observable, Subscription, concatMap, map, of, take, tap } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { Router } from "@angular/router";
import { ApplicationPaths } from "../api-authorization/api-authorization.constants";
import { IUser } from "../interfaces/IUser";
import { IRefreshModel } from "../interfaces/IRefreshModel";

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService implements OnDestroy {
  private sub!: Subscription;
  private isRunning: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService) { } // this.handleError = this.handleError.bind(this) -> Otherwise this = undefined

  public login(credentials: ILoginModel): Observable<boolean> { // Login means: Getting/Setting bearer, setting user Id and refresh token
    return this.getBearer$(credentials) // get bearer (IAuthenticatedResponse$)
      .pipe( 
        take(1),
        tap(authenticatedResponse => this.setAuthDataInSession(authenticatedResponse)), // Set token and expiry time in Session storage
        concatMap((bearer: IAuthenticatedResponse) => this.userService.getUserByEmail$(credentials.email) // get current user for user's id later on (IUser$)
          .pipe(
            take(1),
            tap((user: IUser) => {
              localStorage.setItem(environment.localUserId, user.id!); // store current user id for later use
            }), 
            map(user => { return { bearer, user } }) // returns an anonymous object with 2 properties
          )
        ),
        concatMap(({ bearer, user }) => this.tokenService.setRefreshToken$({ id: user.id!, refreshToken: bearer.refreshToken }) // save refresh token to current user in db, {} = JS object destructuring (IRefreshModel)
          .pipe(
            take(1)
          )
        ) 
      )
  }

  public isAuthenticated$(): Observable<boolean> { // Checks if token in local storage and not expired. Used by interceptor, guard and async pipe
    if (!this.isRunning) { // Flag to limit 1 run max
      this.isRunning = true;

      const accessToken: string | null = sessionStorage.getItem(environment.sessionAccessToken);
      const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionAccessTokenExpiry);
      const accessTokenExpired: boolean = this.accessTokenExpired();

      console.log('Checking isAuthenticated$ true/false...');

      if (!accessToken) { // No token stored = Not logged in previously or logged off
        console.log('No token stored, user is NOT authenticated');
        this.isRunning = false;
        return of(false).pipe(take(1));
      }
      else if (expiryTimeInSeconds && accessTokenExpired) { // If expiry time AND expired, try refreshing
        console.log('Token expired, trying refresh...');
        return this.tryRefreshingBearer$()
          .pipe(
            take(1),
            tap(refreshSuccess => refreshSuccess ? (console.log('Bearer refreshed: user IS authenticated'), this.isRunning = false)
              : (console.log('Refreshing token failed: user is NOT authenticated'), this.isRunning = false, this.navigateToLogin()))
          );
      }
      else { // If access token AND NOT expired = Logged in normally
        console.log('Token found: user IS authenticated');
        this.isRunning = false;
        return of(true).pipe(take(1));
      }
    }
    else
      return EMPTY;
  }

  private tryRefreshingBearer$(): Observable<boolean> { 
    const userId: string | null = localStorage.getItem(environment.localUserId);

    if (!userId) {
      console.log('No user id found for refreshing!');
      return of(false);
    }
    else {
      console.log('Trying to refresh bearer...');
      return this.tokenService.getRefreshToken$(userId) // Get user's refreshtoken from db (IRefreshModel)
        .pipe(
          take(1),
          concatMap(refreshInfo => this.refreshBearer$(refreshInfo) // Get new bearer (IAuthenticatedResponse) by using the refresh token (IRefreshModel)
            .pipe(
              take(1),
              tap(authenticatedResponse => this.setAuthDataInSession(authenticatedResponse)) // Set new token and expiry time in Session storage (IAuthenticatedResponse)
            )
          ),
          concatMap(authenticatedResponse => this.tokenService.setRefreshToken$({ id: userId, refreshToken: authenticatedResponse.refreshToken }) // Set new refresh token (IRefreshModel)
            .pipe(take(1))
          )
        );
    }
  }

  private setAuthDataInSession(response: IAuthenticatedResponse): void {
    console.log('Setting auth data...');
    sessionStorage.setItem(environment.sessionAccessToken, response.accessToken);
    sessionStorage.setItem(environment.sessionAccessTokenExpiry, this.calculateTokenExpiry(response.expiresIn)); // secs since Unix Epoch
  }

  private calculateTokenExpiry(tokenExpiry: string): string { // Convert time in seconds to secs since Unix Epoch
    console.log('Calculating token expiry...');
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(tokenExpiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    console.log('currentTimeInSeconds: ' + currentTimeInSeconds);
    console.log('expiryTimeInSeconds: ' + expiryTimeInSeconds);
    return expiryTimeInSeconds.toString();
  }

  private accessTokenExpired(): boolean {
    console.log('Checking token expiry...');
    const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionAccessTokenExpiry);

    if (!expiryTimeInSeconds) 
      return true; // No expiryTime stored counts as true/expired
    else {
      const currentTime: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
      const expiryTime: number = parseInt(expiryTimeInSeconds);
      return currentTime >= expiryTime;
    }
  }

  private getBearer$(credentials: ILoginModel): Observable<IAuthenticatedResponse> { // Performs the API login and retrieves bearer
    console.log('Getting bearer...');

    return this.http.post<IAuthenticatedResponse>(environment.loginApiUrl, credentials)
      .pipe(
        tap(authenticatedResponse => authenticatedResponse ? console.log('Got bearer: ', JSON.stringify(authenticatedResponse)) : console.log('Failed to get bearer...'))
      );
  }

  private refreshBearer$(refreshInfo: IRefreshModel): Observable<IAuthenticatedResponse> {
    console.log('Refreshing bearer...');

    return this.http.post<IAuthenticatedResponse>(environment.refreshApiUrl, refreshInfo)
      .pipe(
        tap(authenticatedResponse => authenticatedResponse ? console.log('Got refreshed bearer: ', JSON.stringify(authenticatedResponse)) : console.log('Failed to refresh bearer...'))
      );
  }

  private navigateToLogin(): void {
    console.log('Navigating back to login...')
    this.router.navigateByUrl(ApplicationPaths.Login, { state: { local: true } })
      .then(nav => {
        console.log(nav); // true if navigation is successful
      }, err => {
        console.error(err) // when there's an error
      });
  }

  ngOnDestroy() { this.sub.unsubscribe }
}
