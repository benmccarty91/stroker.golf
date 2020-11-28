import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { timer } from 'rxjs';
import { filter, mergeMap, switchMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  private readonly SMALL_WIDTH_SCREEN = 720;
  public smallScreen: boolean;
  public appLoading: boolean = true;

  constructor(
    private router: Router,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.setupSubs();
  }

  ngAfterViewInit(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
  }

  setupSubs(): void {
    this.pubsubService.$sub(this.consts.EVENTS.PAGE_LOAD_COMPLETE).pipe(
      switchMap(() => timer(1000))
    ).subscribe(() => {
      this.appLoading = false;
    });

    this.pubsubService.$sub(this.consts.EVENTS.DATA_LOAD_COMPLETE).subscribe(() => {
      this.appLoading = false;
    });

    this.pubsubService.$sub(this.consts.EVENTS.DATA_LOAD_START).subscribe(() => {
      this.appLoading = true;
    });

    this.pubsubService.$sub(this.consts.EVENTS.PAGE_LOAD_START).subscribe(() => {
      this.appLoading = true;
    });

    this.breakpointObserver.observe([`(max-width: ${this.SMALL_WIDTH_SCREEN}px)`]).subscribe(state => {
      this.smallScreen = state.matches;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(_ => this.appLoading = true);
  }
}
