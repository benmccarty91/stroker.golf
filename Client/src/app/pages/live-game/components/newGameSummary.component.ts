import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound, LiveRoundPlayer } from 'src/models/LiveRound';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Friend } from 'src/models/Friend';
import { StrokerUser } from 'src/models/StrokerUser';


@Component({
  selector: 'app-live-game-create-summary',
  template: `
    <div class="column_div" *ngIf="liveRound">
      <h3>{{liveRound.Course.Name}}</h3>
      <mat-card class="column_div" *ngFor="let player of liveRound.Players">
        <div class="row_div">
          <img src="{{player.PhotoUrl}}" class="avatar" />
          <div class="column_div content">
            <h2>{{player.PlayerName}}</h2>
            <p>Teebox: {{player.Teebox.Color}}</p>
          </div>
        </div>
      </mat-card>
      <button mat-stroked-button color="accent" (click)="submit.next(liveRound)">Start Game</button>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
    }
    .avatar {
      min-width: 75px;
      min-height: 75px;
      max-width: 75px;
      max-height: 75px;
      margin: 
    }
    mat-card {
      margin: 10px 0 10px 0;
    }
    .column_div {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .row_div {
      display: flex;
      flex-direction: row;
    }
    .content {
      padding: 0 0 0 15px;
    }
  `]
})
export class NewGameSummary implements OnInit {

  @Input() workingSummary: any;
  @Output() submit = new EventEmitter<any>();

  public liveRound: LiveRound;

  private readonly DATE_FORMAT: string = 'MM-DD-YYYY';

  constructor(
    private pubsub: PubSubService,
    private consts: CONSTS,
    private userService: UserService
  ) {
  }

  public async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser().toPromise();
    this.liveRound = this.buildLiveRound(user, this.workingSummary);
  }

  private buildLiveRound(user: StrokerUser, workingSummary: any): LiveRound {
    const now = moment();

    const players: LiveRoundPlayer[] = [];

    players.push({
      PlayerId: user.id,
      PlayerName: user.displayName,
      Scores: [],
      Teebox: workingSummary.selectedTeebox,
      PhotoUrl: user.photoUrl
    });

    if (workingSummary.friendSummary) {
      workingSummary.friendSummary.map(item => {
        const friend: Friend = item.Friend;
        const friendSummary: LiveRoundPlayer = {
          PlayerId: friend.FriendId,
          PlayerName: friend.Name,
          Teebox: item.Teebox,
          Scores: [],
          PhotoUrl: friend.PhotoUrl
        }
        players.push(friendSummary);
      });
    }

    return {
      LiveRoundId: uuid(),
      Course: workingSummary.selectedCourse,
      CourseId: workingSummary.selectedCourse.Id,
      HostPlayerId: user.id,
      RoundDate: now.unix(),
      PrettyDate: now.format(this.DATE_FORMAT),
      Players: players
    }
  }
}