import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewLiveGameComponent } from './new-live-game.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { CreateGameComponent } from './components/createGame.component';



@NgModule({
  declarations: [NewLiveGameComponent, CreateGameComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class NewLiveGameModule { }
