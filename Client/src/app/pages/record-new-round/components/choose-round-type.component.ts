import { Component, Input, OnInit } from '@angular/core';
import { RoundType } from 'src/models/Score';

@Component({
  selector: 'app-choose-round-type',
  template: `
    <div id="container">
      <h2>How many holes did you play?</h2>
      <mat-button-toggle-group [(ngModel)]="workingSummary.selectedRoundType">
        <mat-button-toggle value="{{roundType.FULL_18}}">{{roundType.FULL_18}}</mat-button-toggle>
        <mat-button-toggle value="{{roundType.FRONT_9}}">{{roundType.FRONT_9}}</mat-button-toggle>
        <mat-button-toggle value="{{roundType.BACK_9}}">{{roundType.BACK_9}}</mat-button-toggle>
      </mat-button-toggle-group>
      <button mat-stroked-button *ngIf="workingSummary.selectedRoundType" (click)="submitRoundType()">Next</button>
    </div>
  `,
  styles: [
    `
    #container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
    }

    mat-button-toggle-group {
      display: flex;
      flex-direction: row;
      margin-bottom: 15px;
    }
    
    mat-button-toggle {
      width: 33%;
    }
    `
  ]
})
export class ChooseRoundTypeComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;
  
  constructor() { }

  ngOnInit(): void {
  }

  public get roundType(): typeof RoundType {
    return RoundType;
  }

  public submitRoundType(): void {
    this.submitHandler();
  }

}
