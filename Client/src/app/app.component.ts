import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.init().subscribe(x => {
      const loggedIn = this.authService.loggedIn();
      if (!loggedIn) {
        this.router.navigateByUrl('/login');
      }
      else {
        this.router.navigateByUrl('/landing');
      }
    });
  }
}
