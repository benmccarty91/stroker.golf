import { Component, Input, OnInit } from '@angular/core';
import { Friend, FriendStatus } from 'src/models/Friend';
import { StrokerUser } from 'src/models/StrokerUser';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-friend-item',
  template: `
    <mat-list-item>
        <mat-card [ngClass]="{selectedCard: isSelected}" matBadge="!" matBadgeColor="accent" matBadgePosition="before" matBadgeHidden="{{!showBadge()}}">
          <div id="container">
            <img id="avatar" src="{{friend.PhotoUrl}}" />
            <div class="content">
              <h2>{{friend.Name}}</h2>
              <p *ngIf="friend.FriendStatus === 'Pending'">{{friend.FriendStatus}}</p>
            </div>
          </div>
        </mat-card>
      </mat-list-item>
  `,
  styles: [
    `
    * {
      margin: 0;
    }

    mat-list-item {
      margin: 25px 0;
      height: auto !important;
    }

    mat-card {
      width: 100%;
    }

    #container {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
    }
    
    #avatar {
      min-width: 75px;
      min-height: 75px;
      max-width: 75px;
      max-height: 75px;
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 0 0 20px;
    }

    .selectedCard {
      background-color: #9e9e9e;
    }
    `
  ]
})
export class FriendItemComponent implements OnInit {

  @Input() friend: Friend;
  @Input() isSelected: boolean = false;
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
