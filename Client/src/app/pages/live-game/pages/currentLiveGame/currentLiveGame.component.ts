import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { RoundType } from 'src/models/Score';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';
import { AbortGameConfirmComponent } from '../../components/modals/abortGameConfirm.component';
import { ChangeRoundTypeComponent } from '../../components/modals/changeRoundType.component';
import { OtherErrorComponent } from '../../components/modals/otherError.component';
import { SubmitLiveGameConfirmComponent } from '../../components/modals/submitLiveGameConfirm.component';

@Component({
  selector: 'current-live-game',
  templateUrl: './currentLiveGame.component.html',
  styleUrls: ['./currentLiveGame.component.scss']
})
export class CurrentLiveGameComponent implements OnInit, OnDestroy {

  public liveRound: LiveRound;
  public hostPlayer: LiveRoundPlayer;
  public currentHoleIndex: number = 0;

  private playerScores: {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}} = {};
  private playerScoreSubs$: {[playerId: string]: Subscription} = {};
  private liveRoundSub$: Subscription;


  constructor(
    private pubsub: PubSubService,
    private consts: CONSTS,
    private liveRoundService: LiveRoundService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.liveRoundSub$ = this.liveRoundService.getActiveRound().subscribe(x => {
      this.liveRound = x;
      this.hostPlayer = this.liveRound?.Players?.find(y => y.PlayerId === this.liveRound.HostPlayerId) || undefined;
      this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);

      this.setupPlayerScoreSubs();
    });
  }

  ngOnDestroy(): void {
    this.liveRoundSub$.unsubscribe();
    Object.keys(this.playerScoreSubs$).forEach(playerId => {
      this.playerScoreSubs$[playerId].unsubscribe();
    })
  }


  public saveGame(): void {

    const invalidScores = this.validateScorecard();
    let numErrors = 0;
    Object.keys(invalidScores).forEach(player => {
      invalidScores[player].forEach(score => {
        numErrors ++;
      })
    });

    if (numErrors === 0) { // All 18 holes are valid
      this.dialog.open(SubmitLiveGameConfirmComponent).afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_START);
          this.liveRoundService.saveFinalScores(this.liveRound, this.playerScores).subscribe(() => {
            this.router.navigateByUrl('/scores');
          });
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
        this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_START);
        this.liveRoundService.abortGame().subscribe(() => {
          this.router.navigateByUrl('/liveGame');
        });
      }
    }, err => {
      this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
    })
  }

  public changeRoundType(): void {
    this.dialog.open(ChangeRoundTypeComponent, {data: this.liveRound}).afterClosed().subscribe((result: RoundType) => {
      if (result) {
        this.liveRoundService.changeRoundType(this.liveRound, result).subscribe(() => {}); //TODO: what happens to the client when this data changes???
      }
    });
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
    if (score.RelativePar === undefined || score.RelativePar === null || score.RelativePar < -4) {
      return false;
    }
    if (!score.Score || score.Score < 0) {
      return false;
    }

    return true; //Default
  }

  private setupPlayerScoreSubs(): void {
    this.liveRound?.Players?.forEach(player => {
      if (!this.playerScoreSubs$[player.PlayerId]) {
        this.playerScoreSubs$[player.PlayerId] = this.liveRoundService.getScoreByPlayer(player).subscribe(scores => {
          this.playerScores[player.PlayerId] = scores;
          if (player?.PlayerId === this.liveRound?.HostPlayerId) {
            Object.keys(scores).map(key => Number.parseInt(key)).forEach(holeNumber => {
              if (scores[holeNumber].Score) {
                this.currentHoleIndex = this.mapHoleNumberToTabIndex(holeNumber);
              }
            })
          }
        })
      }
    })
  }

  private mapHoleNumberToTabIndex(holeNumber: number): number {
    switch(this.liveRound.RoundType) {
      case(RoundType.FULL_18):
      case(RoundType.FRONT_9):
        return holeNumber - 1;
      case(RoundType.BACK_9): 
        return holeNumber - 10;
      default: 
        return 
    }
  }
}