import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Moment } from 'moment';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { GolfHole } from 'src/models/GolfHole';
import { RoundType, Score } from 'src/models/Score';
import { TeeBox } from 'src/models/TeeBox';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-record-new-round',
  templateUrl: './record-new-round.component.html',
  styleUrls: ['./record-new-round.component.scss']
})
export class RecordNewRoundComponent implements OnInit {

  public courses: GolfCourse[];
  public selectedCourseId: string;
  public selectedCourse: GolfCourse;
  public selectedRoundType: RoundType = RoundType.FULL_18; // TODO: have the user choose this!
  public selectedTeebox: TeeBox;
  public selectedDate: Moment;
  public selectedScore: number;
  public step: number = 1;
  public summary: Score;

  private stepHistory: number[];
  private readonly DATE_FORMAT: string = 'MM-DD-YYYY';
  private originalCourseHoleList: GolfHole[];

  constructor(
    private apiService: ApiService,
    private userService: UserService,
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

  public submitCourse(): void {
    this.incrementStep();
    this.getCourse(this.selectedCourseId);
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
      this.incrementStep(1);
    } else {
      this.incrementStep(2);
    }
  }

  public submitFriendList(): void {
    //TODO: get friends working!!!
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

  public buildSummary(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);

    this.userService.getUser().then(x => {
      this.summary = {
        CourseId: this.selectedCourseId,
        CourseName: this.selectedCourse.Name,
        RoundType: this.selectedRoundType,
        Date: this.selectedDate.unix(),
        PrettyDate: this.selectedDate.format(this.DATE_FORMAT),
        Score: this.selectedScore,
        RelativeScore: this.getRelativeScore(),
        TeeboxColor: this.selectedTeebox.Color,
        PlayerId: x.id,
        PlayerName: x.displayName
      };

      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      this.incrementStep();
    });
  }

  public submitFinal(): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.apiService.post('/score', this.summary).subscribe(x => {
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
      || this.step === 8
      || this.step < 0; // start page or summary page
  }

  private getCoursePar(): number {
    let par = 0;
    this.selectedCourse.Holes.map(x => {
      par += x.Par;
    });
    return par;
  }

  public getParSummary(): string {
    let parScore = this.getRelativeScore();
    if (parScore < 0) {
      parScore = parScore * -1;
      return `${parScore} under par`;
    } else if (parScore > 0) {
      return `${parScore} over par`;
    } else {
      return `Even par`;
    }
  }

  public getRelativeScore(): number {
    const coursePar = this.getCoursePar();
    const score = this.selectedScore;
    return score - coursePar;
  }

  public get roundType(): typeof RoundType {
    return RoundType;
  }

  // retrieves the list of courses from the api and sorts
  // the list alphabetically
  private async getCourses(): Promise<GolfCourse[]> {
    const list = (await this.apiService.get<GolfCourse[]>('/course').toPromise());
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

  private getCourse(id: string): void {
    this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.apiService.get<GolfCourse>(`/course/${id}`).subscribe(x => {
      this.selectedCourse = x;
      this.originalCourseHoleList = this.selectedCourse.Holes;
      this.originalCourseHoleList.sort((a, b) => {
        return a.Number - b.Number;
      });
      this.pubsubService.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
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
