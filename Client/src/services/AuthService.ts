import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageMap } from '@ngx-pwa/local-storage';
import { auth, User } from 'firebase';
import { Observable } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { PubSubService } from './PubSubService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(
    private fireAuth: AngularFireAuth,
    private pubSubService: PubSubService,
    private consts: CONSTS,
    private storageService: StorageMap
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
      this.saveUser(cred.user).subscribe(() => {
        console.log(`logged in user: ${cred.user.displayName}`);
        this.pubSubService.$pub(this.consts.EVENTS.LOGGED_IN);
      });
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
      this.saveUser(cred.user).subscribe(() => {
        console.log(`logged in user: ${cred.user.displayName}`);
        this.pubSubService.$pub(this.consts.EVENTS.LOGGED_IN);
      });
      return true;
    } else {
      return false;
    }
  }

  public async logOut(): Promise<void> {
    console.log('loging out user');
    this.storageService.clear().subscribe(() => { });
    await this.fireAuth.signOut();
    return;
  }

  private saveUser(user: User): Observable<any> {
    const newUser: StrokerUser = {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoURL
    };
    user.getIdToken().then(token => {
      this.storageService.set(this.consts.APP_DATA.API_TOKEN, token).subscribe(() => { });
    });
    return this.storageService.set(this.consts.APP_DATA.USER, newUser);
  }
}
