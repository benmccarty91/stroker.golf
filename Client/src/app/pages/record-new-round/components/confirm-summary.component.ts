import { Component, Input, OnInit } from '@angular/core';
import { GolfCourse } from 'src/models/GolfCourse';
import { Score } from 'src/models/Score';
import { ScoreService } from 'src/services/ScoreService';

@Component({
  selector: 'app-confirm-summary',
  template: `
    <div id="container">
      <h2>Summary</h2>
      <h3>{{summary.CourseName}}</h3>
      <p>{{summary.PrettyDate}}</p>
      <mat-card class="scoreSummaryCard">
        <h4>{{summary.PlayerName}}</h4>
        <p>{{summary.TeeboxColor}} teebox</p>
        <p>Score: <b>{{summary.Score}}</b></p>
        <p>{{summary.RoundType}}</p>
        <p>{{getParSummary(summary.Score, workingSummary.selectedCourse)}}</p>
      </mat-card>
      <mat-card class="scoreSummaryCard" *ngFor="let friend of friendSummary">
        <h4>{{friend.PlayerName}}</h4>
        <p>{{friend.TeeboxColor}} teebox</p>
        <p>Score: <b>{{friend.Score}}</b></p>
        <p>{{friend.RoundType}}</p>
        <p>{{getParSummary(friend.Score, workingSummary.selectedCourse)}}</p>
      </mat-card>
      <button mat-stroked-button class="wideButton" (click)="submit()">Submit</button>
    </div>
  `,
  styles: [
    `
    * {
      margin: 0;
    }

    #container {
      margin: 15px 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: stretch;
    }

    .scoreSummaryCard {
      margin: 15px 0;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: stretch;
    }
    `
  ]
})
export class ConfirmSummaryComponent implements OnInit {

  @Input() submitHandler: Function;
  @Input() workingSummary: any;
  @Input() summary: Score;
  @Input() friendSummary: Score[];

  constructor(
    private scoreService: ScoreService
  ) { }

  ngOnInit(): void {
  }

  public submit(): void {
    this.submitHandler();
  }

  public getParSummary(score: number, course: GolfCourse): string {
    return ScoreService.getParSummary(score, course);
  }

}
