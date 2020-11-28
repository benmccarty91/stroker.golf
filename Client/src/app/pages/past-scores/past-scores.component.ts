import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { Score } from 'src/models/ScoreSubmission';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-past-scores',
  templateUrl: './past-scores.component.html',
  styleUrls: ['./past-scores.component.scss']
})
export class PastScoresComponent implements OnInit {

  private scores: Score[];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchScores(moment().year());
  }

  public getScores(): Score[] {
    return this.scores;
  }

  private async fetchScores(year: number): Promise<void> {
    const userId = await this.userService.getUserId();
    this.apiService.get<Score[]>(`/score/${userId}/${year}`).subscribe(x => {
      this.scores = x;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

}
