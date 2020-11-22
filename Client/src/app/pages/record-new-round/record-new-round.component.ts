import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { ScoreSubmission } from 'src/models/ScoreSubmission';
import { TeeBox } from 'src/models/TeeBox';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-record-new-round',
  templateUrl: './record-new-round.component.html',
  styleUrls: ['./record-new-round.component.scss']
})
export class RecordNewRoundComponent extends BASE_PAGE implements OnInit {

  public courses: GolfCourse[];
  public selectedCourseId: string;
  public selectedCourse: GolfCourse;
  public selectedTeebox: TeeBox;
  public selectedDate: Moment;
  public selectedScore: number;
  public step: number = 1;
  public summary: ScoreSubmission;

  private stepHistory: number[];
  private readonly DATE_FORMAT: string = 'MM-DD-YYYY';

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsubService, consts);
    this.stepHistory = new Array<number>();
  }
  async ngOnInit(): Promise<void> {
    this.courses = await this.getCourses();
    // this.summary = data;
  }

  public submitCourse(): void {
    this.incrementStep();
    this.getCourse(this.selectedCourseId);
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
        Date: this.selectedDate.unix(),
        PrettyDate: this.selectedDate.format(this.DATE_FORMAT),
        Score: this.selectedScore,
        TeeboxColor: this.selectedTeebox.Color,
        PlayerId: x.id,
        PlayerName: x.displayName
      };

      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
      this.incrementStep();
    });
  }

  public submitFinal(): void {
    // TODO: submit the final score (not sure how we want to structure the data)
    console.log('submitted!');
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.apiService.post('/score', this.summary).subscribe(x => {
      console.log(x);
      this.incrementStep();
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  public goHome(): void {
    this.router.navigateByUrl('/landing');
  }

  public hitBackButton(): void {
    this.decrementStep();
  }

  public hideBackButton(): boolean {
    return this.step === 1;
  }

  private getCoursePar(): number {
    let par = 0;
    this.selectedCourse.Holes.map(x => {
      par += x.Par;
    });
    return par;
  }

  public getParSummary(): string {
    const score = this.selectedScore;
    const coursePar = this.getCoursePar();
    let parScore = score - coursePar;
    if (parScore < 0) {
      parScore = parScore * -1;
      return `${parScore} under par`;
    } else if (parScore > 0) {
      return `${parScore} over par`;
    } else {
      return `Even par`;
    }
  }

  // retrieves the list of courses from the api and sorts
  // the list alphabetically
  private async getCourses(): Promise<GolfCourse[]> {
    const list = (await this.apiService.get('/course').toPromise()) as GolfCourse[];
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
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.apiService.get(`/course/${id}`).subscribe(x => {
      this.selectedCourse = x;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
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
