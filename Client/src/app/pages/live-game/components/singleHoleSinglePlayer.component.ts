import { Component, Input, OnInit } from "@angular/core";
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';

@Component({
  selector: 'single-hole-single-player',
  template: `
    <div class="row_div row_item">
      <img src="{{player.PhotoUrl}}" class="avatar"/>
      <div class="column_div player_list_item_details">
        <p>{{player.PlayerName}}</p>
        <p class="subtitle_text">{{player.Teebox.Color}} ({{liveRound.Course.Holes[holeNumber - 1].Yardages[player.Teebox.Color]}} yards)</p>
      </div>
      <div class="row_div player_score">
        <button (click)="decrementScore(player)">-</button><p>{{player.Scores[holeNumber - 1]?.Score || liveRound.Course.Holes[holeNumber - 1].Par}}</p>
        <button (click)="incrementScore(player)">+</button>
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

  public score: LiveRoundSingleHoleScore

  constructor(
    private liveRoundService: LiveRoundService
  ) {}

  ngOnInit(): void {
    this.liveRoundService.getSingleScoreByPlayer(this.player, this.holeNumber).subscribe(score => {
      this.score = score;

      if (!this.score) {
        //TODO: initialize score for this player/hole
      }
    })
  }

  incrementScore(player: LiveRoundPlayer): void {
    player.Scores[this.holeNumber - 1].Score++;

    // this.writeData(player, {});
  }

  decrementScore(player: LiveRoundPlayer): void {
    player.Scores[this.holeNumber - 1].Score--;

    // this.writeData(player, {});
  }
}