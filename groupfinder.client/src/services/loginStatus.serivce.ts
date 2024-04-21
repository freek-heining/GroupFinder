import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { BehaviorSubject } from "rxjs";
import { AuthenticateService } from "./authenticate.service";
import { IUser } from "../interfaces/IUser";
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })

export class LoginStatusService {
  public isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public authenticatedUserSubject$ = new BehaviorSubject<IUser | null>(null);
  public currentUserId: string | undefined;

  constructor(
    private authService: AuthenticateService,
    private userService: UserService) {
    this.syncAuthenticatedStatus();
  }

  public syncAuthenticatedStatus(): void { // Checks if token in local storage and not expired
    const accessToken: string | null = localStorage.getItem(environment.localAccessToken);
    const expiryTimeInSeconds: string | null = localStorage.getItem(environment.localAccessTokenExpiry);
    const accessTokenExpired: boolean = this.accessTokenExpired();
    const userId: string | null = localStorage.getItem(environment.localUserId);

    console.log('Inside syncAuthenticatedStatus()');

    if (!accessToken) { // No token stored = Not logged in previously or logged off
      console.log('Token not found');
      this.isAuthenticatedSubject$.next(false);
      this.syncSignedInUserStatus$(null);
    }
    else if (expiryTimeInSeconds && accessTokenExpired && userId) { // If expiry time AND expired AND user id
      console.log('Token expired, trying refresh...');
      this.authService.refreshBearer$().subscribe({
        next: (succes: boolean) => {
          if (succes) {
            this.syncSignedInUserStatus$(userId); // only sync user when refresh success
            console.log('Refresh completed');
          }
          this.isAuthenticatedSubject$.next(succes);
        }
      });
    }
    else if (accessToken && userId && !accessTokenExpired) { // If access token AND user id AND NOT expired = Logged in normally
      console.log('Token ok');
      this.syncSignedInUserStatus$(userId);
      this.isAuthenticatedSubject$.next(true);
    }
  }

  private syncSignedInUserStatus$(userId: string | null): void {
    if (userId === null) {
      this.authenticatedUserSubject$.next(null);
    }
    else if (userId !== this.currentUserId) { // Only get and emit user from db when not already done previously
      this.userService.getUserById$(userId).subscribe({
        next: (user: IUser) => {
          this.authenticatedUserSubject$.next(user);
          this.currentUserId = userId;
        },
        complete: () => console.log('Emitted user with id: ' + userId)
      });
    } 
  }

  private accessTokenExpired(): boolean {
    console.log('Checking token expiry...');
    const expiryTimeInSeconds: string | null = localStorage.getItem(environment.localAccessTokenExpiry);

    if (!expiryTimeInSeconds)
      return true; // No expiryTime stored counts as true/expired
    else {
      const currentTime: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
      const expiryTime: number = parseInt(expiryTimeInSeconds);
      return currentTime >= expiryTime;
    }
  }
}
