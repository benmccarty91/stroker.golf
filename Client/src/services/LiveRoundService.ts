import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { LiveRound } from 'src/models/LiveRound';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root'
})
export class LiveRoundService {

  private $activeLiveRound: Observable<LiveRound>;
  private activeLiveRoundDoc: AngularFirestoreDocument<LiveRound>;
  private $hasLiveRoundSubject: BehaviorSubject<boolean>;
  private userId: string;

  constructor(
    private fireStore: AngularFirestore,
    private userService: UserService
  ) {
    this.$hasLiveRoundSubject = new BehaviorSubject<boolean>(false);
    this.setupSubs();
  }

  private setupSubs(): void {
    this.$activeLiveRound = this.userService.isLoggedIn().pipe(
      mergeMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.userService.getUser()
        } else {
          this.$activeLiveRound = null;
          this.activeLiveRoundDoc = null;
          this.userId = null;
          return of(null);
        }
      }),
      mergeMap(user => {
        if (user) {
          return of(user.id);
        } else {
          throw Error(ERROR_CODES.NO_USER);
        }
      }),
      mergeMap(userId => {
        if (userId) {
          this.userId = userId;
          this.activeLiveRoundDoc = this.fireStore.collection('live_rounds').doc<LiveRound>(this.userId);
          return this.activeLiveRoundDoc.valueChanges();
        }
        else {
          throw Error(ERROR_CODES.NO_USER_ID);
        }
      }),
      tap(round => {
        if (round) {
          this.$hasLiveRoundSubject.next(true);
        } else {
          this.$hasLiveRoundSubject.next(false);
        }
        console.log(round);
      }),
      catchError(err => {
        if (err.message === ERROR_CODES.NO_USER || err.message === ERROR_CODES.NO_USER_ID) {
          return of(null);
        } else {
          throw err;
        }
      })
    );
  }

  public getActiveRound(): Observable<LiveRound> {
    return this.$activeLiveRound;
  }

  public hasActiveRound(): Observable<boolean> {
    return this.$hasLiveRoundSubject.asObservable();
  }



}

enum ERROR_CODES {
  NO_USER = 'No User',
  NO_USER_ID = 'No User Id',
}