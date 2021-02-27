import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { EditProfileComponent } from './edit-profile/editProfile.component';
import { ChangePhotoDialogComponent } from './edit-profile/changePhoto.dialog';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, ChangePhotoDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
