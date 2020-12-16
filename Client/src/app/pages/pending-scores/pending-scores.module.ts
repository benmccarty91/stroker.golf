import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingScoresComponent } from './pending-scores.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PastScoresModule } from '../past-scores/past-scores.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [PendingScoresComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PastScoresModule
  ]
})
export class PendingScoresModule { }
