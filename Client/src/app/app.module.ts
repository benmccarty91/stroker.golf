import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { LoginModule } from 'src/pages/login/login.module';
import { LandingModule } from 'src/pages/landing/landing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavModule } from 'src/components/nav/nav.module';

import { MaterialModule } from './shared/material.module';
import { HeaderModule } from 'src/components/header/header.module';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    LoginModule,
    LandingModule,
    BrowserAnimationsModule,
    NavModule,
    HeaderModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
