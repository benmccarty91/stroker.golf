import { Component, Input, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
  selector: 'app-choose-date',
  template: `
    <div id="container">
      <h2>When did you play?</h2>
        <mat-form-field appearance="fill">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" autocomplete="off" [value]="workingSummary.selectedDate"
            (dateChange)="dateChange($event)">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker touchUi #picker></mat-datepicker>
        </mat-form-field>
      <button mat-stroked-button class="wideButton" *ngIf="workingSummary.selectedDate" (click)="submitDate()">Next</button>
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
    `
  ]
})
export class ChooseDateComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  public dateChange(event: MatDatepickerInputEvent<Moment>): void {
    this.workingSummary.selectedDate = event.value;
  }

  submitDate(): void {
    this.submitHandler();
  }

}
