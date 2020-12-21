import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPickerComponent } from './number-picker.component';
import { MaterialModule } from '../../material.module';
import { NumberPickerSmallComponent } from './number-picker-small.component';



@NgModule({
  declarations: [NumberPickerComponent, NumberPickerSmallComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NumberPickerComponent,
    NumberPickerSmallComponent
  ]
})
export class NumberPickerModule { }
