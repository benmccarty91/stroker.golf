import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { StrokerUser } from 'src/models/StrokerUser';
import { ApiService } from 'src/services/ApiService';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';
import { data } from '../../../models/mocks/RiverBirch';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BASE_PAGE implements OnInit {

  public user: StrokerUser = null;
  public displayName = null;

  constructor(
    private userService: UserService,
    private api: ApiService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
  ) {
    super(pubsubService, consts);
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUser();
    this.displayName = this.user ? this.user.displayName : null;
  }

  handleLink(path: string): void {
    console.log(path);
  }

  // getTest(): void {
  //   this.api.get('/course').subscribe((x: GolfCourse) => {
  //     console.log(x);
  //   });
  // }

  // postTest(): void {
  //   console.log('test successful');
  //   console.log(data);
  //   this.api.post('/course', data).subscribe((x) => {
  //     console.log(x);
  //   });
  // }
}
