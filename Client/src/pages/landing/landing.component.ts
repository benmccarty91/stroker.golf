import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { timer } from 'rxjs';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { ApiService } from 'src/services/ApiService';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BASE_PAGE implements OnInit {

  public user: User = null;
  public displayName = null;

  constructor(
    private authService: AuthService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private api: ApiService,
    private router: Router
  ) {
    super(pubsubService, consts);
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe(x => {
      this.user = x;
      this.displayName = this.user ? this.user.displayName : null;
    });
    this.api.get('/test/bentest').subscribe(x => {
      console.log(x);
      // this.apiResponse = x.message;
    });
  }
}
