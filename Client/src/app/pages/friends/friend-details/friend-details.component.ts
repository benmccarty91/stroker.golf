import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Location } from '@angular/common';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend, FriendStatus } from 'src/models/Friend';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';
import { StrokerUser } from 'src/models/StrokerUser';

@Component({
  selector: 'app-friend-details',
  template: `
      <mat-card *ngIf="!loading">
        <button id="backButton" mat-mini-fab color="primary" (click)="hitBackButton()">
          <mat-icon>keyboard_arrow_left</mat-icon>
        </button>
        <mat-card-content>
          <h1>{{friend.Name}}</h1>
          <p>{{friend.Email}}</p>
          <h3 id="status" *ngIf="friend.FriendStatus === 'Pending'">{{friend.FriendStatus}}</h3>
          <img id="avatar" src="{{friend.PhotoUrl}}" />
          <div id="buttonGroup">
            <div *ngIf="!isAccepted() && hasApprovalAuth()">
              <button class="appDen" mat-flat-button color="accent">Approve</button>
              <button class="appDen" mat-flat-button color="primary">Decline</button>
            </div>
            <div *ngIf="!isAccepted() && !hasApprovalAuth()">
              <button class="delRem" mat-flat-button color="warn">Delete Request</button>
            </div>
            <div *ngIf="isAccepted()">
              <button class="delRem" mat-flat-button color="warn">Remove Friend</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
  `,
  styles: [
    `
    mat-card-content * {
      margin: 5px 0;
    }

    mat-card-content {
      text-align: center;
    }

    #status {
      color: #ec407a;
    }

    #avatar {
      max-width: 300px;
      min-width: 150px;
      border-radius: 8px;
    }

    .appDen {
      min-width: 40%;
      margin: 2% !important;
    }

    .delRem {
      min-width: 84%;
    }
    `
  ]
})
export class FriendDetailsComponent implements OnInit {

  public loading: boolean = true;
  public friend: Friend;
  public self: StrokerUser;

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private localStorage: StorageMap,
    private location: Location,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.localStorage.get<Friend>(this.consts.APP_DATA.SELECTED_FRIEND).subscribe(friend => {
      this.friend = friend as Friend;
      this.userService.getUser().then(user => {
        this.self = user;
        this.loading = false;
        this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      });
    });

    // not sure why this would be necessary, but I got the url parsing to work
    // this.route.paramMap.subscribe(x => {
    //   console.log(x.get('id'));
    // });
  }

  hitBackButton(): void {
    this.location.back();
  }

  isAccepted(): boolean {
    return this.friend.FriendStatus === FriendStatus.ACCEPTED;
  }

  hasApprovalAuth(): boolean {
    return (this.self.id === this.friend.ApprovalAuthority);
  }

}
