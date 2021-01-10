import { Component, Input, OnInit } from "@angular/core";
import { GolfHole } from 'src/models/GolfHole';
import { TeeBox } from 'src/models/TeeBox';
import { NewCourseSummary } from "../models/newCourseSummary";

@Component({
  selector: 'app-course-holes-form',
  template: `
    <h2>Please define the holes</h2>
    <form (ngSubmit)="submit()" #teeboxForm="ngForm" autocomplete="off">
      <mat-card *ngFor="let hole of holes; index as i">
        <h4>#{{hole.Number}}</h4>
        <div class="flex_row">
          <mat-form-field class="half-width">
            <mat-label>Par</mat-label>
            <input type="text" required matInput name="hole.par{{i}}" [(ngModel)]="hole.Par">
          </mat-form-field>
          <mat-form-field class="half-width">
            <mat-label>Handicap</mat-label>
            <input type="text" required matInput name="hole.handicap{{i}}" [(ngModel)]="hole.Handicap">
          </mat-form-field>
        </div>
        <mat-card>
            <h5>Yardages</h5>
            <mat-form-field class="full-width" *ngFor="let yard of hole.Yardages | keyvalue; index as j; trackBy: trackByFn">
              <mat-label>{{yard.key}}</mat-label>
              <input type="tel" required matInput name="hole.yardage{{i}}.{{j}}" [(ngModel)]="hole.Yardages[yard.key]">
            </mat-form-field>
        </mat-card>

      </mat-card>
      <button type="submit" [disabled]="!teeboxForm.form.valid" mat-stroked-button class="full-width"
        color="primary">Next</button>
    </form>
  `,
  styles: [
    `
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
      margin-bottom: 15px;
    }
    `
  ]
})
export class CourseHoleComponent implements OnInit {

  @Input() newCourseSummary: NewCourseSummary
  @Input() submitHandler: Function;

  public holes: GolfHole[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.newCourseSummary.newGolfCourse.Holes.length > 0 && this.newCourseSummary.newGolfCourse.Holes.length == this.newCourseSummary.numHoles) {
      this.holes = this.newCourseSummary.newGolfCourse.Holes;
    } else {
      const yardageTemplate = {};
      this.newCourseSummary.newGolfCourse.TeeBoxes.forEach(x => {
        yardageTemplate[x.Color] = undefined;
      });
      for (var i = 0; i < this.newCourseSummary.numHoles; i++) {
        this.holes.push({
          Number: i+1,
          Par: undefined,
          Handicap: undefined,
          Yardages: {
            ...yardageTemplate
          }
        })
      }
    }
  }

  public submit() {
    this.newCourseSummary.newGolfCourse.Holes = this.holes;
    this.submitHandler();
  }

  // idk why this is required, but without it the user loses focus when entering
  // yardage values.  It has something to do with the keyvalue pipe function
  public trackByFn(item) {
    return item;
  }
}