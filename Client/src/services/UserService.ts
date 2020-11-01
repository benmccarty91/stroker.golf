import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageMap } from '@ngx-pwa/local-storage';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private fireAuth: AngularFireAuth,
    private storageService: StorageMap,
    private consts: CONSTS,
    private apiService: ApiService
  ) { }

  public async saveUser(user: User): Promise<void> {
    const newUser: StrokerUser = {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoURL
    };
    return await this.storageService.set(this.consts.APP_DATA.USER, newUser).toPromise();
  }

  public async getUser(): Promise<StrokerUser> {
    const fireUser = await this.fireAuth.user.pipe(first()).toPromise();
    if (!fireUser) { return null; }
    const strokerUser: StrokerUser = {
      id: fireUser.uid,
      displayName: fireUser.displayName,
      email: fireUser.email,
      photoUrl: fireUser.photoURL
    };
    return strokerUser;
  }

  public async getApiToken(): Promise<string> {
    const fireUser = await this.fireAuth.user.pipe(first()).toPromise();
    const token = await fireUser.getIdToken();
    return token;
  }

  public async registerUser(user: User): Promise<void> {
    const newUser: StrokerUser = {
      displayName: user.displayName,
      email: user.email,
      id: user.uid,
      photoUrl: user.photoURL
    };
    await this.apiService.post('/user/register', newUser).subscribe(() => { });
  }
}
