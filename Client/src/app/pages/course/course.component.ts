import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GolfCourse } from 'src/models/GolfCourse';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  public courseFormControl = new FormControl('', [
    Validators.required
  ]);

  public newGolfCourse: GolfCourse;
  public newGolfCourse_numTeeboxes: number;
  public newGolfCourse_numHoles: number;

  constructor() { }

  ngOnInit(): void {
    this.newGolfCourse = {
      Id: uuid(),
      Name: '',
      StreetAddress: '',
      City: '',
      State: '',
      TeeBoxes: [],
      Holes: []
    };
  }

  public submitMeta(): void {
    if (this.courseFormControl.valid) {
      console.log(JSON.stringify(this.newGolfCourse));
      console.log(this.newGolfCourse_numHoles);
      console.log(this.newGolfCourse_numTeeboxes);
    } else {
      console.log('form invalid');
    }
  }

}
