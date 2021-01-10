import { Component, Input, OnInit } from "@angular/core";
import { GolfHole } from 'src/models/GolfHole';
import { TeeBox } from 'src/models/TeeBox';
import { NewCourseSummary } from "../models/newCourseSummary";

@Component({
  selector: 'app-course-summary',
  template: `
    <h2>Summary</h2>
    <h4>{{newCourseSummary.newGolfCourse.Name}}</h4>
    <p>{{newCourseSummary.newGolfCourse.StreetAddress}}</p>
    <p>{{newCourseSummary.newGolfCourse.City}}, {{newCourseSummary.newGolfCourse.State}}</p>
    <mat-card>
      <h4>Teeboxes</h4>
      <div class="box" *ngFor="let teebox of newCourseSummary.newGolfCourse.TeeBoxes">
        <p><b>{{teebox.Color}}</b></p>
        <div class="flex_row">
          <p class="half-width">Men's Rating: {{teebox.MensRating}}</p>
          <p class="half-width">Men's Slope: {{teebox.MensSlope}}</p>
        </div>
        <div class="flex_row">
          <p class="half-width">Women's Rating: {{teebox.WomensRating}}</p>
          <p class="half-width">Women's Slope: {{teebox.WomensSlope}}</p>
        </div>
      </div>
    </mat-card>
    <mat-card>
      <h4>Holes</h4>
      <div class="box" *ngFor="let hole of newCourseSummary.newGolfCourse.Holes; index as i">
        <p><b>#{{hole.Number}}</b></p>
        <div class="flex_row">
          <p class="half-width">Par: {{hole.Par}}</p>
          <p class="half-width">Handicap: {{hole.Handicap}}</p>
        </div>
        <div *ngFor="let teebox of hole.Yardages | keyvalue">
          <p>{{teebox.key}}: {{teebox.value}}</p>
        </div>
        <hr *ngIf="i+1 < newCourseSummary.newGolfCourse.Holes.length">
      </div>
    </mat-card>
    <button mat-flat-button class="full-width" color="accent">Submit</button>
  `,
  styles: [
    `
    h4, p {
      margin-top: 2px;
      margin-bottom: 0;
    }

    .box {
      margin-top: 10px;
    }

    button{
      margin-top: 15px;
    } 

    .full-width {
      width: 100%;
    }

    .half-width {
      width: 47%;
    }

    .flex_row {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    }

    mat-card {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    `
  ]
})
export class NewCourseSummaryComponent implements OnInit {

  @Input() newCourseSummary: NewCourseSummary
  @Input() submitHandler: Function;

  public holes: GolfHole[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public submit() {
    this.submitHandler();
  }
}