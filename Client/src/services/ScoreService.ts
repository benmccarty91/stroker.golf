import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
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
}
