import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { IUser } from "../interfaces/IUser";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.userApiUrl;
  constructor(private http: HttpClient) { }

  getUserByEmail$(email: string): Observable<IUser> {
    return this.http.get<IUser>(this.userUrl + '/' + email)
      .pipe(
        map(user => ({ // mapping to clean up User entity from backend
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          homeTown: user.homeTown,
          refreshToken: user.refreshToken
        })),
        tap(user => console.log('getUserByEmail$', JSON.stringify(user)))
      );
  }

  getUserById$(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.userUrl + '/id/' + id)
      .pipe(
        map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          homeTown: user.homeTown,
          refreshToken: user.refreshToken
        })),
        tap(user => console.log('getUserById$', JSON.stringify(user)))
      );
  }
}

