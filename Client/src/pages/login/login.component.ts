import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { DeviceService } from 'src/services/DeviceService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BASE_PAGE implements OnInit {

  constructor(
    private authService: AuthService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private router: Router,
    private deviceService: DeviceService
  ) { super(pubsubService, consts); }

  ngOnInit(): void {
    console.log(`isAndroid?: ${this.deviceService.isAndroid()}`);
    console.log(`isIOS?: ${this.deviceService.isIOS()}`);
  }

  public isIOS(): boolean {
    return this.deviceService.isIOS();
  }

  public isAndroid(): boolean {
    return this.deviceService.isAndroid();
  }
}
