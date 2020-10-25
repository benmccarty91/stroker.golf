import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-facebook-sign-in',
  templateUrl: './facebook-sign-in.component.html',
  styleUrls: ['./facebook-sign-in.component.scss']
})
export class FacebookSignInComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  facebookAuth(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.authService.loginWithFacebook().then(success => {
      if (success) {
        this.router.navigateByUrl('/landing');
      } else {
        console.log('error logging in with facebook');
        this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      }
    });
  }

}
