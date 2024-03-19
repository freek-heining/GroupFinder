import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
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
    console.log('Getting refresh token...');

    return this.http.get<IRefreshResponse>(this.tokenUrl + '/' + id)
      .pipe(
        tap(data => data ?
          console.log('Got refresh token:', JSON.stringify(data)) :
          console.log('No refresh token found for id: ' + id))
    );
  }

  setRefreshToken$(refreshInfo: IRefreshModel): Observable<boolean> {
    console.log('Setting refresh token...');

    return this.http.post<boolean>(this.tokenUrl, refreshInfo)
      .pipe(
        tap(setSuccess => setSuccess ?
          console.log('Refresh token set:', JSON.stringify(refreshInfo.refreshToken)) :
          console.log('Setting refresh token failed or already set...'))
      );
  }

  deleteRefreshToken$(id: string): Observable<boolean> {
    console.log('Deleting refresh token...');

    return this.http.post<boolean>(this.tokenUrl + '/', id)
      .pipe(
        tap(data => data ?
          console.log('Refresh token deleted for id:', JSON.stringify(id)) :
          console.log('Deleting refresh token failed...'))
      );
  }
}
