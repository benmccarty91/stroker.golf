import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GolfCourse } from 'src/models/GolfCourse';

@Component({
  selector: 'app-choose-course',
  template: `
    <div id="courseSelect" class="questionCards">
      <h2>Which course did you play?</h2>
      <div class="formContainer">
        <mat-form-field appearance="fill">
          <mat-label>Select Course</mat-label>
          <mat-select [(value)]="selectedCourseId">
            <mat-option *ngFor="let course of courses" [value]="course.Id">
              {{course.Name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-stroked-button class="wideButton" *ngIf="selectedCourseId" (click)="submitCourse()">Next</button>
      </div>
    </div>
  `,
  styles: [
    `
    .formContainer {
      display: flex;
      flex-direction: column;
    }
    `
  ]
})
export class ChooseCourseComponent implements OnInit {

  @Input() courses: GolfCourse[];
  @Input() selectedCourseId: string;
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  submitCourse(): void {
    this.submitHandler(this.selectedCourseId);
  }

}
