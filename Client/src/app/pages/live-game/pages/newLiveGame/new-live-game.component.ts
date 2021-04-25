import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CONSTS } from 'src/assets/CONSTS';
import { GolfCourse } from 'src/models/GolfCourse';
import { RoundType } from 'src/models/Score';
import { CourseService } from 'src/services/CourseService';
import { LiveRoundService } from 'src/services/LiveRoundService';
import { PubSubService } from 'src/services/PubSubService';
import { ErrorComponent } from '../../components/error.component';

@Component({
  selector: 'app-new-live-game',
  templateUrl: './new-live-game.component.html',
  styleUrls: ['./new-live-game.component.scss']
})
export class NewLiveGameComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public step: number = 1;
  public workingSummary: any = {};// = JSON.parse(`{"selectedCourseId":"EZATJkB9OzDQaQT1JwHo","selectedCourse":{"StreetAddress":"3740 N Pollard Ln","City":"Star","TeeBoxes":[{"MensSlope":119,"WomensSlope":119,"Color":"Black","MensRating":71.7,"WomensRating":71.7},{"MensRating":70,"Color":"Blue","WomensRating":75.6,"WomensSlope":127,"MensSlope":113},{"WomensRating":72.9,"MensSlope":103,"Color":"White","WomensSlope":122,"MensRating":67.8},{"Color":"Red","WomensRating":70.1,"WomensSlope":115,"MensSlope":103,"MensRating":64.6}],"State":"Idaho","Holes":[{"Handicap":4,"Par":5,"Number":1,"Yardages":{"Black":512,"White":469,"Blue":486,"Red":446}},{"Number":2,"Yardages":{"Black":372,"Red":310,"Blue":358,"White":343},"Handicap":14,"Par":4},{"Par":4,"Number":3,"Handicap":8,"Yardages":{"Blue":372,"Red":320,"Black":400,"White":361}},{"Number":4,"Handicap":18,"Par":3,"Yardages":{"Red":111,"Black":155,"White":133,"Blue":152}},{"Handicap":12,"Yardages":{"Black":358,"White":284,"Blue":341,"Red":272},"Number":5,"Par":4},{"Handicap":6,"Yardages":{"Black":423,"White":392,"Blue":408,"Red":376},"Number":6,"Par":4},{"Par":4,"Yardages":{"Black":360,"Red":281,"Blue":344,"White":317},"Number":7,"Handicap":16},{"Number":8,"Yardages":{"Blue":184,"Black":192,"White":172,"Red":154},"Par":3,"Handicap":10},{"Handicap":2,"Yardages":{"White":446,"Blue":508,"Red":415,"Black":546},"Number":9,"Par":5},{"Yardages":{"Black":525,"Blue":491,"White":461,"Red":452},"Handicap":9,"Par":5,"Number":10},{"Par":4,"Yardages":{"Black":476,"Blue":449,"Red":424,"White":439},"Number":11,"Handicap":1},{"Number":12,"Yardages":{"Blue":363,"Red":324,"Black":403,"White":346},"Handicap":11,"Par":4},{"Par":3,"Number":13,"Yardages":{"Black":214,"Blue":188,"White":154,"Red":123},"Handicap":13},{"Par":3,"Yardages":{"White":149,"Blue":160,"Red":139,"Black":182},"Handicap":15,"Number":14},{"Number":15,"Yardages":{"White":462,"Black":503,"Blue":473,"Red":404},"Handicap":7,"Par":5},{"Yardages":{"White":351,"Red":267,"Black":415,"Blue":383},"Par":4,"Number":16,"Handicap":5},{"Yardages":{"Blue":318,"White":302,"Red":286,"Black":343},"Par":4,"Number":17,"Handicap":17},{"Number":18,"Handicap":3,"Yardages":{"Blue":537,"Red":433,"Black":595,"White":479},"Par":5}],"Name":"River Birch Golf Course","Id":"EZATJkB9OzDQaQT1JwHo"},"selectedTeebox":{"WomensRating":72.9,"MensSlope":103,"Color":"White","WomensSlope":122,"MensRating":67.8},"friendSummary":[{"Friend":{"FriendStatus":"Accepted","FriendId":"69eh9Bl9cbYwCXoTeV4xDDID8sb2","Name":"Ben Test Account","UserId":"enaoUPNLEOg3roM7MrnhXO4wyor1","Email":"ben.mccarty@live.com","PhotoUrl":"https://firebasestorage.googleapis.com/v0/b/stroker-af4d5.appspot.com/o/profileImages%2F69eh9Bl9cbYwCXoTeV4xDDID8sb2%2Fphoto?alt=media&token=8e9b0ceb-df37-4aad-869d-61227c69fffb","ApprovalAuthority":"69eh9Bl9cbYwCXoTeV4xDDID8sb2"},"Teebox":{"MensRating":70,"Color":"Blue","WomensRating":75.6,"WomensSlope":127,"MensSlope":113}}]}`);
  public courses: GolfCourse[];

  private stepHistory: Array<number> = [];

  constructor(
    private courseService: CourseService,
    private pubsub: PubSubService,
    private consts: CONSTS,
    private liveRoundService: LiveRoundService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
  ) {
  }

  public ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.loading = false;
      this.pubsub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  public ngOnDestroy(): void {
  }

  public hitBackButton(): void {
    if (this.step > 1) {
      this.step = this.stepHistory.pop();
    } else {
      this.location.back();
    }
  }

  private incrementStep(amount: number = 1): void {
    this.stepHistory.push(this.step);
    this.step += amount;
  }

  public courseSumbit = (): void => {
    this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.courseService.getCourse(this.workingSummary.selectedCourseId).subscribe(course => {
      this.workingSummary.selectedCourse = course;
      this.workingSummary.originalCourseHoleList = this.workingSummary.selectedCourse.Holes;
      this.workingSummary.originalCourseHoleList.sort((a, b) => {
        return a.Number - b.Number;
      });
      this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      this.incrementStep();
    })
  }

  public teeboxSubmit = (): void => {
    this.incrementStep();
  }

  public submitFriends = (): void => {
    if (this.workingSummary.friendSummary && this.workingSummary.friendSummary.length > 0) {
      this.incrementStep();
    } else {
      this.incrementStep(2);
    }
  }

  public skipFriends = (): void => {
    this.workingSummary.friendSummary = null;
    this.incrementStep(2);
  }

  public submitFriendTeebox = (): void => {
    this.incrementStep();
  }

  public submitRoundType = (): void => {
    switch (this.workingSummary.selectedRoundType) {
      case (this.roundType.FULL_18):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList;
        break;
      case (this.roundType.FRONT_9):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList.slice(0, 9);
        break;
      case (this.roundType.BACK_9):
        this.workingSummary.selectedCourse.Holes = this.workingSummary.originalCourseHoleList.slice(9);
        break;
    }
    this.incrementStep();
  }

  public submitSummary = (event): void => {
    // console.log(event);
    this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.liveRoundService.createNewLiveRound(event).subscribe(() => {
      this.router.navigateByUrl('/liveGame/currentGame');
    },
    () => {
      const dialogRef = this.dialog.open(ErrorComponent);
      dialogRef.afterClosed().subscribe(() => {
        this.pubsub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
      })
    });
  }

  public get roundType(): typeof RoundType {
    return RoundType;
  }
}



