import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public loading: Boolean = true;
  public user: StrokerUser;

  constructor(
    private userService: UserService,
    private pubSub: PubSubService,
    private consts: CONSTS,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.loading = false;
      this.pubSub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  public async editFabClicked(): Promise<void> {
    await this.router.navigateByUrl('/profile/edit')
  }

}
