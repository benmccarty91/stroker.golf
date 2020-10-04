import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CONSTS {
  public EVENTS = {
    AUTH_INIT: 'authServiceInitialized'
  };
}
