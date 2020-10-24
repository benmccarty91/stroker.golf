import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { timer } from 'rxjs';
import { filter, mergeMap, switchMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  template: ``
})
export class BASE_PAGE implements AfterViewInit {

  constructor(
    private pubSub: PubSubService,
    private constss: CONSTS,
  ) {
  }

  ngAfterViewInit(): void {
    this.pubSub.$pub(this.constss.EVENTS.PAGE_LOAD_COMPLETE);
  }
}
