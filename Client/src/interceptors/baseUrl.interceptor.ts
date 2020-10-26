import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const oldUrl = req.url;
    const newUrl = `${environment.api.baseURL}${oldUrl}`;
    const newRequest = req.clone({
      url: newUrl
    });
    return next.handle(newRequest);
  }
}
