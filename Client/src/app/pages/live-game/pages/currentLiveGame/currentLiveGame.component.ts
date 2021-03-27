import { Component, OnInit } from "@angular/core";
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound, LiveRoundPlayer } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'current-live-game',
  templateUrl: './currentLiveGame.component.html',
  styleUrls: ['./currentLiveGame.component.scss']
})
export class CurrentLiveGameComponent implements OnInit {

  public liveRound: LiveRound
  public hostPlayer: LiveRoundPlayer
  public currentHoleIndex: number = 0;

  

  constructor(
    private pubsub: PubSubService,
    private consts: CONSTS,
    private liveRoundService: LiveRoundService,
  ) {}

  ngOnInit(): void {
    this.liveRoundService.getActiveRound().subscribe(x => {
      this.liveRound = x;
      this.hostPlayer = this.liveRound.Players.find(y => y.PlayerId === this.liveRound.HostPlayerId);
      this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }
}