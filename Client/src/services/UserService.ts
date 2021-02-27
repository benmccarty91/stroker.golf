import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { StorageMap } from '@ngx-pwa/local-storage';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { ApiService } from './ApiService';
import { PubSubService } from './PubSubService';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private cached_user: StrokerUser;

  constructor(
    private fireAuth: AngularFireAuth,
    private storageService: StorageMap,
    private pubSub: PubSubService,
    private consts: CONSTS,
    private apiService: ApiService
  ) {
    this.cached_user = null;
    this.pubSub.$sub(this.consts.EVENTS.LOGGED_OUT).subscribe(() => {
      this.cached_user = null;
    });
  }

  public isLoggedIn(): Observable<boolean> {
    return this.fireAuth.user.pipe(
      map(user => {
        return user ? true : false;
      })
    );
  }

  // somehow, and I don't know how, but cached_user is getting updated
  // after you edit the profile.  That shouldn't be happening, but
  // somehow it is.  Maybe it's just the debugger?  If the cahced_user
  // isn't getting updated in prod, then just simply update it in the 
  // update method below.
  public getUser(): Observable<StrokerUser> {
    if (this.cached_user) {
      return of(this.cached_user);
    }

    return this.apiService.get('/user/profile').pipe(
      map((res: StrokerUser) => {
        this.cached_user = res;
        return this.cached_user;
      })
    );
  }

  public async getUserId(): Promise<string> {
    const fireUser = await this.fireAuth.user.pipe(first()).toPromise();
    const id = await fireUser.uid;
    return id;
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

  public updateProfile(newUser: StrokerUser): Observable<void> {
    return this.apiService.put('/user/profile', newUser);
  }
}
