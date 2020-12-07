import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend } from 'src/models/Friend';
import { FriendService } from 'src/services/FriendService';
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
    private router: Router,
    private pubsubService: PubSubService,
    private friendService: FriendService,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.friendService.getFriends().subscribe(res => {
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
    this.friendService.saveSelectedFriend(friend).subscribe(() => {
      this.router.navigateByUrl(`/friends/${friend.FriendId}`);
    });
  }

}
