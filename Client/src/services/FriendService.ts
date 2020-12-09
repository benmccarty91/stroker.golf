import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend } from 'src/models/Friend';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root',
})
export class FriendService {

  private numApprovals: number = 0;

  constructor(
    private apiService: ApiService,
    private localStorage: StorageMap,
    private consts: CONSTS
  ) { }

  public getLandingBadge(): Observable<number> {
    return this.apiService.get<any>('/friend/pendingCount').pipe(
      map(res => res.num)
    );
  }

  public getFriends(): Observable<Friend[]> {
    return this.apiService.get<Friend[]>('/friend').pipe(
      map(res => res),
      catchError((err) => {
        console.error(err);
        return of(new Array<Friend>());
      })
    );
  }

  public getFriend(key: string): Observable<Friend> {
    return this.apiService.get<Friend>(`/friend/${key}`).pipe(
      map(friend => friend),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  public saveSelectedFriend(friend: Friend): Observable<void> {
    return this.localStorage.set(this.consts.APP_DATA.SELECTED_FRIEND, friend);
  }

  public getSelectedFriend(id: string): Observable<Friend> {
    return this.localStorage.get<Friend>(this.consts.APP_DATA.SELECTED_FRIEND).pipe(
      mergeMap(friend => {
        if (friend) { return of(friend as Friend); }
        return this.getFriend(id);
      }),
      catchError(err => {
        console.log(err);
        return this.getFriend(id);
      })
    );
  }

  public removeFriend(friendId: string): Observable<void> {
    return this.apiService.delete(`/friend/${friendId}`).pipe(
      map(() => { })
    );
  }

  public deleteRequest(friendId: string): Observable<void> {
    return this.apiService.delete(`/friend/${friendId}`).pipe(
      map(() => { })
    );
  }

  public approveRequest(friendId: string): Observable<void> {
    return this.apiService.put(`/friend/${friendId}/approve`, null).pipe(
      map(() => { })
    );
  }

  public declineRequest(friendId: string): Observable<void> {
    return this.apiService.delete(`/friend/${friendId}`).pipe(
      map(() => { })
    );
  }
}
