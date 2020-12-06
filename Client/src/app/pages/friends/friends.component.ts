import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend } from 'src/models/Friend';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: Friend[];
  public loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private localStorage: StorageMap,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.apiService.get<Friend[]>('/friend').subscribe(res => {
      this.friends = res;
      this.loading = false;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    },
      err => {
        console.error(err);
      });
  }

  addFriendClicked(): void {
    this.router.navigateByUrl('/friends/add');
  }

  clickFriend(friend: Friend): void {
    this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_START);
    this.localStorage.set(this.consts.APP_DATA.SELECTED_FRIEND, friend).subscribe(() => {
      this.router.navigateByUrl(`/friends/${friend.FriendId}`);
    });
  }

}
