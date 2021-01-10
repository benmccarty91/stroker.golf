import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { asapScheduler, Observable, of, scheduled } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private apiService: ApiService,
    private localStorage: StorageMap,
    private consts: CONSTS
  ) { }

  public getCourses(): Observable<GolfCourse[]> {
    return this.apiService.get<GolfCourse[]>('/course');
  }

  public getCourse(id: string): Observable<GolfCourse> {
    return this.apiService.get<GolfCourse>(`/course/${id}`);
  }

  public postCourse(newCourse: GolfCourse): Observable<void> {
    return this.apiService.post(`/course`, newCourse);
  }

  public saveToDevice(newCourse: GolfCourse): Observable<any> {
    return this.localStorage.get<GolfCourse[]>(this.consts.APP_DATA.NEW_COURSE_SUBMISSIONS).pipe(
      mergeMap((x: GolfCourse[], index) => {
        if (!x) {
          x = new Array<GolfCourse>();
        }
        x.push(newCourse);
        return this.localStorage.set(this.consts.APP_DATA.NEW_COURSE_SUBMISSIONS,x);
      }),
      catchError(err => {
        return scheduled([err], asapScheduler); // of() is deprecated
      })
    );
  }
}
