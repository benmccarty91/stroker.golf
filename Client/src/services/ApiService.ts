import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient) { }

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
