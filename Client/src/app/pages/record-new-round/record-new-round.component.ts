import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Moment } from 'moment';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend, FriendStatus } from 'src/models/Friend';
import { GolfCourse } from 'src/models/GolfCourse';
import { GolfHole } from 'src/models/GolfHole';
import { RoundType, Score } from 'src/models/Score';
import { TeeBox } from 'src/models/TeeBox';
import { CourseService } from 'src/services/CourseService';
import { FriendService } from 'src/services/FriendService';
import { PubSubService } from 'src/services/PubSubService';
import { ScoreService } from 'src/services/ScoreService';
import { UserService } from 'src/services/UserService';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-record-new-round',
  templateUrl: './record-new-round.component.html',
  styleUrls: ['./record-new-round.component.scss']
})
export class RecordNewRoundComponent implements OnInit {

  public courses: GolfCourse[];
  public workingSummary: any = {};

  public selectedCourseId: string;

  public friends: Friend[];
  public selectedFriends: Friend[];
  public selectedCourse: GolfCourse;
  public selectedRoundType: RoundType = RoundType.FULL_18; // TODO: have the user choose this!
  public selectedTeebox: TeeBox;
  public selectedDate: Moment;
  public selectedScore: number;
  public step: number = 1;
  public summary: Score;
  public friendSummary: Score[];

  private stepHistory: number[];
  private readonly DATE_FORMAT: string = 'MM-DD-YYYY';
  private originalCourseHoleList: GolfHole[];

  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private scoreService: ScoreService,
    private courseService: CourseService,
    private router: Router,
    private localStorage: StorageMap,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    this.stepHistory = new Array<number>();
  }

  async ngOnInit(): Promise<void> {
    this.courses = await this.getCourses();
  }

  public submitCourse = (): void => {
    this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.courseService.getCourse(this.workingSummary.selectedCourseId).subscribe(x => {
      this.workingSummary.selectedCourse = x;
      this.workingSummary.originalCourseHoleList = this.workingSummary.selectedCourse.Holes;
      this.workingSummary.originalCourseHoleList.sort((a, b) => {
        return a.Number - b.Number;
      });
      this.incrementStep();
      this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      console.log(this.workingSummary);
    });
  }

  public submitRoundType = (): void => {
    switch (this.workingSummary.selectedRoundType) {
      case (this.roundType.FULL_18):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList;
        break;
      case (this.roundType.FRONT_9):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList.slice(0, 9);
        break;
      case (this.roundType.BACK_9):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList.slice(9);
        break;
    }
    this.incrementStep();
    console.log(this.workingSummary);
  }

  public submitDate = (): void => {
    console.log(this.workingSummary);
    this.incrementStep();
  }

  public submitTeebox = (): void => {
    console.log(this.workingSummary);
    this.incrementStep();
  }

  public submitScore = (): void => {
    console.log(this.workingSummary);
    this.incrementStep();
  }

  public skipFriends = (): void => {
    console.log(this.workingSummary);
    this.incrementStep(2);
  }

  public submitFriendList = (): void => {
    console.log(this.workingSummary);
    this.incrementStep(1);
  }

  public submitFriendsScores = (): void => {
    console.log(this.workingSummary);
    this.buildSummary();
  }

  private buildSummary(): void {
    this.userService.getUser().then(x => {
      this.summary = {
        ScoreId: uuid(),
        CourseId: this.workingSummary.selectedCourseId,
        CourseName: this.workingSummary.selectedCourse.Name,
        RoundType: this.workingSummary.selectedRoundType,
        Date: this.workingSummary.selectedDate.unix(),
        PrettyDate: this.workingSummary.selectedDate.format(this.DATE_FORMAT),
        Score: this.workingSummary.selectedScore,
        RelativeScore: this.getRelativeScore(this.workingSummary.selectedScore, this.workingSummary.selectedCourse),
        TeeboxColor: this.workingSummary.selectedTeebox.Color,
        PlayerId: x.id,
        PlayerName: x.displayName
      };

      if (this.workingSummary.friendSummary && this.workingSummary.friendSummary.length > 0) {
        this.friendSummary = [];
        this.workingSummary.friendSummary.map(y => {
          this.friendSummary.push({
            ScoreId: uuid(),
            CourseId: this.workingSummary.selectedCourseId,
            CourseName: this.workingSummary.selectedCourse.Name,
            RoundType: this.workingSummary.selectedRoundType,
            Date: this.workingSummary.selectedDate.unix(),
            PrettyDate: this.workingSummary.selectedDate.format(this.DATE_FORMAT),
            Score: y.Score,
            RelativeScore: this.getRelativeScore(y.Score, this.workingSummary.selectedCourse),
            TeeboxColor: y.Teebox.Color,
            PlayerId: y.Friend.FriendId,
            PlayerName: y.Friend.Name
          })
        })
      }
      this.incrementStep();
    });
  }

  public submitFinal(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    let scores = new Array<Score>();
    scores.push(this.summary);
    if (this.friendSummary && this.friendSummary.length > 0) {
      scores = scores.concat(this.friendSummary);
    }

    this.scoreService.postScores(scores).subscribe(x => {
      this.incrementStep();
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    },
      err => {
        console.error('An error occurred trying to POST scores.');
        this.localStorage.get(this.consts.APP_DATA.SCORE_SUBMISSIONS).subscribe(x => {
          let y = x as Score[];
          if (!y) {
            y = new Array<Score>();
          }
          y.push(this.summary);
          this.localStorage.set(this.consts.APP_DATA.SCORE_SUBMISSIONS, y).subscribe(() => {
            this.step = -1;
            this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
          });
        });
      });
  }

  public goHome(): void {
    this.router.navigateByUrl('/landing');
  }

  public hitBackButton(): void {
    this.decrementStep();
  }

  public hideBackButton(): boolean {
    return this.step === 1
      || this.step === 10
      || this.step < 0; // start page or summary page
  }

  public getParSummary(score?: number): string {
    let parScore = this.getRelativeScore(score, this.workingSummary.selectedCourse);
    if (parScore < 0) {
      parScore = parScore * -1;
      return `${parScore} under par`;
    } else if (parScore > 0) {
      return `${parScore} over par`;
    } else {
      return `Even par`;
    }
  }

  public getRelativeScore(num: number, course: GolfCourse): number {
    let par = 0;
    course.Holes.map(x => {
      par += x.Par;
    })

    return num - par;
  }

  public get roundType(): typeof RoundType {
    return RoundType;
  }

  // retrieves the list of courses from the api and sorts
  // the list alphabetically
  private async getCourses(): Promise<GolfCourse[]> {
    const list = (await this.courseService.getCourses().toPromise());
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    return list.sort((a, b) => {
      const nameA = a.Name.toUpperCase();
      const nameB = b.Name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameB < nameA) {
        return 1;
      }
      return 0;
    });
  }

  private incrementStep(inc: number = 1): void {
    this.stepHistory.push(this.step);
    this.step += inc;
    console.log(`step: ${this.step}`)
  }

  private decrementStep(): void {
    this.step = this.stepHistory.pop();
    console.log(`step: ${this.step}`)
  }
}
