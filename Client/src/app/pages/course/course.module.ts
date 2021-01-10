import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from '../course/course.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseMetaComponent } from './components/courseMeta.component';



@NgModule({
  declarations: [CourseComponent, CourseMetaComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CourseModule { }
