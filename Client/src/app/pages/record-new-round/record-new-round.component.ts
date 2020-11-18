import { Component, OnInit } from '@angular/core';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-record-new-round',
  templateUrl: './record-new-round.component.html',
  styleUrls: ['./record-new-round.component.scss']
})
export class RecordNewRoundComponent extends BASE_PAGE implements OnInit {

  constructor(
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsubService, consts);
  }
  ngOnInit(): void {
  }

}
