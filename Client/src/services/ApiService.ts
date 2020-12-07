import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient) { }

  public get<T>(url: string, params?: any): Observable<T> {
    const httpOptions = {
      params
    };
    return this.httpClient.get<T>(url, httpOptions);
  }

  public post(url: string, body: any, params?: any): Observable<any> {
    const httpOptions = {
      params
    };
    return this.httpClient.post<any>(url, body, httpOptions);
  }

  public delete(url: string, params?: any): Observable<any> {
    const httpOptions = {
      params
    };
    return this.httpClient.delete(url, httpOptions);
  }

  public put(url: string, body: any, params?: any): Observable<any> {
    const httpOptions = {
      params
    };
    return this.httpClient.put(url, body, httpOptions);
  }
}
