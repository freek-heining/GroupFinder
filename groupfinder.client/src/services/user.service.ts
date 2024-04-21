import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, map, take, tap } from "rxjs";
import { IUser } from "../interfaces/IUser";

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getUserByEmail$(email: string): Observable<IUser> {
    return this.http.get<IUser>(environment.userApiUrl + '/' + email)
      .pipe(
        take(1),
        map(user => ({ // mapping to clean up User entity from backend
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          hometown: user.hometown,
          email: user.email,
          password: '',
          biography: user.biography,
          refreshToken: user.refreshToken
        })),
        tap(user => console.log('getUserByEmail$', JSON.stringify(user)))
      );
  }

  getUserById$(id: string): Observable<IUser> {
    return this.http.get<IUser>(environment.userByIdApiUrl + id)
      .pipe(
        take(1),
        map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          hometown: user.hometown,
          email: user.email,
          password: '',
          biography: user.biography,
          refreshToken: user.refreshToken
        })),
        tap(user => console.log('getUserById$', JSON.stringify(user)))
      );
  }

  registerUser$(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(environment.registerApiUrl, user)
      .pipe(
        take(1),
        tap(user => console.log('registerUser$', JSON.stringify(user)))
      );
  }
}

