import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-failure',
  template: `
    <div id="container">
      <h2>Failure :(</h2>
      <p>
        We couldn't submit your score because we couldn't connect to the interwebs.
      </p>
      <p>
        Don't worry, your round has been saved and you can try submitting it again later.
      </p>
      <button mat-stroked-button class="wideButton" (click)="submit()">Go Home</button>
    </div>
  `,
  styles: [
    `
    * {
      margin: 0;
      margin-top: 10px;
    }

    #container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: stretch;
    }
    `
  ]
})
export class SubmitFailureComponent implements OnInit {

  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  submit(): void {
    this.submitHandler();
  }

}
