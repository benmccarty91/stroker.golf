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

  public submitCourse = (courseId: string): void => {
    this.selectedCourseId = courseId;
    this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.courseService.getCourse(courseId).subscribe(x => {
      this.selectedCourse = x;
      this.originalCourseHoleList = this.selectedCourse.Holes;
      this.originalCourseHoleList.sort((a, b) => {
        return a.Number - b.Number;
      });
      this.incrementStep();
      this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
    });
  }

  public submitRoundType(): void {
    switch (this.selectedRoundType) {
      case (this.roundType.FULL_18):
        this.selectedCourse.Holes = this.originalCourseHoleList;
        break;
      case (this.roundType.FRONT_9):
        this.selectedCourse.Holes = this.originalCourseHoleList.slice(0, 9);
        break;
      case (this.roundType.BACK_9):
        this.selectedCourse.Holes = this.originalCourseHoleList.slice(9);
        break;
    }
    this.incrementStep();
  }

  public submitTeebox(): void {
    this.incrementStep();
  }

  public submitFriendSelect(answer: boolean): void {
    if (answer) {
      this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
      this.friendService.getFriends().subscribe(friends => {
        this.friends = friends.filter(friend => friend.FriendStatus === FriendStatus.ACCEPTED);
        this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      });
      this.incrementStep(1);
    } else {
      this.incrementStep(3);
    }
  }

  public submitFriendList(): void {
    this.friendSummary = [];
    if (this.selectedFriends && this.selectedFriends.length > 0) {
      this.selectedFriends.forEach(friend => {
        this.friendSummary.push({
          ScoreId: uuid(),
          CourseId: this.selectedCourseId,
          CourseName: this.selectedCourse.Name,
          Date: this.selectedDate.unix(),
          PlayerId: friend.FriendId,
          PlayerName: friend.Name,
          PrettyDate: this.selectedDate.format(this.DATE_FORMAT),
          RoundType: this.selectedRoundType,
          Score: this.selectedScore,
          TeeboxColor: this.selectedTeebox.Color,
          RelativeScore: this.getRelativeScore(this.selectedScore)
        });
      })
      this.incrementStep();
    } else {
      this.incrementStep(2);
    }
  }

  public submitFriendsScores(): void {
    this.incrementStep();
  }

  public submitDate(): void {
    this.incrementStep();
  }

  public dateChange(event: MatDatepickerInputEvent<Moment>): void {
    this.selectedDate = event.value;
  }

  public selectScore(num: number): void {
    this.selectedScore = num;
  }

  public friendScorePickerHandler(score: Score, num: number): void {
    score.Score = num;
    score.RelativeScore = this.getRelativeScore(num);
  }

  public buildSummary(): void {
    this.userService.getUser().then(x => {
      this.summary = {
        ScoreId: uuid(),
        CourseId: this.selectedCourseId,
        CourseName: this.selectedCourse.Name,
        RoundType: this.selectedRoundType,
        Date: this.selectedDate.unix(),
        PrettyDate: this.selectedDate.format(this.DATE_FORMAT),
        Score: this.selectedScore,
        RelativeScore: this.getRelativeScore(this.selectedScore),
        TeeboxColor: this.selectedTeebox.Color,
        PlayerId: x.id,
        PlayerName: x.displayName
      };
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

  public selectFriend(friend: Friend): void {
    if (!this.selectedFriends) { // if list hasn't been initialized
      this.selectedFriends = [];
    }
    const existingIndex = this.selectedFriends.indexOf(friend);
    if (existingIndex > -1) { // friend has already been selected 
      this.selectedFriends.splice(existingIndex, 1); // then remove it (deselect)
    } else {
      this.selectedFriends.push(friend); // otherwise, add the friend to the list
    }
  }

  public isFriendSelected(friend: Friend): boolean {
    return this.selectedFriends && this.selectedFriends.includes(friend);
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

  private getCoursePar(): number {
    let par = 0;
    this.selectedCourse.Holes.map(x => {
      par += x.Par;
    });
    return par;
  }

  public getParSummary(score?: number): string {
    let parScore = this.getRelativeScore(score || this.selectedScore);
    if (parScore < 0) {
      parScore = parScore * -1;
      return `${parScore} under par`;
    } else if (parScore > 0) {
      return `${parScore} over par`;
    } else {
      return `Even par`;
    }
  }

  public getRelativeScore(num: number): number {
    const coursePar = this.getCoursePar();
    return num - coursePar;
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
  }

  private decrementStep(): void {
    this.step = this.stepHistory.pop();
  }
}
