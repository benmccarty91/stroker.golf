import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';
import { LoginModule } from 'src/app/pages/login/login.module';
import { LandingModule } from 'src/app/pages/landing/landing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavModule } from 'src/app/shared/components/nav/nav.module';

import { MaterialModule } from './shared/material.module';
import { HeaderModule } from 'src/app/shared/components/header/header.module';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { httpInterceptorProviders } from 'src/interceptors/interceptors';
import { RecordNewRoundModule } from './pages/record-new-round/record-new-round.module';
import { PastScoresModule } from './pages/past-scores/past-scores.module';
import { FriendsModule } from './pages/friends/friends.module';
import { PendingScoresModule } from './pages/pending-scores/pending-scores.module';
import { CourseModule } from './pages/course/course.module';
import { ProfileModule } from './pages/profile/profile.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule, CONFIG, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    StorageModule.forRoot({ IDBDBName: 'Stroker.golf' }),
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({synchronizeTabs: true}),
    AngularFireAnalyticsModule,
    LoginModule,
    LandingModule,
    BrowserAnimationsModule,
    NavModule,
    HeaderModule,
    MaterialModule,
    RecordNewRoundModule,
    PastScoresModule,
    FriendsModule,
    PendingScoresModule,
    CourseModule,
    ProfileModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [
    AngularFireAuth,
    HttpClient,
    ScreenTrackingService,
    UserTrackingService,
    { provide: CONFIG, 
      useValue: {
        send_page_view: true,
        allow_ad_personalization_signals: false,
        anonymize_ip: true,
      } 
    },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
