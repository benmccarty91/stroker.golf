import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-score',
  template: `
    <div id="container">
      <h2>What did you score?</h2>
      <app-number-picker [inNumber]="workingSummary.selectedScore" (outNumber)="selectScore($event)"></app-number-picker>
      <button mat-stroked-button *ngIf="workingSummary.selectedScore > 0" (click)="submitScore()">Next</button>
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
    `
  ]
})
export class ChooseScoreComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  public selectScore(num: number): void {
    this.workingSummary.selectedScore = num;
  }

  public submitScore(): void {
    this.submitHandler();
  }

}
