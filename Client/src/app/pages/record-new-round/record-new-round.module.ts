import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordNewRoundComponent } from './record-new-round.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { NumberPickerModule } from 'src/app/shared/components/number-picker/number-picker.module';
import { FriendsModule } from '../friends/friends.module';
import { ChooseCourseComponent } from './components/choose-course.component';
import { ChooseRoundTypeComponent } from './components/choose-round-type.component';
import { ChooseDateComponent } from './components/choose-date.component';
import { ChooseTeeboxComponent } from './components/choose-teebox.component';
import { ChooseScoreComponent } from './components/choose-score.component';
import { ChooseFriendsComponent } from './components/choose-friends.component';
import { ChooseFriendsScoresComponent } from './components/choose-friends-scores.component';
import { ConfirmSummaryComponent } from './components/confirm-summary.component';
import { SubmitSuccessComponent } from './components/submit-success.component';
import { SubmitFailureComponent } from './components/submit-failure.component';



@NgModule({
  declarations: [RecordNewRoundComponent, ChooseCourseComponent, ChooseRoundTypeComponent, ChooseDateComponent, ChooseTeeboxComponent, ChooseScoreComponent, ChooseFriendsComponent, ChooseFriendsScoresComponent, ConfirmSummaryComponent, SubmitSuccessComponent, SubmitFailureComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NumberPickerModule,
    FriendsModule
  ]
})
export class RecordNewRoundModule { }
