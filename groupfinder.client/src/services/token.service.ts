import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { IRefreshModel } from "../interfaces/IRefreshModel";
import { EncryptDecryptService } from "./encrypt-decrypt.serivce";

@Injectable({ providedIn: 'root' })

export class TokenService {
  constructor(private http: HttpClient,
              private encryptDecryptService: EncryptDecryptService) { }

  getRefreshToken$(id: string): Observable<IRefreshModel> {
    console.log('Getting refresh token...');

    if (!id) {
      throwError(() => 'No userId found!');
    }

    return this.http.get<IRefreshModel>(environment.tokenApiUrl + '/' + id)
      .pipe(
        tap(data => data ?
          console.log('Got encrypted refresh token: ' + data.refreshToken) :
          console.log('No encrypted refresh token found for id: ' + id)
        ),
        map(data => {
          return { id: data.id, refreshToken: this.encryptDecryptService.decryptUsingAES256(data.refreshToken) }
        })
    );
  }

  setRefreshToken$(refreshInfo: IRefreshModel): Observable<boolean> {
    console.log('Setting refresh token...');

    if (!refreshInfo.id) {
      throwError(() => 'No userId found!');
    }

    const refreshModel: IRefreshModel = { id: refreshInfo.id, refreshToken: this.encryptDecryptService.encryptUsingAES256(refreshInfo.refreshToken) };

    return this.http.post<boolean>(environment.tokenApiUrl, refreshModel)
      .pipe(
        tap(setSuccess => setSuccess ?
          console.log('Refresh token encrypted and set: ' + refreshModel.refreshToken) :
          console.log('Setting refresh token failed for id: ' + refreshModel.id))
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
          console.log('Refresh token deleted for id: ', JSON.stringify(id)) :
          console.log('Deleting refresh token failed for id: ' + id))
      );
  }
}
