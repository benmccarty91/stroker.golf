import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordNewRoundComponent } from './record-new-round.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { NumberPickerModule } from 'src/app/shared/components/number-picker/number-picker.module';
import { FriendsModule } from '../friends/friends.module';



@NgModule({
  declarations: [RecordNewRoundComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NumberPickerModule,
    FriendsModule
  ]
})
export class RecordNewRoundModule { }
