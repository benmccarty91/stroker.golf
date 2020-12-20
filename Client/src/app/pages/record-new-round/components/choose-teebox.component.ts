import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-teebox',
  template: `
    <div id="container">
      <h2>Which teebox?</h2>
      <mat-radio-group *ngIf="workingSummary.selectedCourse" aria-label="Select an option" [(ngModel)]="workingSummary.selectedTeebox">
        <mat-radio-button *ngFor="let box of workingSummary.selectedCourse.TeeBoxes" [value]="box">
          {{box.Color}}
        </mat-radio-button>
      </mat-radio-group>
      <button mat-stroked-button class="wideButton" *ngIf="workingSummary.selectedTeebox" (click)="submitTeebox()">Next</button>
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

    mat-radio-group {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100px;
    }

    button {
      margin: 15px 0 0 0;
    }
    `
  ]
})
export class ChooseTeeboxComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  submitTeebox(): void {
    this.submitHandler();
  }

}
