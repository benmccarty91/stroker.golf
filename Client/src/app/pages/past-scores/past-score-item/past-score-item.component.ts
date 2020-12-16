import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Score } from 'src/models/Score';

@Component({
  selector: 'app-past-score-item',
  template: `
      <mat-list-item>
        <mat-card>
          <h1>{{score.Score}}</h1>
          <p *ngIf="score.RelativeScore !== undefined">{{getParSummary(score.RelativeScore)}}</p>
          <h3>{{formatDate(score.Date)}}</h3>
          <p>{{score.CourseName}}</p>
          <p>{{score.RoundType}} from the {{score.TeeboxColor}} tees</p>
          <ng-content></ng-content>
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
    h1 {
      font-size: 3em;
      margin: 0;
    }
    h3 {
      font-size: 0.75em;
      margin: 0;
    }
    p {
      font-size: 0.75em;
      margin: 0;
    }
    `
  ]
})
export class PastScoreItemComponent implements OnInit {

  constructor() { }

  @Input() score: Score;

  ngOnInit(): void {
  }

  public getParSummary(relativeScore: number): string {
    let parScore = relativeScore;
    if (parScore < 0) {
      parScore = parScore * -1;
      return `${parScore} under par`;
    } else if (parScore > 0) {
      return `${parScore} over par`;
    } else {
      return `Even par`;
    }
  }

  public formatDate(timeStamp: number): string {
    return moment.unix(timeStamp).format('MM/DD/YYYY');
  }

}
