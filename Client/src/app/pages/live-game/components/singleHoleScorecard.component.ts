import { Component, Input, OnInit } from "@angular/core";
import { LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore } from 'src/models/LiveRound';
import { Subscription, timer } from 'rxjs';
import { LiveRoundService } from 'src/services/LiveRoundService';

@Component({
  selector: 'single-hole-scorecard',
  templateUrl: './singleHoleScorecard.component.html',
  styleUrls: ['./singleHoleScorecard.component.scss']
})
export class SingleHoleScorecardComponent implements OnInit {
  
  @Input() liveRound: LiveRound;
  @Input() holeNumber: number;

  constructor(
  ) {}

  ngOnInit(): void {
  }

}