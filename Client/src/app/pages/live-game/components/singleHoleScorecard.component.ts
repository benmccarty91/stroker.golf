import { Component, Input, OnInit } from "@angular/core";
import { LiveRound } from 'src/models/LiveRound';

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