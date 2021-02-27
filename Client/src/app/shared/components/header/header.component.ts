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
    this.userService.isLoggedIn().subscribe(x => {
      this.loggedIn = x;
    });
  }

  profileClicked(): void {
    this.router.navigateByUrl('/profile');
  }

}
