import { Component, OnInit } from '@angular/core';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-new-live-game',
  templateUrl: './new-live-game.component.html',
  styleUrls: ['./new-live-game.component.scss']
})
export class NewLiveGameComponent extends BASE_PAGE implements OnInit {

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsubService, consts);
  }

  ngOnInit(): void {
  }

}
