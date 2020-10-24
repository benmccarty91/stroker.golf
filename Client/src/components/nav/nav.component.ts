import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { loggedIn } from '@angular/fire/auth-guard';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/services/AuthService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  public opened: boolean;
  public isLoggedIn: boolean = false;

  private currentRoute: string = '';
  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    this.currentRoute = this.location.path();
    this.authService.getUser().subscribe(user => this.isLoggedIn = user ? true : false);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(_ => this.currentRoute = this.location.path());
  }

  ngOnDestroy(): void {
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  handleLink(route: string): void {
    if (this.appComponent.smallScreen) {
      this.toggleSidenav.emit();
    }
    if (!this.isLoggedIn || route === this.currentRoute) {
      return;
    }
    if (route === '/logOut') {
      this.authService.logOut().then(_ => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.currentRoute = route;
      // navigation logic
    }
  }
}
