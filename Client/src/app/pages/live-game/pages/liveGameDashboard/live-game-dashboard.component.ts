import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  templateUrl: './live-game-dashboard.component.html',
  styleUrls: ['./live-game-dashboard.component.scss'],
  selector: 'app-live-game-dashboard'
})
export class LiveGameDashboard implements OnInit, OnDestroy {
  public activeLiveRound: LiveRound;
  private $activeLiveRound: Subscription;


  constructor(
    private liveRoundService: LiveRoundService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.$activeLiveRound = this.liveRoundService.getActiveRound().subscribe(x => {
      this.activeLiveRound = x;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  public ngOnDestroy(): void {
    this.$activeLiveRound.unsubscribe();
  }

  public fabClicked(): void {
    if (!this.activeLiveRound) { //button creates a new game
      this.router.navigateByUrl('/liveGame/newGame');
    }
  }

  public friendsGameButtonClicked(): void {
    this.dialog.open(NotImplementedYetComponent);
  }
}

@Component({
  template: `
  <h3>Doesn't work yet :(</h3>
  `
})
export class NotImplementedYetComponent {
  constructor(
    public dialogRef: MatDialogRef<NotImplementedYetComponent>,
  ) { }
}