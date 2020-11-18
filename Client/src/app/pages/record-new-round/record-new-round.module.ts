import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordNewRoundComponent } from './record-new-round.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [RecordNewRoundComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class RecordNewRoundModule { }
