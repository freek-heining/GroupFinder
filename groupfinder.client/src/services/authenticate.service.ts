import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { EMPTY, Observable, concatMap, map, of, switchMap, take, tap, throwError } from "rxjs";
import { IAuthenticatedResponse } from "../interfaces/IAuthenticatedResponse";
import { ILoginModel } from "../interfaces/ILoginModel";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
import { IUser } from "../interfaces/IUser";

@Injectable({ providedIn: 'root' })

export class AuthenticateService {
  public isRefreshing: boolean = false; // FLAG to prevent multple refreshes at the same time

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private http: HttpClient) { }

  public login(credentials: ILoginModel): Observable<boolean> { // Login means: Getting/Setting bearer, setting user Id and refresh token
    return this.getBearer$(credentials) // get bearer (IAuthenticatedResponse$)
      .pipe(
        take(1),
        tap(authenticatedResponse => this.setAuthDataInLocal(authenticatedResponse)), // Set token and expiry time in local storage
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

  public refreshBearer$(): Observable<boolean> { 
    const userId: string | null = localStorage.getItem(environment.localUserId);
    
    if (!userId) {
      console.error('No user id found for refreshing!');
      return of(false);
    }
    else if (this.isRefreshing) {
      return EMPTY; // Returns complete message obervable when already busy with a refresh (does nothing)
    }
    else {
      this.isRefreshing = true; // FLAG
      console.log('Trying to refresh bearer...');
      return this.tokenService.getRefreshToken$(userId) // Get user's refreshtoken from db (IRefreshModel)
        .pipe(
          take(1),
          switchMap(refreshInfo => this.http.post<IAuthenticatedResponse>(environment.refreshApiUrl, refreshInfo) // Get new bearer (IAuthenticatedResponse) by using the refresh model (IRefreshModel)
            .pipe(
              take(1),
              tap(authenticatedResponse => {
                this.setAuthDataInLocal(authenticatedResponse); // Set new token + expiry time in local storage (IAuthenticatedResponse)
                console.log('Got refreshed bearer: ', JSON.stringify(authenticatedResponse));
              }) 
            )
          ),
          switchMap(authenticatedResponse => this.tokenService.setRefreshToken$({ id: userId, refreshToken: authenticatedResponse.refreshToken }) // Set new refresh token in db and return bool (IRefreshModel)
            .pipe(
              take(1),
              tap(() => this.isRefreshing = false) // FLAG
            )
          )
        );
    }
  }

  private setAuthDataInLocal(response: IAuthenticatedResponse): void {
    console.log('Setting auth data...');
    localStorage.setItem(environment.localAccessToken, response.accessToken);
    localStorage.setItem(environment.localAccessTokenExpiry, this.calculateTokenExpiry(response.expiresIn)); // secs since Unix Epoch
  }

  private calculateTokenExpiry(tokenExpiry: string): string { // Convert time in seconds to secs since Unix Epoch
    console.log('Calculating token expiry...');
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(tokenExpiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    console.log('currentTimeInSeconds: ' + currentTimeInSeconds);
    console.log('expiryTimeInSeconds: ' + expiryTimeInSeconds);
    return expiryTimeInSeconds.toString();
  }

  private getBearer$(credentials: ILoginModel): Observable<IAuthenticatedResponse> { // Performs the API login and retrieves bearer
    console.log('Getting bearer...');

    return this.http.post<IAuthenticatedResponse>(environment.loginApiUrl, credentials)
      .pipe(
        tap(authenticatedResponse => authenticatedResponse ? console.log('Got bearer: ', JSON.stringify(authenticatedResponse)) : console.log('Failed to get bearer...'))
      );
  }
}
