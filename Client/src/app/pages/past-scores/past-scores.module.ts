import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastScoresComponent } from './past-scores.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [PastScoresComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class PastScoresModule { }
