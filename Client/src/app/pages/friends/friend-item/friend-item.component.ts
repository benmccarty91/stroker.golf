import { Component, Input, OnInit } from '@angular/core';
import { Friend, FriendStatus } from 'src/models/Friend';
import { StrokerUser } from 'src/models/StrokerUser';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-friend-item',
  template: `
    <mat-list-item>
        <mat-card matBadge="!" matBadgeColor="accent" matBadgePosition="before" matBadgeHidden="{{!showBadge()}}">
          <mat-grid-list cols="4">
            <mat-grid-tile [colspan]="1">
              <ng-content></ng-content>
              <img id="avatar" src="{{friend.PhotoUrl}}" />
            </mat-grid-tile>
            <mat-grid-tile [colspan]="3">
              <div class="content">
                <h2>{{friend.Name}}</h2>
                <h4 *ngIf="friend.FriendStatus === 'Pending'">{{friend.FriendStatus}}</h4>
                <p>{{friend.Email}}</p>
              </div>
            </mat-grid-tile>
          </mat-grid-list>
        </mat-card>
      </mat-list-item>
  `,
  styles: [
    `
    mat-list-item {
      margin: 25px 0;
      height: auto !important;
    }
    mat-card {
      width: 100%;
    }

    .content {
      width: 100%;
      padding: 15px;
      margin: 0;
    }

    h2, h4, p {
      margin: 0;
    }

    #avatar {
      width: 100%;
      margin: 0;
    }
    `
  ]
})
export class FriendItemComponent implements OnInit {

  @Input() friend: Friend;
  private self: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserId().then(x => {
      this.self = x;
    });
  }

  showBadge(): boolean {
    const pendingStatus = this.friend.FriendStatus === FriendStatus.PENDING;
    const approvalAuth = this.friend.ApprovalAuthority === this.self;
    // console.log(`Pending: ${pendingStatus}, ApprovalAuth: ${approvalAuth}`);
    return pendingStatus && approvalAuth;
  }

}
