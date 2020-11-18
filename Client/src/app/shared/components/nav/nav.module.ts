import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AppRoutingModule } from 'src/app/app-routing.module';


@NgModule({
  declarations: [NavComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule
  ],
  exports: [NavComponent]
})
export class NavModule { }
