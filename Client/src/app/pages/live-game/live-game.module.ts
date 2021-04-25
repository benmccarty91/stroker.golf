import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { NewLiveGameComponent } from './pages/newLiveGame/new-live-game.component';
import { LiveGameDashboard } from './pages/liveGameDashboard/live-game-dashboard.component';
import { RecordNewRoundModule } from '../record-new-round/record-new-round.module';
import { FriendTeeboxSelect } from './components/friend-teebox-select.component';
import { NewGameSummary } from './components/newGameSummary.component';
import { ErrorComponent } from './components/error.component';
import { CurrentLiveGameComponent } from './pages/currentLiveGame/currentLiveGame.component';
import { SingleHoleScorecardComponent } from './components/singleHoleScorecard.component';
import { SingleHoleSinglePlayerComponent } from './components/singleHoleSinglePlayer.component';
import { SubmitLiveGameConfirmComponent } from './components/modals/submitLiveGameConfirm.component';
import { NineHoleConfirmComponent } from './components/modals/nineHoleConfirm.component';
import { AbortGameConfirmComponent } from './components/modals/abortGameConfirm.component';
import { ChangeRoundTypeComponent } from './components/modals/changeRoundType.component';

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
  },
  {
    path: 'currentGame',
    component: CurrentLiveGameComponent
  }
]

@NgModule({
  declarations: [
    NewLiveGameComponent, 
    LiveGameDashboard, 
    FriendTeeboxSelect, 
    NewGameSummary, 
    ErrorComponent, 
    CurrentLiveGameComponent, 
    SingleHoleScorecardComponent, 
    SingleHoleSinglePlayerComponent,
    SubmitLiveGameConfirmComponent,
    NineHoleConfirmComponent,
    AbortGameConfirmComponent,
    ChangeRoundTypeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RecordNewRoundModule,
    RouterModule.forChild(routes)
  ]
})
export class LiveGameModule { }
