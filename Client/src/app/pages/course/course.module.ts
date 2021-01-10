import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from '../course/course.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseMetaComponent } from './components/courseMeta.component';
import { CourseTeeboxComponent } from './components/courseTeebox.component';
import { CourseHoleComponent } from './components/courseHoles.component'
import { NewCourseSummaryComponent } from './components/newCourseSummary.component';



@NgModule({
  declarations: [
    CourseComponent, 
    CourseMetaComponent, 
    CourseTeeboxComponent,
    CourseHoleComponent,
    NewCourseSummaryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CourseModule { }
