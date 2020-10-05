import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookSignInComponent } from './facebook-sign-in.component';



@NgModule({
  declarations: [FacebookSignInComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FacebookSignInComponent
  ]
})
export class FacebookSignInModule { }
