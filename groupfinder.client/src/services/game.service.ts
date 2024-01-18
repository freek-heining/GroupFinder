import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { IGame } from "../interfaces/IGame";

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private gameUrl = environment.gameApiUrl;

  constructor(private http: HttpClient) { }

  getGames$(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gameUrl)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
    );
  }

  getGame$(id: number): Observable<IGame> {
    return this.http.get<IGame>(this.gameUrl + '/' + id)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createGame$(game: IGame): Observable<IGame> {
    return this.http.post<IGame>(this.gameUrl, game)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateGame$(game: IGame): Observable<IGame> {
    return this.http.put<IGame>(this.gameUrl, game)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteGame$(game: IGame): Observable<IGame> {
    return this.http.put<IGame>(this.gameUrl + '/' + game.gameId, game)
      .pipe(
        tap(data => console.log('All', JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string = '';
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
