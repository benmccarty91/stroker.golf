import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GolfCourse } from 'src/models/GolfCourse';
import { v4 as uuid } from 'uuid';
import { NewCourseSummary } from './models/newCourseSummary';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public summary: NewCourseSummary;

  public step: number = 1;
  public stepHistory: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.summary = {
      newGolfCourse: {
        Id: uuid(),
        Name: '',
        StreetAddress: '',
        City: '',
        State: '',
        TeeBoxes: [],
        Holes: []
      },
      numHoles: undefined,
      numTeeboxes: undefined
    }
  }

  public incrementStep = (): void => {
    this.stepHistory.push(this.step);
    this.step++;
    console.log(this.summary);
  }

  public decrementStep = (): void => {
    this.step = this.stepHistory.pop();
  }

}
