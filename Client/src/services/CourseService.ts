import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GolfCourse } from 'src/models/GolfCourse';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(
    private apiService: ApiService
  ) { }

  public getCourses(): Observable<GolfCourse[]> {
    return this.apiService.get<GolfCourse[]>('/course');
  }

  public getCourse(id: string): Observable<GolfCourse> {
    return this.apiService.get<GolfCourse>(`/course/${id}`);
  }


}
