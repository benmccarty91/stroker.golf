import { Component, Input, OnInit } from '@angular/core';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend, FriendStatus } from 'src/models/Friend';
import { FriendService } from 'src/services/FriendService';
import { PubSubService } from 'src/services/PubSubService';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-choose-friends',
  template: `
    <div id="container">
      <div id="friendYesNo" *ngIf="(!friends)">
        <h2>Did you play with any friends?</h2>
        <div id="buttonGroup">
          <button mat-stroked-button (click)="submitFriendSelect(true)">Yes</button>
          <button mat-stroked-button (click)="submitFriendSelect(false)">No</button>
        </div>
      </div>
      <div id="friendList" *ngIf="(friends)">
        <h2>Who did you play with?</h2>
        <mat-list>
          <app-friend-item *ngFor="let friend of friends" [friend]="friend" (click)="selectFriend(friend)"
            [isSelected]="isFriendSelected(friend)"></app-friend-item>
        </mat-list>
        <button mat-stroked-button (click)="submitFriendList()">Next</button>
      </div>
    </div>
  `,
  styles: [
    `
    #container {
      display: flex;
      flex-direction: column;
    }

    #friendYesNo {
      display: flex;
      flex-direction: column;
    }

    #friendList {
      display: flex;
      flex-direction: column;
    }

    #buttonGroup {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    #buttonGroup button {
      width: 48%;
    }
    `
  ]
})
export class ChooseFriendsComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;
  @Input() skipFriends: Function;

  public friends: Friend[];

  private selectedFriends: Friend[];

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private friendService: FriendService
  ) { }

  ngOnInit(): void {
  }

  public submitFriendSelect(answer: boolean): void {
    if (answer) {
      this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
      this.friendService.getFriends().subscribe(friends => {
        this.friends = friends.filter(friend => friend.FriendStatus === FriendStatus.ACCEPTED);
        this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      });
      // this.incrementStep(1);
    } else {
      this.skipFriends();
    }
  }

  public selectFriend(friend: Friend): void {
    if (!this.selectedFriends) { // if list hasn't been initialized
      this.selectedFriends = [];
    }
    const existingIndex = this.selectedFriends.indexOf(friend);
    if (existingIndex > -1) { // friend has already been selected 
      this.selectedFriends.splice(existingIndex, 1); // then remove it (deselect)
    } else {
      this.selectedFriends.push(friend); // otherwise, add the friend to the list
    }
  }

  public isFriendSelected(friend: Friend): boolean {
    return this.selectedFriends && this.selectedFriends.includes(friend);
  }

  public submitFriendList(): void {
    this.workingSummary.friendSummary = [];
    if (this.selectedFriends && this.selectedFriends.length > 0) {
      this.selectedFriends.forEach(friend => {
        this.workingSummary.friendSummary.push({
          Friend: friend,
          Score: this.workingSummary.selectedScore,
          Teebox: this.workingSummary.selectedTeebox,
        });
      })
      this.submitHandler();
    } else {
      this.skipFriends();
    }
  }

}
