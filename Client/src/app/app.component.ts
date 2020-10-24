import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  private readonly SMALL_WIDTH_SCREEN = 720;
  public smallScreen: boolean;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([ `(max-width: ${this.SMALL_WIDTH_SCREEN}px)` ])
    .subscribe(state => {
      this.smallScreen = state.matches;
    });
  }
}
