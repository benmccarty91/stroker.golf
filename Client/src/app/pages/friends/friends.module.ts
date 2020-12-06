import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from './friends.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FriendItemComponent } from './friend-item/friend-item.component';
import { FriendDetailsComponent } from './friend-details/friend-details.component';



@NgModule({
  declarations: [FriendsComponent, AddFriendComponent, FriendItemComponent, FriendDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]})
export class FriendsModule { }
