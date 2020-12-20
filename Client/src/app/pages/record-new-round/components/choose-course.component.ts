import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GolfCourse } from 'src/models/GolfCourse';

@Component({
  selector: 'app-choose-course',
  template: `
    <div>
      <div id="container">
        <h2>Which course?</h2>
        <mat-form-field appearance="fill">
          <mat-label>Select Course</mat-label>
          <mat-select [(value)]="workingSummary.selectedCourseId">
            <mat-option *ngFor="let course of courses" [value]="course.Id">
              {{course.Name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-stroked-button *ngIf="workingSummary.selectedCourseId" (click)="submitCourse()">Next</button>
      </div>
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
export class ChooseCourseComponent implements OnInit {

  @Input() workingSummary: any;
  @Input() courses: GolfCourse[];
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  submitCourse(): void {
    this.submitHandler();
  }

}
