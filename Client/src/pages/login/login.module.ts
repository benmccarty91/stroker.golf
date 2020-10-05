import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { GoogleSignInModule } from 'src/components/google-sign-in/google-sign-in.module';
import { FacebookSignInModule } from 'src/components/facebook-sign-in/facebook-sign-in.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    GoogleSignInModule,
    FacebookSignInModule
  ]
})
export class LoginModule { }
