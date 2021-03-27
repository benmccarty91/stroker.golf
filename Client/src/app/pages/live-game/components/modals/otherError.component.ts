import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiveRoundSingleHoleScore } from 'src/models/LiveRound';

@Component({
  template: `
    <p>We can't submit your scorecard.<p>
    <p>There are a total of {{numErrors}} errors.</p>
    <p>Make sure you entered a score for at least the front or back nine</p>
    <p>Scores must be greater than 0</p>
  `, 
  styles: [`
  
  `]
})
export class OtherErrorComponent implements OnInit {

  public numErrors: number = 0;

  constructor(
    private dialogRef: MatDialogRef<OtherErrorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {[playerId: string]: LiveRoundSingleHoleScore[]}
  ) {}


  ngOnInit(): void {
    if (this.data) {
      Object.keys(this.data).forEach(player => {
        this.data[player].forEach(score => {
          this.numErrors ++;
        })
      })
    }
  }


}