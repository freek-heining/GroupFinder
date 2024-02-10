import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, tap, throwError } from "rxjs";
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
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getUserById$(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.userUrl + '/id/' + id)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
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

