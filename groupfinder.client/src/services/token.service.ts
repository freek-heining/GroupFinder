import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { IRefreshModel } from "../interfaces/IRefreshModel";
import { IRefreshResponse } from "../interfaces/IRefreshResponse";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private tokenUrl = environment.tokenApiUrl;

  constructor(private http: HttpClient) { }

  getRefreshToken$(id: string): Observable<IRefreshResponse> {
    return this.http.get<IRefreshResponse>(this.tokenUrl + '/' + id)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  setRefreshToken$(refreshInfo: IRefreshModel): Observable<string> {
    return this.http.post<string>(this.tokenUrl, refreshInfo)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteRefreshToken$(id: string): Observable<string> {
    return this.http.post<string>(this.tokenUrl + '/', id)
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
