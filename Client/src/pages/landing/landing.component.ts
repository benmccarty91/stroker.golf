import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { timer } from 'rxjs';
import { AuthService } from 'src/services/AuthService';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public user: User = null;
  public displayName = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(x => {
      this.user = x;
      this.displayName = this.user ? this.user.displayName : null;
    });
  }

}
