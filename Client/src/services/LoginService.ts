import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private loggedIn = false;

  constructor() { }

  public LoggedIn(): boolean {
    return this.loggedIn;
  }
}
