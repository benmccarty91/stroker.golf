import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { Score } from 'src/models/Score';
import { StrokerUser } from 'src/models/StrokerUser';
import { FriendService } from 'src/services/FriendService';
import { PubSubService } from 'src/services/PubSubService';
import { ScoreService } from 'src/services/ScoreService';
import { UserService } from 'src/services/UserService';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BASE_PAGE implements OnInit {

  public user: StrokerUser = null;
  public displayName = null;

  public pendingFriends: string;
  public pendingScores: Score[];

  constructor(
    private userService: UserService,
    private router: Router,
    private friendService: FriendService,
    private scoreService: ScoreService,
    private storageService: StorageMap,
    private pubsubService: PubSubService,
    private consts: CONSTS,
  ) {
    super(pubsubService, consts);
  }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.displayName = this.user ? this.user.displayName : null;
      this.friendService.getLandingBadge().subscribe(num => {
        this.pendingFriends = num >= 10 ? '+' : `${num}`;
      });
      this.storageService.delete(this.consts.APP_DATA.PENDING_SCORES).subscribe(() => { //delete pending scores from local storage
        this.scoreService.getPendingScores().subscribe(scores => { //get fresh scores from api
          this.storageService.set(this.consts.APP_DATA.PENDING_SCORES, scores).subscribe(() => { //save fresh scores to local storage
            this.pendingScores = scores; //set global var so template updates
          });
        });
      });
    });
  }

  handleLink(path: string): void {
    this.router.navigateByUrl(path);
  }
}
