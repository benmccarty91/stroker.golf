import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { CourseService } from 'src/services/CourseService';
import { PubSubService } from 'src/services/PubSubService';
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
  public errorMessage = '';

  constructor(
    private courseService: CourseService,
    private pubsub: PubSubService,
    private consts: CONSTS,
    private router: Router
  ) { }

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
    this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
  }

  public incrementStep = (): void => {
    this.stepHistory.push(this.step);
    this.step++;
    // console.log(this.summary);
  }

  public decrementStep = (): void => {
    this.step = this.stepHistory.pop();
  }

  public goHome = (): void => {
    this.router.navigateByUrl('/landing');
  }

  public submitFinal = (): void => {
    // console.log(this.summary.newGolfCourse);
    this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.courseService.postCourse(this.summary.newGolfCourse).subscribe(
    x => {
      this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      this.incrementStep();
    },
    err => {
      if (err.status === 409) {
        this.errorMessage = 'Looks like that course already exists.'
        this.step = -1;
        this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      } else {
        this.courseService.saveToDevice(this.summary.newGolfCourse).subscribe(() => {
          this.errorMessage = `We couldn't communicate with our services.  Don't worry though, we've saved your new course to your device and you can try to upload it again later.`;
          this.step = -1;
          this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
        })
      }
    });
  }
}
