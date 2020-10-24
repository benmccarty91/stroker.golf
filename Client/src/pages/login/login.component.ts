import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
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
    private router: Router
  ) { super(pubsubService, consts); }

  ngOnInit(): void {
  }
}
