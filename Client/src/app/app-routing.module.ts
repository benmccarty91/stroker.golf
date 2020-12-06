import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from 'src/app/pages/landing/landing.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { TestComponent } from 'src/app/pages/test/test.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AuthRedirectGuard } from './route-guards/login-redirect-route-guard';
import { RecordNewRoundComponent } from './pages/record-new-round/record-new-round.component';
import { NewLiveGameComponent } from './pages/new-live-game/new-live-game.component';
import { PastScoresComponent } from './pages/past-scores/past-scores.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { AddFriendComponent } from './pages/friends/add-friend/add-friend.component';
import { FriendDetailsComponent } from './pages/friends/friend-details/friend-details.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToLanding = () => redirectLoggedInTo(['landing']);


const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard, AuthRedirectGuard],
    data: { authGuardPipe: redirectLoggedInToLanding }
  },
  {
    path: 'newScore',
    component: RecordNewRoundComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'liveGame',
    component: NewLiveGameComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'scores',
    component: PastScoresComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'friends/add',
    component: AddFriendComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'friends/:id',
    component: FriendDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
