import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CONSTS } from 'src/assets/CONSTS';
import { Score } from 'src/models/Score';
import { PubSubService } from 'src/services/PubSubService';
import { ScoreService } from 'src/services/ScoreService';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pending-scores',
  template: `
    <mat-card>
      <h2>Review Scores</h2>
      <p>Some friends have submitted scores for you.  You must approve the score before it's recorded.</p>
      <mat-list>
        <app-past-score-item *ngFor="let score of scores" [score]="score">
        <div id="buttonGroup">
          <button mat-stroked-button color="primary" class="halfButton" (click)="confirm(score)">Confirm</button>
          <button mat-stroked-button color="warn" class="halfButton" (click)="delete(score)">Delete</button>
        </div>
        </app-past-score-item>
      </mat-list>
    </mat-card>
  `,
  styles: [
    `
    #buttonGroup {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
    }
    .halfButton {
      width: 48%;
    }
    `
  ]
})
export class PendingScoresComponent implements OnInit {

  public scores: Score[] = [];

  constructor(
    private pubsubService: PubSubService,
    private storageService: StorageMap,
    private dialog: MatDialog,
    private scoreService: ScoreService,
    private router: Router,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.storageService.get<Score[]>(this.consts.APP_DATA.PENDING_SCORES).subscribe(x => {
      this.scores = x as Score[];
      if (!this.scores || this.scores.length < 1) {
        this.router.navigateByUrl('/landing');
      }
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    })
  }

  confirm(score: Score): void {
    this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.scoreService.confirmPendingScore(score).subscribe(() => {
      const index = this.scores.indexOf(score);
      this.scores.splice(index, 1);
      if (this.scores.length < 1) {
        this.router.navigateByUrl('/landing');
      } else {
        this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      }
    })
  }

  delete(score: Score): void {
    this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
        this.scoreService.deletePendingScore(score).subscribe(() => {
          const index = this.scores.indexOf(score);
          this.scores.splice(index, 1);
          if (this.scores.length < 1) {
            this.router.navigateByUrl('/landing');
          } else {
            this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
          }
        });
      }
    })
  }

}
