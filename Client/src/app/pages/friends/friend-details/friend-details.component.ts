import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CONSTS } from 'src/assets/CONSTS';
import { Friend } from 'src/models/Friend';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-friend-details',
  template: `
    <p *ngIf="friend">
      {{friend.Name}}
    </p>
  `,
  styles: [
  ]
})
export class FriendDetailsComponent implements OnInit {

  public friend: Friend;

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS,
    private localStorage: StorageMap,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.localStorage.get<Friend>(this.consts.APP_DATA.SELECTED_FRIEND).subscribe(friend => {
      this.friend = friend as Friend;
      this.pubsubService.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });

    // not sure why this would be necessary, but I got the url parsing to work
    // this.route.paramMap.subscribe(x => {
    //   console.log(x.get('id'));
    // });
  }

}
