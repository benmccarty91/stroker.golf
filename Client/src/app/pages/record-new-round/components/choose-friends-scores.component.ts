import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-friends-scores',
  template: `
    <div id="container">
      <h2>How did they play?</h2>
      <mat-card class="friendScoreCard" *ngFor="let friend of workingSummary.friendSummary">
        <div class="friendNameAndScore">
          <h4>{{friend.Friend.Name}}</h4>
          <app-number-picker-small class="friendScorePicker" [inNumber]="friend.Score"
            (outNumber)="friendScorePickerHandler(friend, $event)">
          </app-number-picker-small>
        </div>
        <mat-form-field appearance="fill">
          <mat-label>Teebox</mat-label>
          <mat-select [(value)]="friend.Teebox">
            <mat-option *ngFor="let teebox of workingSummary.selectedCourse.TeeBoxes" [value]="teebox">
              {{teebox.Color}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card>
      <button mat-stroked-button (click)="submitFriendsScores()">Next</button>
    </div>
  `,
  styles: [
    `
    #container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: stretch;
    }

    mat-card {
      margin: 0 0 15px 0;
    }

    .friendScoreCard {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .friendNameAndScore {
      display: flex;
      flex-direction: row;
    }
    `
  ]
})
export class ChooseFriendsScoresComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  public submitFriendsScores(): void {
    this.submitHandler();
  }

  public friendScorePickerHandler(score: any, num: number): void {
    score.Score = num;
    console.log(this.workingSummary);
  }

}
