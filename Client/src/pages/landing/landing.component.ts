import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { ApiService } from 'src/services/ApiService';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BASE_PAGE implements OnInit {

  public user: StrokerUser = null;
  public displayName = null;

  constructor(
    private authService: AuthService,
    private storageService: StorageMap,
    pubsubService: PubSubService,
    private consts: CONSTS,
  ) {
    super(pubsubService, consts);
  }

  ngOnInit(): void {
    this.storageService.get(this.consts.APP_DATA.USER).subscribe(user => {
      this.user = user as StrokerUser;
      this.displayName = this.user ? this.user.displayName : null;
    });
    // this.api.get('/test/bentest').subscribe(x => {
    //   console.log(x);
    //   // this.apiResponse = x.message;
    // });
  }
}
