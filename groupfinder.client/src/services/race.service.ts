import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment";
import { IRace } from "../interfaces/IRace";

@Injectable({ providedIn: 'root' })

export class RaceService {
  constructor(private http: HttpClient) { }

  getRaces$(): Observable<IRace[]> {
    return this.http.get<IRace[]>(environment.raceApiUrl)
      .pipe(
        tap(races => races.forEach(race => {
          console.log('getRaces$', JSON.stringify(race.raceId + ': ' + race.name))
        }))
      );
  }

  getRace$(id: number): Observable<IRace> {
    return this.http.get<IRace>(environment.raceApiUrl + '/' + id)
      .pipe(
        tap(race => console.log('getRace$', JSON.stringify(race.raceId + ': ' + race.name)))
      );
  }
}
