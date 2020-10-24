import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSignInComponent } from './google-sign-in.component';
import { MaterialModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [GoogleSignInComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [GoogleSignInComponent]
})
export class GoogleSignInModule {
 }
