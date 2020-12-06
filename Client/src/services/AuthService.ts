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

  public async loginWithGoogle(): Promise<void> {
    await this.fireAuth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  public async loginWithFacebook(): Promise<void> {
    await this.fireAuth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  public async logOut(): Promise<void> {
    this.storageService.clear().subscribe(() => { });
    await this.fireAuth.signOut();
    this.pubSubService.$pub(this.consts.EVENTS.LOGGED_OUT);
    return;
  }

  public async registerUser(fireUser: firebase.User): Promise<void> {
    return await this.userService.registerUser(fireUser);
  }
}
