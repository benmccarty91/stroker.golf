import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageMap } from '@ngx-pwa/local-storage';
import { auth } from 'firebase';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from './PubSubService';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(
    private fireAuth: AngularFireAuth,
    private pubSubService: PubSubService,
    private consts: CONSTS,
    private storageService: StorageMap,
    private userService: UserService,
  ) { }

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
      this.pubSubService.$pub(this.consts.EVENTS.LOGGED_IN);
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
      this.pubSubService.$pub(this.consts.EVENTS.LOGGED_IN);
      return true;
    } else {
      return false;
    }
  }

  public async logOut(): Promise<void> {
    console.log('loging out user');
    this.storageService.clear().subscribe(() => { });
    await this.fireAuth.signOut();
    this.pubSubService.$pub(this.consts.EVENTS.LOGGED_OUT);
    return;
  }
}
