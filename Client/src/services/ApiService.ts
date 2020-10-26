import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, first, map, mergeMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from './PubSubService';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private fireAuth: AngularFireAuth
  ) { }

  // private registerNewUser(): void {
  //     // const newUser = {
  //     //   id: user.uid,
  //     //   name: user.displayName,
  //     //   email: user.email,
  //     //   photoUrl: user.photoURL
  //     // };
  // }

  public get(url: string, params?: any): Observable<any> {
    const httpOptions = {
      params
    };
    return this.httpClient.get<any>(url, httpOptions);
  }

  public post(url: string, body: any, params?: any): Observable<any> {
    const httpOptions = {
      params
    };
    return this.httpClient.post<any>(url, body, httpOptions);
  }
}
