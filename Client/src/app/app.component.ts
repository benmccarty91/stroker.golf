import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/LoginService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const loggedIn = this.loginService.LoggedIn();
    if (!loggedIn) {
      this.router.navigateByUrl('/Login');
    }
    else {
      this.router.navigateByUrl('/Landing');
    }
  }
}
