import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { NewLiveGameComponent } from './pages/newLiveGame/new-live-game.component';
import { LiveGameDashboard } from './pages/liveGameDashboard/live-game-dashboard.component';
import { RecordNewRoundModule } from '../record-new-round/record-new-round.module';
import { FriendTeeboxSelect } from './components/friend-teebox-select.component';
import { NewGameSummary } from './components/newGameSummary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: LiveGameDashboard
  },
  {
    path: 'newGame',
    component: NewLiveGameComponent
  }
]

@NgModule({
  declarations: [NewLiveGameComponent, LiveGameDashboard, FriendTeeboxSelect, NewGameSummary],
  imports: [
    CommonModule,
    MaterialModule,
    RecordNewRoundModule,
    RouterModule.forChild(routes)
  ]
})
export class LiveGameModule { }
