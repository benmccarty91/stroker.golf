import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isLoggedIn: boolean = false;

  private currentRoute: string = '';
  private $navEnd: Subscription;
  private $navStart: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    this.currentRoute = this.location.path();
    this.authService.getUser().subscribe(user => this.isLoggedIn = user ? true : false);
    this.$navEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(_ => this.currentRoute = this.location.path());
    this.$navStart = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(_ => {});
  }

  ngOnDestroy(): void {
    this.$navEnd.unsubscribe();
    this.$navStart.unsubscribe();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  handleLink(route: string): void {
    if (route === '/logOut') {
      this.authService.logOut().then(_ => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.currentRoute = route;
    }
  }
}
