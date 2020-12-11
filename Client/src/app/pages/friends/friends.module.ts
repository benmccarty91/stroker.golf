import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from './friends.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FriendItemComponent } from './friend-item/friend-item.component';
import { FriendDetailsComponent } from './friend-details/friend-details.component';
import { FriendScoresComponent } from './friend-scores/friend-scores.component';
import { PastScoresModule } from '../past-scores/past-scores.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    FriendsComponent,
    AddFriendComponent,
    FriendItemComponent,
    FriendDetailsComponent,
    FriendScoresComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    PastScoresModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class FriendsModule { }
