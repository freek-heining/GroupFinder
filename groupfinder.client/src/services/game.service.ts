import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment";
import { IGame } from "../interfaces/IGame";

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private gameUrl = environment.gameApiUrl;

  constructor(private http: HttpClient) { }

  getGames$(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gameUrl + 'd')
      .pipe(
        tap(games => games.forEach(
          game => console.log('getGames$', JSON.stringify(game.gameId + ': ' + game.title))))
      );
  }

  getGame$(id: number): Observable<IGame> {
    return this.http.get<IGame>(this.gameUrl + '/' + id)
      .pipe(
        tap(game => console.log('getGame$', JSON.stringify(game.gameId + ': ' + game.title)))
      );
  }

  createGame$(game: IGame): Observable<IGame> {
    return this.http.post<IGame>(this.gameUrl, game)
      .pipe(
        tap(game => console.log('createGame$', JSON.stringify(game.gameId + ': ' + game.title)))
      );
  }

  updateGame$(game: IGame): Observable<IGame> {
    return this.http.put<IGame>(this.gameUrl, game)
      .pipe(
        tap(game => console.log('updateGame$', JSON.stringify(game.gameId + ': ' + game.title)))
      );
  }

  deleteGame$(game: IGame): Observable<IGame> {
    return this.http.put<IGame>(this.gameUrl + '/' + game.gameId, game)
      .pipe(
        tap(game => console.log('deleteGame$', JSON.stringify(game.gameId + ': ' + game.title)))
      );
  }
}
