import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public opened: boolean;
  public loggedIn: boolean = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router,
    private userService: UserService,
    private pubSub: PubSubService,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.userService.isLoggedIn().then(x => {
      this.loggedIn = x;
    })
    this.pubSub.$sub(this.consts.EVENTS.LOGGED_OUT).subscribe(x => {
      this.loggedIn = false;
    });
    this.pubSub.$sub(this.consts.EVENTS.LOGGED_IN).subscribe(x => {
      this.loggedIn = true;
    })
  }

  profileClicked(): void {
    this.router.navigateByUrl('/profile');
  }

}
