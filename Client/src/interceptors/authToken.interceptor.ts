import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(
    private fireAuth: AngularFireAuth
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.fireAuth.idToken.pipe(
      first(),
      mergeMap(TOKEN => {
        let newHeaders = new HttpHeaders();
        newHeaders = newHeaders.set('Authorization', `Bearer ${TOKEN}`);
        const newRequest = req.clone({
          headers: newHeaders
        });
        return next.handle(newRequest);
      })
    );
  }
}
