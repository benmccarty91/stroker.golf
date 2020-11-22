import { Component, OnInit } from '@angular/core';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-past-scores',
  templateUrl: './past-scores.component.html',
  styleUrls: ['./past-scores.component.scss']
})
export class PastScoresComponent extends BASE_PAGE implements OnInit {

  constructor(
    private apiService: ApiService,
    private pubsubService: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsubService, consts);
  }
  ngOnInit(): void {
    this.apiService.get('/score/D7YPxncYHjYBg6DNo9BMud3Ajhj1/2020').subscribe(x => {
      console.log(x);
    });
  }

}
