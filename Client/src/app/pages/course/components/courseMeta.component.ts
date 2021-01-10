import { Component, Input, OnInit } from "@angular/core";
import { GolfCourse } from "src/models/GolfCourse";
import { NewCourseSummary } from "../models/newCourseSummary";

@Component({
  selector: 'app-course-meta-form',
  template: `
    <h2>Let's start with the basics</h2>
    <form (ngSubmit)="submit()" #courseMetaForm="ngForm" autocomplete="off">
      <mat-form-field class="full-width">
        <mat-label>Course Name</mat-label>
        <input type="text" required matInput name="newGolfCourse.Name" [(ngModel)]="newCourseSummary.newGolfCourse.Name">
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>Street Address</mat-label>
        <input type="text" required matInput name="newGolfCourse.StreetAddress" [(ngModel)]="newCourseSummary.newGolfCourse.StreetAddress">
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>City</mat-label>
        <input type="text" required matInput name="newGolfCourse.City" [(ngModel)]="newCourseSummary.newGolfCourse.City">
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>State</mat-label>
        <input type="text" required matInput name="newGolfCourse.State" [(ngModel)]="newCourseSummary.newGolfCourse.State">
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>How Many Teeboxes?</mat-label>
        <input type="number" required matInput name="newGolfCourse_numTeeboxes" [(ngModel)]="newCourseSummary.numTeeboxes">
      </mat-form-field>
      <mat-form-field class="full-width">
        <mat-label>How Many Holes?</mat-label>
        <input type="number" required matInput name="newGolfCourse_numHoles" [(ngModel)]="newCourseSummary.numHoles">
      </mat-form-field>
      <button type="submit" [disabled]="!courseMetaForm.form.valid" mat-stroked-button class="full-width"
        color="primary">Next</button>
    </form>
  `,
  styles: [
    `
    .full-width {
      width: 100%;
    }
    `
  ]
})
export class CourseMetaComponent implements OnInit {

  @Input() newCourseSummary: NewCourseSummary
  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  public submit() {
    this.submitHandler();
  }
}