import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import { Score } from 'src/models/Score';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(
    private apiService: ApiService,
  ) { }

  getScores(userId: string, year: string): Observable<Score[]> {
    return this.apiService.get<Score[]>(`/score/${userId}/${year}`);
  }

  getFriendScores(friendId: string): Observable<Score[]> {
    return this.apiService.get<Score[]>(`/friend/${friendId}/score`);
  }

  getPendingScores(): Observable<Score[]> {
    return this.apiService.get<Score[]>('/score/pending').pipe(
      map((x: Score[]) => x.sort((y, z) => z.Date - y.Date)) // sorted descending by date
    );
  }

  confirmPendingScore(score: Score): Observable<void> {
    return of();
  }

  deletePendingScore(score: Score): Observable<void> {
    return of();
  }

  postScores(scores: Score[]): Observable<any> {
    if (scores && scores.length > 0) {
      return this.apiService.post('/score', scores);
    } else {
      throw Error('cannot post empty scores');
    }
  }
}
