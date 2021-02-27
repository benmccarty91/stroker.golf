import { BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { loggedIn } from '@angular/fire/auth-guard';
import { NavigationEnd, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly SMALL_WIDTH_SCREEN = 720;
  private smallScreen: boolean = false;
  private $breakPoint: Subscription;
  private $navEnd: Subscription;
  private $logIn: Subscription;
  private $logOut: Subscription;

  public opened: boolean;
  public isLoggedIn: boolean = false;

  private currentRoute: string = '';
  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router,
    private userService: UserService,
    private location: Location,
    private authService: AuthService,
    private consts: CONSTS,
    private pubSubService: PubSubService,
    private breakpointObserver: BreakpointObserver
  ) { }

  async ngOnInit(): Promise<void> {
    this.userService.isLoggedIn().subscribe(x => this.isLoggedIn = x);
    this.currentRoute = this.location.path();
    this.$navEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(_ => this.currentRoute = this.location.path());
    this.$breakPoint = this.breakpointObserver.observe([`(max-width: ${this.SMALL_WIDTH_SCREEN}px)`]).subscribe(state => this.smallScreen = state.matches);
  }

  ngOnDestroy(): void {
    this.$logIn.unsubscribe();
    this.$logOut.unsubscribe();
    this.$breakPoint.unsubscribe();
    this.$navEnd.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  handleLink(route: string): void {
    if (this.smallScreen) { // hide drawer menu if on small device
      this.toggleSidenav.emit();
    }
    if (!this.isLoggedIn || route === this.currentRoute) { // not logged in: menu disabled.
      return; // tap on active page, do nothing.
    }
    if (route === '/logOut') { // tap logout, handle logout and redirect to login
      this.authService.logOut().then(_ => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.router.navigateByUrl(route);
    }
  }

  private isUserInitiallyLoggedIn(): Observable<boolean> {
    return this.userService.isLoggedIn();
  }
}
