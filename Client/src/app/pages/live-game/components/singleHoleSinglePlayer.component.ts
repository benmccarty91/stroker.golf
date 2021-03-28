import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { GolfHole } from 'src/models/GolfHole';
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'single-hole-single-player',
  template: `
    <div *ngIf="score" class="row_div row_item">
      <img src="{{player.PhotoUrl}}" class="avatar"/>
      <div class="column_div player_list_item_details">
        <p>{{player.PlayerName}}</p>
        <p class="subtitle_text">{{player.Teebox.Color}} ({{thisHole.Yardages[player.Teebox.Color]}} yards)</p>
      </div>
      <div class="column_div player_score">
        <div class="row_div">
          <button [disabled]="hideDecrement()" mat-icon-button (click)="decrementScore()"><mat-icon>remove_circle_outline</mat-icon></button>
          <p class="score_number">{{score.Score}}</p>
          <button mat-icon-button (click)="incrementScore()"><mat-icon>add_circle_outline</mat-icon></button>
        </div>
        <div class="row_div" [ngClass]="{'hideElement': hideRelativePar()}">
          <p class="subtitle_text">{{printRelativePar()}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`

    * {
      margin: 0;
      padding: 0;
    }

    .row_item {
      width: 100%;
    }

    .avatar {
      height: 65px;
    }

    .player_list_item_details {
      margin-left: 10px;
    }

    .subtitle_text {
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
    }

    .score_number {
      font-size: 30px;
    }

    .player_score {
      margin-left: auto;
      align-items: center;
    }

    .column_div {
      display: flex;
      flex-direction: column;
    }

    .row_div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .hideElement {
      visibility: hidden;
    }
      
  `]
})
export class SingleHoleSinglePlayerComponent implements OnInit, OnDestroy {

  @Input() player: LiveRoundPlayer;
  @Input() liveRound: LiveRound;
  @Input() holeNumber: number;

  public score: LiveRoundSingleHoleScore;
  public thisHole: GolfHole;
  
  private timerSub$: Subscription;
  private playerScoreSub$: Subscription;

  constructor(
    private liveRoundService: LiveRoundService,
  ) {}

  ngOnInit(): void {
    this.thisHole = this.liveRound.Course.Holes.find(x => x.Number === this.holeNumber);
    this.playerScoreSub$ = this.liveRoundService.getScoreByPlayer(this.player).subscribe(x => {
      this.score = x ? x[this.holeNumber] : undefined;
    });
  }

  ngOnDestroy(): void {
    this.timerSub$?.unsubscribe();
    this.playerScoreSub$.unsubscribe();
  }

  incrementScore(): void {
    this.score.Score++;
    this.score.RelativePar = this.getRelativePar();
    this.writeScore();
  }

  decrementScore(): void {
    this.score.Score--;
    this.score.RelativePar = this.getRelativePar();
    this.writeScore();
  }

  writeScore(): void {
    if (this.timerSub$) {
      this.timerSub$.unsubscribe();
    }
    this.timerSub$ = timer(3000).subscribe(() => {
      this.liveRoundService.setScoreByPlayer(this.player, this.score);
    })
  }

  getRelativePar(): number {
    const currScore = this.score.Score;
    const currPar = this.thisHole.Par;

    return currScore - currPar;
  }

  printRelativePar(): string {
    const relPar = this.getRelativePar();

    if (relPar === 0) {
      return `Even Par`;
    }
    if (relPar > 0) {
      return `${relPar} over Par`;
    } else {
      return `${relPar} under Par`;
    }
  }

  hideDecrement(): boolean {
    return this.score.Score <= 0;
  }

  hideRelativePar(): boolean {
    return this.score.Score <= 0;
  }
}