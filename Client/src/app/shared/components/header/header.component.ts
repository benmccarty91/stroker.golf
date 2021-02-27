import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CONSTS } from 'src/assets/CONSTS';
import { Score } from 'src/models/Score';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public opened: boolean;
  public loggedIn: boolean = false;
  public profileBadgeIcon: number = 0;

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router,
    private userService: UserService,
    private localStorage: StorageMap,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.userService.isLoggedIn().subscribe(x => {
      this.loggedIn = x;
    });
    this.localStorage.watch<Score[]>(this.consts.APP_DATA.SCORE_SUBMISSIONS).subscribe((res: Score[]) => {
      if (res) {
        this.profileBadgeIcon = res.length;
      } else {
        this.profileBadgeIcon = 0;
      }
    })
  }

  profileClicked(): void {
    this.router.navigateByUrl('/profile');
  }

}
