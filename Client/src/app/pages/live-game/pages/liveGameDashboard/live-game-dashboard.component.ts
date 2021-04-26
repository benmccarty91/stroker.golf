import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound } from 'src/models/LiveRound';
import { StrokerUser } from 'src/models/StrokerUser';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  templateUrl: './live-game-dashboard.component.html',
  styleUrls: ['./live-game-dashboard.component.scss'],
  selector: 'app-live-game-dashboard'
})
export class LiveGameDashboard implements OnInit, OnDestroy {
  public activeLiveRound: LiveRound;
  public user: StrokerUser;
  private $activeLiveRound: Subscription;
  private $user: Subscription;


  constructor(
    private liveRoundService: LiveRoundService,
    private userService: UserService,
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.userService.getUser().subscribe(x => {
      this.user = x;
    });
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
    } else {
      this.router.navigateByUrl('/liveGame/currentGame');
    }
  }

  public friendsGameButtonClicked(): void {
    this.dialog.open(NotImplementedYetComponent);
  }

  public goToGame(): void {
    this.router.navigateByUrl('/liveGame/currentGame');
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