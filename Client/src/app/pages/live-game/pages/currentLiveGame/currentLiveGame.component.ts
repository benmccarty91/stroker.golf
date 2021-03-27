import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';
import { AbortGameConfirmComponent } from '../../components/modals/abortGameConfirm.component';
import { NineHoleConfirmComponent } from '../../components/modals/nineHoleConfirm.component';
import { OtherErrorComponent } from '../../components/modals/otherError.component';
import { SubmitLiveGameConfirmComponent } from '../../components/modals/submitLiveGameConfirm.component';

@Component({
  selector: 'current-live-game',
  templateUrl: './currentLiveGame.component.html',
  styleUrls: ['./currentLiveGame.component.scss']
})
export class CurrentLiveGameComponent implements OnInit {

  public liveRound: LiveRound
  public hostPlayer: LiveRoundPlayer
  public currentHoleIndex: number = 0;

  private playerScores: {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}} = {};

  

  constructor(
    private pubsub: PubSubService,
    private consts: CONSTS,
    private liveRoundService: LiveRoundService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.liveRoundService.getActiveRound().subscribe(x => {
      this.liveRound = x;
      this.hostPlayer = this.liveRound.Players.find(y => y.PlayerId === this.liveRound.HostPlayerId);
      this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);

      this.setupPlayerScoreSubs();
    });
  }


  public saveGame(): void {
    const invalidScores = this.validateScorecard();
    if (!invalidScores || invalidScores === {}) { // All 18 holes are valid
      this.dialog.open(SubmitLiveGameConfirmComponent).afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.liveRoundService.saveFinalScores();
        } else {}
      })
    } else { // something on the scorecard is invalid
      this.dialog.open(OtherErrorComponent, {data: invalidScores});
      console.log(invalidScores);
    }
  }

  public abortGame(): void {
    this.dialog.open(AbortGameConfirmComponent).afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.liveRoundService.abortGame();
      }
    })
  }

  private validateScorecard(): {[playerId: string]: LiveRoundSingleHoleScore[]} {
    // return null;
    const invalidScores = {};
    Object.keys(this.playerScores).forEach(key => {
      invalidScores[key] = new Array<LiveRoundSingleHoleScore>();
      const playerScoreCard = this.playerScores[key];
      Object.keys(playerScoreCard).map(a => Number.parseInt(a)).sort((a,b) => a-b).forEach(holeNum => {
        if (!this.isScoreEntryValid(playerScoreCard[holeNum])) {
          invalidScores[key].push(playerScoreCard[holeNum]);
        }
      })
    });
    return invalidScores;
  }

  private isScoreEntryValid(score: LiveRoundSingleHoleScore): boolean {
    if (score.HoleNumber < 1 || score.HoleNumber > 18) {
      return false;
    }
    if (!score.RelativePar || score.RelativePar < -4) {
      return false;
    }
    if (!score.Score || score.Score < 0) {
      return false;
    }

    return true; //Default
  }

  private setupPlayerScoreSubs(): void {
    this.liveRound.Players.forEach(player => {
      this.liveRoundService.getScoreByPlayer(player).subscribe(scores => {
        this.playerScores[player.PlayerId] = scores;
      })
    })
  }
}