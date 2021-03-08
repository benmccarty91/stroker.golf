import { Component, Input, OnInit } from "@angular/core";
import { CONSTS } from "src/assets/CONSTS";
import { GolfCourse } from "src/models/GolfCourse";
import { CourseService } from "src/services/CourseService";
import { PubSubService } from "src/services/PubSubService";

@Component({
  template: `
  <div class="column_div">
    <div class="column_div" *ngIf="step === 1">
      <h2>Which course?</h2>
      <mat-form-field appearance="fill">
        <mat-label>Select Course</mat-label>
        <mat-select [(value)]="summary.selectedCourse">
          <mat-option *ngFor="let course of courses" [value]="course">
            {{course.Name}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div class="row_div">
      <button *ngIf="step !== 10 && stepHistory.length > 0" mat-flat-button color="primary" class="half_width_button" (click)="back()">Back</button>
      <button *ngIf="step !== 10" mat-flat-button color="accent" [ngClass]="{'half_width_button' : stepHistory.length >= 1, 'full_width_button' : stepHistory.length < 1}" (click)="next()">Next</button>

      <button *ngIf="step === 10" mat-flat-button color="primary" class="half_width_button" (click)="createCancelClicked()">Cancel</button>
      <button *ngIf="step === 10" mat-flat-button color="accent" class="half_width_button" (click)="createGameClicked()">Create</button>
    </div>
  </div>
  `,
  styles: [`
    .column_div {
      display: flex;
      flex-direction: column;
    }

    .row_div {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    button {
      margin-top: 15px;
    }

    .half_width_button {
      width: 45%;
    }

    .full_width_button {
      width: 100%;
    }
  `],
  selector: 'app-create-live-round'
})
export class CreateGameComponent implements OnInit {

  public step: number = 1;
  public courses: GolfCourse[];
  public summary: any;
  public stepHistory: number[];
  @Input() submitHandler: Function;
  @Input() cancelHandler: Function;


  constructor(
    private courseService: CourseService,
    private pubSub: PubSubService,
    private consts: CONSTS
  ) {
    this.summary = {};
    this.stepHistory = new Array<number>();
  }

  public ngOnInit(): void {
    this.fetchCourses();
  }

  public back(): void {
    this.step = this.stepHistory.pop();
  }

  public next(num: number = 1): void {
    this.stepHistory.push(this.step);
    this.step += num;
  }

  public createCancelClicked(): void {
    console.log('CANCEL');
    this.cancelHandler();
  }

  public createGameClicked(): void {
    console.log('CREATING GAME');
    this.submitHandler({ message: 'hello' });
  }

  private fetchCourses(): void {
    this.pubSub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses.sort((a, b) => {
        const nameA = a.Name.toUpperCase();
        const nameB = b.Name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameB < nameA) {
          return 1;
        }
        return 0;
      });
      this.pubSub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }
}