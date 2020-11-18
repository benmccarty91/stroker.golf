import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { GoogleSignInModule } from 'src/app/shared/components/google-sign-in/google-sign-in.module';
import { FacebookSignInModule } from 'src/app/shared/components/facebook-sign-in/facebook-sign-in.module';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MaterialModule,
    GoogleSignInModule,
    FacebookSignInModule
  ]
})
export class LoginModule { }
