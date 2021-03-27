import { Component, Input, OnInit } from "@angular/core";
import { GolfHole } from 'src/models/GolfHole';
import { LiveRound, LiveRoundPlayer } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'single-hole-single-player',
  template: `
    <div *ngIf="scores" class="row_div row_item">
      <img src="{{player.PhotoUrl}}" class="avatar"/>
      <div class="column_div player_list_item_details">
        <p>{{player.PlayerName}}</p>
        <p class="subtitle_text">{{player.Teebox.Color}} ({{thisHole.Yardages[player.Teebox.Color]}} yards)</p>
      </div>
      <div class="row_div player_score">
        <button mat-icon-button (click)="decrementScore()"><mat-icon>remove_circle_outline</mat-icon></button>
        <p class="score_number">{{scores[holeNumber].Score}}</p>
        <button mat-icon-button (click)="incrementScore()"><mat-icon>add_circle_outline</mat-icon></button>
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
      
  `]
})
export class SingleHoleSinglePlayerComponent implements OnInit {

  @Input() player: LiveRoundPlayer;
  @Input() liveRound: LiveRound;
  @Input() holeNumber: number;

  public scores: any;
  public thisHole: GolfHole;
  
  private timerSub$: Subscription;

  constructor(
    private liveRoundService: LiveRoundService,
  ) {}

  ngOnInit(): void {
    this.thisHole = this.liveRound.Course.Holes[this.holeNumber - 1];
    this.liveRoundService.getScoreByPlayer(this.player).subscribe(x => {
      this.scores = x;
    });
  }

  incrementScore(): void {
    this.scores[this.holeNumber].Score++;
    this.writeScore();
  }

  decrementScore(): void {
    this.scores[this.holeNumber].Score--;
    this.writeScore();
  }

  writeScore(): void {
    if (this.timerSub$) {
      this.timerSub$.unsubscribe();
    }
    this.timerSub$ = timer(3000).subscribe(() => {
      this.liveRoundService.setScoreByPlayer(this.player, this.scores);
    })
  }
}