import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user: User;

  constructor(
    private fireAuth: AngularFireAuth
  ) { }

  public init(): Observable<User> {
    return this.fireAuth.user.pipe(
      map(x => { this.user = x; return x; })
    );
  }

  public loggedIn(): boolean {
    if (this.user) {
      return true;
    }
    return false;
  }

  public getUser(): Observable<User> {
    return this.fireAuth.user;
  }

  public async loginWithGoogle(): Promise<boolean> {
    let cred: auth.UserCredential;
    try {
      cred = await this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider());
    } catch (error) {
      console.log(`login failed with error: ${error}`);
      return false;
    }
    if (cred) {
      console.log(`logged in user: ${cred.user.displayName}`);
      this.user = cred.user;
      return true;
    } else {
      return false;
    }
  }

  public async loginWithFacebook(): Promise<boolean> {
    let cred: auth.UserCredential;
    try {
      cred = await this.fireAuth.signInWithPopup(new auth.FacebookAuthProvider());
    } catch (error) {
      console.log(`login failed with error: ${error}`);
      return false;
    }
    if (cred) {
      console.log(`logged in user: ${cred.user.displayName}`);
      this.user = cred.user;
      return true;
    } else {
      return false;
    }
  }
}
