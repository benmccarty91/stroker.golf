import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from '../landing/landing.component';
import { GoogleSignInModule } from 'src/components/google-sign-in/google-sign-in.module';



@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule
  ]
})
export class LandingModule { }
