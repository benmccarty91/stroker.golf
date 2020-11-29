import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { Score } from 'src/models/Score';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-past-scores',
  templateUrl: './past-scores.component.html',
  styleUrls: ['./past-scores.component.scss']
})
export class PastScoresComponent implements OnInit {

  public loading: boolean = true;
  public selectedYear: string = `${this.getYear()}`;
  public yearList: string[] = [this.selectedYear, `${this.getYear() - 1}`, `${this.getYear() - 2}`];

  private scores: Score[] = [];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchScores(this.selectedYear);
  }

  public selectorChanged(event: any): void {
    this.scores = [];
    this.loading = true;
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.fetchScores(this.selectedYear);
  }

  public getScores(): Score[] {
    return this.scores.sort((a: Score, b: Score) => {
      return b.Date - a.Date;
    });
  }

  public getYear(): number {
    return moment().year();
  }

  private async fetchScores(year: string): Promise<void> {
    const userId = await this.userService.getUserId();
    this.apiService.get<Score[]>(`/score/${userId}/${year}`).subscribe(x => {
      this.scores = x;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      this.loading = false;
    });
  }

}
