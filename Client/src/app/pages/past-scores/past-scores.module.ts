import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastScoresComponent } from './past-scores.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PastScoreItemComponent } from './past-score-item/past-score-item.component';



@NgModule({
  declarations: [PastScoresComponent, PastScoreItemComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PastScoreItemComponent
  ]
})
export class PastScoresModule { }
