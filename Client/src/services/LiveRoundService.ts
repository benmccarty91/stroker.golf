import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { RoundType } from 'src/models/Score';
import { ApiService } from './ApiService';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root'
})
export class LiveRoundService {
  
  private $activeLiveRound: Observable<LiveRound>;
  private activeLiveRoundDoc: AngularFirestoreDocument<LiveRound>;
  private $hasLiveRoundSubject: BehaviorSubject<boolean>;
  private userId: string;

  private playerScoreObservables: {[playerId: string]: Observable<{[holeNumber: number]: LiveRoundSingleHoleScore}>} = {};
  private playerScores: {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}} = {};

  private readonly COLLECTION_NAME = 'live_rounds';

  constructor(
    private fireStore: AngularFirestore,
    private userService: UserService,
    private apiService: ApiService
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
          this.activeLiveRoundDoc = this.fireStore.collection(this.COLLECTION_NAME).doc<LiveRound>(this.userId);
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
        // console.log(round);
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

  public saveFinalScores(liveRound: LiveRound, scoreData: {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}}): Observable<void> {
    return this.apiService.post('/liveRound/finalSubmit', {round: liveRound, scoreData: scoreData});
  }

  public abortGame(): Observable<void> {
    return this.apiService.delete('/liveRound');
  }

  public getActiveRound(): Observable<LiveRound> {
    return this.$activeLiveRound;
  }

  public createNewLiveRound(game: LiveRound): Observable<void> {
    return this.apiService.post('/liveRound', game);
  }

  public getScoreByPlayer(player: LiveRoundPlayer): Observable<{[holeNumber: number]: LiveRoundSingleHoleScore}> {
    if (!this.playerScoreObservables[`${player.PlayerId}`]) {
      this.playerScoreObservables[`${player.PlayerId}`] = this.activeLiveRoundDoc.collection(player.PlayerId).doc<{[holeNumber: number]: LiveRoundSingleHoleScore}>('scores').valueChanges().pipe(
        tap(scores => {
          this.playerScores[player.PlayerId] = scores;
        })
      );
    }
    return this.playerScoreObservables[`${player.PlayerId}`];
  }

  public setScoreByPlayer(player: LiveRoundPlayer, body: LiveRoundSingleHoleScore): Promise<void> {
    const toSave = this.playerScores[player.PlayerId];
    toSave[body.HoleNumber] = body;
    return this.activeLiveRoundDoc.collection(player.PlayerId).doc('scores').set(toSave);
  }

  public changeRoundType(liveRound: LiveRound, roundType: RoundType): Observable<void> {
    return this.apiService.put('/liveRound/updateRoundType', {HostPlayerId: liveRound.HostPlayerId, NewRoundType: roundType});
  }
}

enum ERROR_CODES {
  NO_USER = 'No User',
  NO_USER_ID = 'No User Id',
}