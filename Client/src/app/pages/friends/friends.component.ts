import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friends: string[];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) { }

  ngOnInit(): void {
    this.apiService.get<any[]>('/friend').subscribe(res => {
      this.friends = res;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    },
    err => {
      console.error(err);
    });
  }

  addFriendClicked(): void {
    this.router.navigateByUrl('/friends/add');
  }

}
