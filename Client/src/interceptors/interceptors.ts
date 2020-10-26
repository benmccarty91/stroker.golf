import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './authToken.interceptor';
import { BaseUrlInterceptor } from './baseUrl.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}
];
