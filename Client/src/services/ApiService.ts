import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { environment } from 'src/environments/environment';
import { AuthService } from './AuthService';
import { PubSubService } from './PubSubService';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private pubsubService: PubSubService,
    private consts: CONSTS
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
    const TOKEN = '';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${TOKEN}`);
    const httpOptions = {
      headers,
      params
    };
    return this.httpClient.get<any>(`${environment.api.baseURL}${url}`, httpOptions);
  }

  public post(url: string, body: any, params?: any): Observable<any> {
    const TOKEN = '';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${TOKEN}`);
    const httpOptions = {
      headers,
      params
    };
    return this.httpClient.post<any>(`${environment.api.baseURL}${url}`, body, httpOptions);
  }
}
