import { Component, Input, OnInit } from '@angular/core';
import { Score } from 'src/models/Score';

@Component({
  selector: 'app-friend-scores',
  template: `
    <mat-card>
      <mat-card-content>
        <h2>
          Recent Scores
        </h2>
          <mat-list>
            <app-past-score-item class="friendScoreListItem" *ngFor="let score of scores" [score]="score"></app-past-score-item>
          </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
    h2 {
      margin: 0;
    }

    mat-card {
      margin-top: 15px;
    }
    `
  ]
})
export class FriendScoresComponent implements OnInit {

  @Input() scores: Score[];

  constructor() { }

  ngOnInit(): void {
  }

}
