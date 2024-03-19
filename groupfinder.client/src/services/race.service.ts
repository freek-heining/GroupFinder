import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment";
import { IRace } from "../interfaces/IRace";

@Injectable({
  providedIn: 'root'
})

export class RaceService {
  private raceUrl = environment.raceApiUrl;

  constructor(private http: HttpClient) { }

  getRaces$(): Observable<IRace[]> {
    return this.http.get<IRace[]>(this.raceUrl)
      .pipe(
        tap(races => races.forEach(race => {
          console.log('getRaces$', JSON.stringify(race.raceId + ': ' + race.name))
        }))
      );
  }

  getRace$(id: number): Observable<IRace> {
    return this.http.get<IRace>(this.raceUrl + '/' + id)
      .pipe(
        tap(race => console.log('getRace$', JSON.stringify(race.raceId + ': ' + race.name)))
      );
  }
}
