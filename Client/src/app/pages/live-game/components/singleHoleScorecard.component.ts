import { Component, Input, OnInit } from "@angular/core";
import { LiveRound } from 'src/models/LiveRound';
import { GolfHole } from 'src/models/GolfHole';

@Component({
  selector: 'single-hole-scorecard',
  templateUrl: './singleHoleScorecard.component.html',
  styleUrls: ['./singleHoleScorecard.component.scss']
})
export class SingleHoleScorecardComponent implements OnInit {
  
  @Input() liveRound: LiveRound;
  @Input() holeNumber: number;

  public thisHole: GolfHole;

  constructor(
  ) {}

  ngOnInit(): void {
    this.thisHole = this.liveRound.Course.Holes.find(x => x.Number === this.holeNumber)
  }

}