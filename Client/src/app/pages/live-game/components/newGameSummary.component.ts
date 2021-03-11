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
    <p>summary</p>
  `,
  styles: [`
  
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
    console.log(this.workingSummary);

    this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    const user = await this.userService.getUser().toPromise();
    this.liveRound = this.buildLiveRound(user);
    this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    console.log(this.liveRound);
  }

  private buildLiveRound(user: StrokerUser): LiveRound {
    const now = moment();

    const players: LiveRoundPlayer[] = [];
    if (this.workingSummary.friendSummary) {
      this.workingSummary.friendSummary.map(item => {
        const friend: Friend = item.Friend;
        const friendSummary: LiveRoundPlayer = {
          PlayerId: friend.FriendId,
          PlayerName: friend.Name,
          Teebox: item.Teebox,
          Scores: []
        }
        players.push(friendSummary);
      });
    }

    players.push({
      PlayerId: user.id,
      PlayerName: user.displayName,
      Scores: [],
      Teebox: this.workingSummary.selectedTeebox
    });

    return {
      LiveRoundId: uuid(),
      Course: this.workingSummary.selectedCourse,
      CourseId: this.workingSummary.selectedCourse.Id,
      HostPlayerId: user.id,
      RoundDate: now.unix(),
      PrettyDate: now.format(this.DATE_FORMAT),
      Players: players
    }
  }
}