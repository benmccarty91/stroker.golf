import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { Score } from 'src/models/Score';
import { StrokerUser } from 'src/models/StrokerUser';
import { PubSubService } from 'src/services/PubSubService';
import { ScoreService } from 'src/services/ScoreService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public loading: Boolean = true;
  public user: StrokerUser;
  public scores: Score[] = null;

  constructor(
    private userService: UserService,
    private pubSub: PubSubService,
    private consts: CONSTS,
    private router: Router,
    private localStorage: StorageMap,
    private scoreService: ScoreService
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.loading = false;
      this.pubSub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });

    this.localStorage.get<Score[]>(this.consts.APP_DATA.SCORE_SUBMISSIONS).subscribe((scores: Score[]) => {
      this.scores = scores;
    })
  }

  public async editFabClicked(): Promise<void> {
    await this.router.navigateByUrl('/profile/edit')
  }

  public upload(score: Score): void {
    this.scoreService.postScore(score).subscribe(
      () => {
        this.removeScoreFromStorage(score);
      },
      (err) => { alert('something went wrong') }
    )
  }

  public delete(score: Score): void {
    this.removeScoreFromStorage(score);
  }

  private removeScoreFromStorage(score: Score): void {
    const index = this.scores.indexOf(score);
    this.scores.splice(index, 1);
    this.localStorage.set(this.consts.APP_DATA.SCORE_SUBMISSIONS, this.scores).subscribe(() => { });
  }


}
