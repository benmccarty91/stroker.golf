import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/models/Friend';

@Component({
  selector: 'app-friend-item',
  template: `
    <mat-list-item>
        <mat-card>
          <mat-grid-list cols="4">
            <mat-grid-tile [colspan]="1">
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

  constructor() { }

  ngOnInit(): void {
  }

}
