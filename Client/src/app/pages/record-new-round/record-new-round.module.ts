import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordNewRoundComponent } from './record-new-round.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { NumberPickerModule } from 'src/app/shared/components/number-picker/number-picker.module';



@NgModule({
  declarations: [RecordNewRoundComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NumberPickerModule
  ]
})
export class RecordNewRoundModule { }
