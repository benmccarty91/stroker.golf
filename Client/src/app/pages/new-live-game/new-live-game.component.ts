import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { LiveRound } from 'src/models/LiveRound';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-new-live-game',
  templateUrl: './new-live-game.component.html',
  styleUrls: ['./new-live-game.component.scss']
})
export class NewLiveGameComponent implements OnInit, OnDestroy {

  public activeLiveRound: LiveRound;
  public creatingGame: boolean = false;
  private $activeLiveRound: Subscription;

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private liveRoundService: LiveRoundService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.$activeLiveRound = this.liveRoundService.getActiveRound().subscribe(x => {
      this.activeLiveRound = x;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  ngOnDestroy(): void {
    this.$activeLiveRound.unsubscribe();
  }

  newGameClicked(): void {
    this.creatingGame = true;

  }

  friendsGameButtonClicked(): void {
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
  ) {}
}
