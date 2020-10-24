import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookSignInComponent } from './facebook-sign-in.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [FacebookSignInComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FacebookSignInComponent
  ]
})
export class FacebookSignInModule { }
