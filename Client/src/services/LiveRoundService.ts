import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LiveRound } from 'src/models/LiveRound';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root'
})
export class LiveRoundService {

  private activeLiveRound: Observable<LiveRound>;
  private activeLiveRoundDoc: AngularFirestoreDocument<LiveRound>;
  private $hasLiveRoundSubject: BehaviorSubject<boolean>;

  constructor(
    fireStore: AngularFirestore,
    userService: UserService
  ){
    this.$hasLiveRoundSubject = new BehaviorSubject<boolean>(false);
    userService.getUserId().then(userId => {
      this.activeLiveRoundDoc = fireStore.collection('live_rounds').doc<LiveRound>(userId);
      this.activeLiveRound = this.activeLiveRoundDoc.valueChanges().pipe(
        tap(round => {
          if (round) {
            this.$hasLiveRoundSubject.next(true);
          } else {
            this.$hasLiveRoundSubject.next(false);
          }
          console.log(round);
        })
      );
    });
  }

  public getActiveRound(): Observable<LiveRound> {
    return this.activeLiveRound;
  }

  public hasActiveRound(): Observable<boolean> {
    return this.$hasLiveRoundSubject.asObservable();
  }

}