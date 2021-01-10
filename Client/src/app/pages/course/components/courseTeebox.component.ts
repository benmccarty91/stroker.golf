import { Component, Input, OnInit } from "@angular/core";
import { TeeBox } from 'src/models/TeeBox';
import { NewCourseSummary } from "../models/newCourseSummary";

@Component({
  selector: 'app-course-teebox-form',
  template: `
    <h2>Tell us about the teeboxes</h2>
    <form (ngSubmit)="submit()" #teeboxForm="ngForm" autocomplete="off">
      <mat-card *ngFor="let teebox of teeboxes; index as i">
        <mat-form-field class="full-width" >
          <mat-label>Teebox Color</mat-label>
          <input type="text" required matInput name="teebox.Color.{{i}}" [(ngModel)]="teebox.Color">
        </mat-form-field>
        <div class="flex_row">
          <mat-form-field class="half-width" >
            <mat-label>Men's Rating</mat-label>
            <input type="tel" placeholder="ex. 50" required matInput name="teebox.MensRating.{{i}}" [(ngModel)]="teebox.MensRating">
          </mat-form-field>
          <mat-form-field class="half-width" >
            <mat-label>Men's Slope</mat-label>
            <input type="tel" placeholder="ex. 110" required matInput name="teebox.MensSlope.{{i}}" [(ngModel)]="teebox.MensSlope">
          </mat-form-field>
        </div>
        <div class="flex_row">
          <mat-form-field class="half-width" >
            <mat-label>Women's Rating</mat-label>
            <input type="tel" placeholder="ex. 50" required matInput name="teebox.WomensRating.{{i}}" [(ngModel)]="teebox.WomensRating">
          </mat-form-field>
          <mat-form-field class="half-width" >
            <mat-label>Women's Slope</mat-label>
            <input type="tel" placeholder="ex. 110" required matInput name="teebox.WomensSlope.{{i}}" [(ngModel)]="teebox.WomensSlope">
          </mat-form-field>
        </div>
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
export class CourseTeeboxComponent implements OnInit {

  @Input() newCourseSummary: NewCourseSummary
  @Input() submitHandler: Function;

  public teeboxes: TeeBox[];

  constructor() { }

  ngOnInit(): void {
    if (this.newCourseSummary.newGolfCourse.TeeBoxes.length > 0 && this.newCourseSummary.newGolfCourse.TeeBoxes.length == this.newCourseSummary.numTeeboxes) {
      this.teeboxes = this.newCourseSummary.newGolfCourse.TeeBoxes;
    } else {
      this.teeboxes = new Array<TeeBox>();
      for (var i = 0; i < this.newCourseSummary.numTeeboxes; i++) {
        this.teeboxes.push({
          Color: '',
          MensRating: undefined,
          MensSlope: undefined,
          WomensRating: undefined,
          WomensSlope: undefined
        });
      }
    }
  }

  public submit() {
    this.newCourseSummary.newGolfCourse.TeeBoxes = this.teeboxes;
    this.submitHandler();
  }
}