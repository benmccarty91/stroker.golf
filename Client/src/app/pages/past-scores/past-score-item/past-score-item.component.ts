import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Score } from 'src/models/ScoreSubmission';

@Component({
  selector: 'app-past-score-item',
  template: `
      <mat-list-item>
        <mat-card>
          <h1>{{score.Score}}</h1>
          <h3>{{formatDate(score.Date)}}</h3>
          <p>{{score.CourseName}}</p>
          <p>From the {{score.TeeboxColor}} tees</p>
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
      line-height:0.4em;
      /* padding-top: 30px; */
    }
    h1 {
      font-size: 3em;
    }
    h3 {
      font-size: 0.75em;
    }
    p {
      font-size: 0.75em;
    }
    `
  ]
})
export class PastScoreItemComponent implements OnInit {

  constructor() { }

  @Input() score: Score;

  ngOnInit(): void {
    console.log(this.score);
  }

  public formatDate(timeStamp: number): string {
    return moment.unix(timeStamp).format('MM/DD/YYYY');
  }

}
