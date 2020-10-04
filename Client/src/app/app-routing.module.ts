import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from 'src/pages/Landing/landing/landing.component';
import { LoginComponent } from 'src/pages/Login/login/login.component';

const routes: Routes = [
  {
    path: 'Landing',
    component: LandingComponent
  },
  {
    path: 'Login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
