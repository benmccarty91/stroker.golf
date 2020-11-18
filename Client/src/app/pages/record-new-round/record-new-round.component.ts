import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, OnInit } from '@angular/core';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-record-new-round',
  templateUrl: './record-new-round.component.html',
  styleUrls: ['./record-new-round.component.scss']
})
export class RecordNewRoundComponent extends BASE_PAGE implements OnInit {

  public courses: GolfCourse[];
  public selectedCourseId: string;
  public selectedCourse: GolfCourse;
  public step: number = 1;

  constructor(
    private apiService: ApiService,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsubService, consts);
  }
  async ngOnInit(): Promise<void> {
    this.courses = await this.getCourses();
  }

  public submitFirst(): void {
    this.step++;
    this.getCourse(this.selectedCourseId);
  }

  public submitSecond(answer: boolean): void {
    this.step++;
    if (!answer) {
      this.step++;
    }
  }

  public submitThird(): void {
    //TODO: get friends working!!!
    this.step++;
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
    this.apiService.get(`/course/${id}`).subscribe(x => {
      this.selectedCourse = x;
    })
  }
}
