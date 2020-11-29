import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  googleAuth(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.authService.loginWithGoogle().then(success => {
      if (success) {
        this.router.navigateByUrl('/landing');
      } else {
        this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      }
    });
  }

}
