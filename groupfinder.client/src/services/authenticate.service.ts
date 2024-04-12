import { Injectable, OnDestroy } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, Subscription, concatMap, map, of, switchMap, take, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { IUser } from "../interfaces/IUser";

@Injectable({
  providedIn: 'root'
})

export class AuthenticateService implements OnDestroy {
  private sub!: Subscription;
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private http: HttpClient) { }

  public login(credentials: ILoginModel): Observable<boolean> { // Login means: Getting/Setting bearer, setting user Id and refresh token
    return this.getBearer$(credentials) // get bearer (IAuthenticatedResponse$)
      .pipe(
        take(1),
        tap(authenticatedResponse => this.setAuthDataInSession(authenticatedResponse)), // Set token and expiry time in Session storage
        concatMap((bearer: IAuthenticatedResponse) => this.userService.getUserByEmail$(credentials.email) // get current user for user's id later on (IUser$)
          .pipe(
            take(1),
            tap((user: IUser) => {
              if (!user.id) {
                throwError(() => 'No userId found!');
              }
              else
                localStorage.setItem(environment.localUserId, user.id); // store current user id for later use
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
      const accessToken: string | null = sessionStorage.getItem(environment.sessionAccessToken);
      const expiryTimeInSeconds: string | null = sessionStorage.getItem(environment.sessionAccessTokenExpiry);
      const accessTokenExpired: boolean = this.accessTokenExpired();

      console.log('Checking isAuthenticated$ true/false...');

      if (!accessToken) { // No token stored = Not logged in previously or logged off
        console.log('Token not found');
        return of(false).pipe(take(1));
      }
      else if (expiryTimeInSeconds && accessTokenExpired) { // If expiry time AND expired
        console.log('Token expired');
        return of(false).pipe(take(1));
      }
      else { // If access token AND NOT expired = Logged in normally
        console.log('Token ok');
        return of(true).pipe(take(1));
      }
  }

  // TODO: encrypt/decrypt refresh tokens in/from DB
  public refreshBearer$(): Observable<boolean> { 
    const userId: string | null = localStorage.getItem(environment.localUserId);

    if (!userId) {
      console.error('No user id found for refreshing!');
      return of(false);
    }
    else {
      console.log('Trying to refresh bearer...');
      return this.tokenService.getRefreshToken$(userId) // Get user's refreshtoken from db (IRefreshModel)
        .pipe(
          take(1),
          switchMap(refreshInfo => this.http.post<IAuthenticatedResponse>(environment.refreshApiUrl, refreshInfo) // Get new bearer (IAuthenticatedResponse) by using the refresh model (IRefreshModel)
            .pipe(
              take(1),
              tap(authenticatedResponse => {
                this.setAuthDataInSession(authenticatedResponse); // Set new token + expiry time in Session storage (IAuthenticatedResponse)
                console.log('Got refreshed bearer: ', JSON.stringify(authenticatedResponse));
              }) 
            )
          ),
          switchMap(authenticatedResponse => this.tokenService.setRefreshToken$({ id: userId, refreshToken: authenticatedResponse.refreshToken }) // Set new refresh token in db and return bool (IRefreshModel)
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

  ngOnDestroy() { this.sub.unsubscribe }
}
