import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiveRound } from 'src/models/LiveRound';
import { RoundType } from 'src/models/Score';
import { LiveRoundService } from 'src/services/LiveRoundService';

@Component({
  template:`
    <div id="container">
      <h2>How many holes?</h2>
      <mat-button-toggle-group [(ngModel)]="selectedRoundType">
        <mat-button-toggle *ngIf="data.RoundType !== roundType.FULL_18" value="{{roundType.FULL_18}}">{{roundType.FULL_18}}</mat-button-toggle>
        <mat-button-toggle *ngIf="data.RoundType !== roundType.FRONT_9" value="{{roundType.FRONT_9}}">{{roundType.FRONT_9}}</mat-button-toggle>
        <mat-button-toggle *ngIf="data.RoundType !== roundType.BACK_9" value="{{roundType.BACK_9}}">{{roundType.BACK_9}}</mat-button-toggle>
      </mat-button-toggle-group>
      <button mat-stroked-button *ngIf="selectedRoundType" (click)="submitRoundType()" color="accent">Submit</button>
    </div>
  `,
  styles: [`
    #container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      margin: 0;
      margin-bottom: 15px;
    }

    button {
      margin-top: 15px;
      width: 100%;
    }

    mat-button-toggle-group {
      width: 100%;
    }

    mat-button-toggle {
      width: 100%;
    }
  `],
})
export class ChangeRoundTypeComponent implements OnInit {

  public selectedRoundType: RoundType;

  constructor(
    private dialogRef: MatDialogRef<ChangeRoundTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LiveRound
  ) { }

  ngOnInit(): void {
    // console.log(this.data);
  }

  public get roundType(): typeof RoundType {
    return RoundType;
  }

  public submitRoundType(): void {
    this.dialogRef.close(this.selectedRoundType);
  }
}