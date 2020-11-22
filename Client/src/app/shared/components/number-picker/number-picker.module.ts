import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPickerComponent } from './number-picker.component';
import { MaterialModule } from '../../material.module';



@NgModule({
  declarations: [NumberPickerComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NumberPickerComponent
  ]
})
export class NumberPickerModule { }
