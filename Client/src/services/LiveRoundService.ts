import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root'
})
export class LiveRoundService {

  private activeLiveRound: AngularFirestoreDocument;
  private userId: string;

  constructor(
    private fireStore: AngularFirestore,
    private userService: UserService
  ){
    userService.getUserId().then(userId => {
      this.userId = userId;
      this.activeLiveRound = fireStore.collection('live_rounds').doc(userId);
      console.log(this.activeLiveRound);
    });
  }

}