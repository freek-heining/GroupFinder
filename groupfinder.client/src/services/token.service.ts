import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { IRefreshModel } from "../interfaces/IRefreshModel";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  constructor(private http: HttpClient) { }

  getRefreshToken$(id: string): Observable<IRefreshModel> {
    console.log('Getting refresh token...');

    if (!id) {
      throwError(() => 'No userId found!');
    }

    return this.http.get<IRefreshModel>(environment.tokenApiUrl + '/' + id)
      .pipe(
        tap(data => data ?
          console.log('Got refresh token:', JSON.stringify(data)) :
          console.log('No refresh token found for id: ' + id))
    );
  }

  setRefreshToken$(refreshInfo: IRefreshModel): Observable<boolean> {
    console.log('Setting refresh token...');

    if (!refreshInfo.id) {
      throwError(() => 'No userId found!');
    }

    return this.http.post<boolean>(environment.tokenApiUrl, refreshInfo)
      .pipe(
        tap(setSuccess => setSuccess ?
          console.log('Refresh token set:', JSON.stringify(refreshInfo.refreshToken)) :
          console.log('Setting refresh token failed or already set...'))
      );
  }

  deleteRefreshToken$(id: string): Observable<boolean> {
    console.log('Deleting refresh token...');

    if (!id) {
      throwError(() => 'No userId found!');
    }

    return this.http.post<boolean>(environment.tokenApiUrl + '/' + id, {})
      .pipe(
        tap(data => data ?
          console.log('Refresh token deleted for id:', JSON.stringify(id)) :
          console.log('Deleting refresh token failed...'))
      );
  }
}
